import '@/styles/components.scss'
import '@/styles/CreateBlog.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useInputState } from '@/utils/hooks'
import { createBlog } from '@/utils/blogs'

export default function CreateBlog() {
    const [title, setTitle] = useInputState('')
    const [content, setContent] = useInputState('')

    const navigate = useNavigate()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        await createBlog(content, title)
        navigate('/', {
            state: {
                popupMessage: 'Blog post created successfully',
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
