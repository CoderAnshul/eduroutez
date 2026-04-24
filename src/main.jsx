import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ModalProvider } from './Components/Modal/ModalProvider'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { Provider } from "react-redux";
import appStore from './config/appStore.js'
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </ModalProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
