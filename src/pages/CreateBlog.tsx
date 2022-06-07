import '@/styles/components.scss'
import '@/styles/CreateBlog.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useInputState } from '@/utils/hooks'
import { markdownToJson } from '@/utils/markdown'
import { postsCol } from '@/utils/db'
import { addDoc } from 'firebase/firestore/lite'
import { Post } from '@/types/models'

export default function CreateBlog() {
    const [title, setTitle] = useInputState('')
    const [content, setContent] = useInputState('')

    const navigate = useNavigate()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const parsedMd = markdownToJson(content)
        const post: Post = {
            name: title,
            content: JSON.stringify(parsedMd),
            createdAt: Date.now(),
        }

        await addDoc(postsCol, post)
        navigate('/', {
            state: {
                popupMessage: 'Blog post crated successfully',
            },
        })
    }

    return (
        <div>
            <h1 className="text-gigantic bold">Create a blog post</h1>

            <form className="form" onSubmit={handleSubmit}>
                <input
                    className="input"
                    type="text"
                    placeholder="Blog title"
                    value={title}
                    onChange={setTitle}
                />
                <textarea
                    className="textarea"
                    placeholder="Blog content (Markdown format)"
                    value={content}
                    onChange={setContent}
                ></textarea>

                <div className="btn-group align-right">
                    <Link
                        className="btn-secondary"
                        to="/"
                        target="_blank"
                        state={{}}
                    >
                        Preview
                    </Link>
                    <button className="btn-primary" type="submit">
                        Post
                    </button>
                </div>
            </form>
        </div>
    )
}
