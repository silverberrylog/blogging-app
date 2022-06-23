import '@/styles/components.scss'
import { useState } from 'react'

interface SelectProps {
    onSelect: (value: string) => void
    options: { name: string; value: string }[]
    selected: string
    // children: React.ReactNode
}

export default function Select({ options, onSelect, selected }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false)

    const turnOptionIntoDiv = (option: { name: string; value: string }) => (
        <div
            key={option.name}
            onClick={() => {
                if (option.value != selected) {
                    onSelect(option.value)
                }
                setIsOpen(current => !current)
            }}
        >
            {option.name}
        </div>
    )

    return (
        <div className={`select ${isOpen && 'open'}`}>
            {options
                .filter(option => option.value == selected)
                .map(turnOptionIntoDiv)}
            {options
                .filter(option => option.value != selected)
                .map(turnOptionIntoDiv)}
        </div>
    )
}
