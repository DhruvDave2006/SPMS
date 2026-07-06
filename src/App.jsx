import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-text)',
                border: '1px solid rgba(184,148,63,0.3)',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#6B9C78', secondary: 'var(--toast-text)' } },
              error:   { iconTheme: { primary: '#B45309', secondary: 'var(--toast-text)' } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
