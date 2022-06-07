interface SelectProps {
    isOpen: boolean
    onIsOpenChange: (newState: boolean) => void
    onSelect: (value: any) => void
    children: React.ReactNode
}

export default function Select({ isOpen, children }: SelectProps) {
    return <div></div>
}
