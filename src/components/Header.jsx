import '@/styles/components.scss'
import '@/styles/Header.scss'
import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <div className="header">
            <Link to="/" className="text link">
                Homepage
            </Link>
            <Link to="/blog/create" className="text link">
                Create blog post
            </Link>
        </div>
    )
}
