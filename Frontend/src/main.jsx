import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
  import { ToastContainer,Bounce } from 'react-toastify';

import App from './App.jsx'
import { AuthProvider } from './Component/Store/Auth.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <StrictMode>
    <App />
  <ToastContainer 
  position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}

/>

  </StrictMode>
  </AuthProvider>
)
