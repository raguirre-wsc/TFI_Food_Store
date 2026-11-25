import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/api/queryClient';
import { setSessionExpiredHandler } from './shared/api/axiosInstance';
import { useAuthStore } from './store/authStore';
import App from './App';
import './index.css';
setSessionExpiredHandler(() => useAuthStore.getState().limpiar());
createRoot(document.getElementById('root')!).render(<QueryClientProvider client={queryClient}><App/></QueryClientProvider>);
