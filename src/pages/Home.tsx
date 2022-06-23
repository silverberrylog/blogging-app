import '@/styles/components.scss'
import '@/styles/Home.scss'
import Popup from '@/components/Popup'
import { Post } from '@/types/models'
import { postsCol } from '@/utils/db'
import {
    endAt,
    endBefore,
    getDocs,
    limit,
    limitToLast,
    orderBy,
    Query,
    query,
    QueryConstraint,
    QuerySnapshot,
    startAfter,
    startAt,
} from 'firebase/firestore/lite'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Select from '@/components/Select'

interface SortingOption {
    name: string
    value: 'asc' | 'desc'
}

const postsPerPage = 10
const sortingOptions: SortingOption[] = [
    { name: 'Show oldest first', value: 'desc' },
    { name: 'Show newest first', value: 'asc' },
]

export default function Home() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [currentBatch, setCurrentBatch] = useState<Post[]>([])
    const [sortingOrder, setSortingOrder] = useState(sortingOptions[1].value)
    const [noResults, setNoResults] = useState<boolean>(false)
    const [canGoTo, setCanGoTo] = useState({
        previousPage: true,
        nextPage: true,
    })

    const location = useLocation()
    const navigate = useNavigate()

    const getBlogPostsQuery = (
        previous: boolean,
        sortingOrder: 'asc' | 'desc',
        currentBlogPosts: Post[]
    ): QueryConstraint[] => {
        const _query: QueryConstraint[] = [orderBy('createdAt', sortingOrder)]

        if (previous) {
            if (currentBlogPosts.length > 0) {
                const firstBlogPost = currentBlogPosts[0]
                _query.push(endBefore(firstBlogPost.createdAt))
            }
            _query.push(limitToLast(postsPerPage))
            return _query
        }

        if (currentBlogPosts.length > 0) {
            const lastBlogPost = currentBlogPosts[currentBlogPosts.length - 1]
            _query.push(startAfter(lastBlogPost.createdAt))
        }
        _query.push(limit(postsPerPage))
        return _query
    }

    const getBlogPosts = async (
        previous: boolean = false,
        reset: boolean = false
    ) => {
        setIsLoading(true)

        setNoResults(false)
        setCanGoTo({
            previousPage: true,
            nextPage: true,
        })
        let currentBlogPosts = reset ? [] : currentBatch

        let snapshot: QuerySnapshot<Post> = await getDocs(
            query(
                postsCol,
                ...getBlogPostsQuery(previous, sortingOrder, currentBlogPosts)
            )
        )
        let posts: Post[] = []
        snapshot.forEach(post => posts.push(post.data()))

        if (snapshot.empty) {
            setNoResults(true)
            setCanGoTo({
                previousPage: previous,
                nextPage: !previous,
            })
        }
        if (snapshot.size < postsPerPage) {
            setCanGoTo({
                previousPage: !previous,
                nextPage: previous,
            })
        }

        setCurrentBatch(posts)
        setIsLoading(false)
    }

    useEffect(() => {
        getBlogPosts()
    }, [])

    useEffect(() => {
        getBlogPosts(false, true)
    }, [sortingOrder])

    return (
        <div>
            <div className="title-container">
                <h1 className="text-gigantic bold">Blog posts</h1>
                <Select
                    options={sortingOptions}
                    onSelect={setSortingOrder}
                    selected={sortingOrder}
                />
            </div>

            {location?.state?.popupMessage && (
                <Popup
                    message={location.state.popupMessage}
                    onClose={() =>
                        navigate('/', { state: null, replace: true })
                    }
                />
            )}

            {isLoading && <p>Loading...</p>}

            {noResults && <p>There are no results on this page</p>}

            <div className="blog-posts">
                {currentBatch.map(blogPost => (
                    <div key={blogPost.id} className="blog-post">
                        <h2 className="text-big bold">{blogPost.name}</h2>
                        <p>{blogPost.createdAt}</p>
                        <Link
                            to={`/blog/${blogPost.id}`}
                            className="btn-primary"
                        >
                            Read now
                        </Link>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <div className="btn-group">
                    <button
                        onClick={() => getBlogPosts(true)}
                        className="btn-secondary"
                        disabled={!canGoTo.previousPage}
                    >
                        Previous page
                    </button>
                    <button
                        onClick={() => getBlogPosts(false)}
                        className="btn-secondary"
                        disabled={!canGoTo.nextPage}
                    >
                        Next page
                    </button>
                </div>
            </div>

            {/* <h1 className="text-gigantic bold">Hello</h1>
            <h1 className="text-big bold">Hello</h1>
            <h2 className="text bold">Hello</h2>
            <h4 className="text-small bold">Hello</h4>
            <br />

            <p className="text-gigantic">Hello</p>
            <p className="text-big">Hello</p>
            <p className="text">Hello</p>
            <p className="text-small">Hello</p>
            <br />

            <div className="btn-group">
                <button className="btn-primary">Button</button>
                <button className="btn-secondary">Button</button>
            </div>
            <br />

            <input className="input" placeholder="Hello" />
            <input className="input" placeholder="John Doe" />
            <br />

            <div className="select">
                <div>Hehe</div>
                <div>hehehe</div>
                <div>hehehehhe</div>
            </div>
            <br />

            <div className="select open">
                <div>Hehe</div>
                <div>hehehe</div>
                <div>hehehehhe</div>
            </div>
            <br />

            <textarea className="textarea" value="Hello world"></textarea>
            <textarea className="textarea" placeholder="Hello"></textarea>

            <br />
            <a className="text link">Hello</a> */}
        </div>
    )
}
