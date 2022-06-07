import { useState } from 'react'

interface EventWithTargetValue<T> {
    target: {
        value: T
    }
    [key: string | number | symbol]: any
}

export const useInputState = <T>(defaultValue: T) => {
    const [state, setState] = useState<T>(defaultValue)

    return [state, (e: EventWithTargetValue<T>) => setState(e.target.value)]
}
