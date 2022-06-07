import '@/styles/components.scss'
import '@/styles/Footer.scss'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer">
            <p className="text">
                Icons provided by{' '}
                <a href="https://icons8.com" className="link">
                    Icons8
                </a>
            </p>
        </footer>
    )
}
