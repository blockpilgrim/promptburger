import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import './index.css'
import App from './App'

// One-time migration: rename localStorage key from old brand
const old = localStorage.getItem('promptcomposer-store')
if (old && !localStorage.getItem('promptburger-store')) {
  localStorage.setItem('promptburger-store', old)
  localStorage.removeItem('promptcomposer-store')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
