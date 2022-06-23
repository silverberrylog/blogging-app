import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

process.env.MODE = import.meta.env.MODE
process.env.BASE_URL = import.meta.env.BASE_URL
process.env.PROD = import.meta.env.PROD
process.env.DEV = import.meta.env.DEV

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
