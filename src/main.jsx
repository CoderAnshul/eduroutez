import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { Provider } from "react-redux";
import appStore from './config/appStore.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
    <QueryClientProvider client={new QueryClient()}>
      <App />
    </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
