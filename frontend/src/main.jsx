import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import {appStore} from './app/store.js'
import { Toaster } from './components/ui/sonner'
import LoadingSpinner from './components/LoadingSpinner'
import { useLoadUserQuery } from './features/api/authApi'

// eslint-disable-next-line react/prop-types
const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return <>{isLoading ? <LoadingSpinner/> : <>{children}</>}</>;
};
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <App />
        <Toaster/>
      </Custom>
    </Provider>
  </StrictMode>,
)
