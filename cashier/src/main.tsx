import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import OrderProvider from './OrderContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrderProvider>
      <App />
    </OrderProvider>
  </StrictMode>,
)
