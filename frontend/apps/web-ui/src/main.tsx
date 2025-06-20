import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

// Import global styles với Tailwind CSS
import './styles.css';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
