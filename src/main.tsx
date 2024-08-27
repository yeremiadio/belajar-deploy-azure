import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'overlayscrollbars/overlayscrollbars.css';

import { setupStore } from '@/stores/index.ts';

import { ThemeProvider } from './components/Provider/ThemeProvider/index.tsx';
import App from './App.tsx';
import './index.css';

const store = setupStore();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark">
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
