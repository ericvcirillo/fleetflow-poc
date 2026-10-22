import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Landing from './landing/Landing.jsx'
import './styles.css'

const isDemo = window.location.pathname.startsWith('/demo')

createRoot(document.getElementById('root')).render(
  <StrictMode>{isDemo ? <App /> : <Landing />}</StrictMode>
)
