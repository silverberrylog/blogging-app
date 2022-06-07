import '@/styles/components.scss'
import '@/styles/Popup.scss'

interface PopupProps {
    message: string
    onClose: () => void
}

export default function Popup({ message, onClose }: PopupProps) {
    return (
        <div className="popup">
            <p className="text">{message}</p>
            <img
                onClick={() => onClose()}
                src="/icons/icons8-close-16.png"
                alt="close icon"
            />
        </div>
    )
}
