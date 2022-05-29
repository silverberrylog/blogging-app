import '@/styles/components.scss'
import '@/styles/Home.scss'

export default function Home() {
    return (
        <div>
            <h1 className="text-gigantic bold">Hello</h1>
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

            <textarea className="textarea">Hello world</textarea>
            <textarea className="textarea" placeholder="Hello"></textarea>

            <br />
            <a className="text link">Hello</a>
        </div>
    )
}
