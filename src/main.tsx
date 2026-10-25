import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { createExpenseRepository, openExpenseDatabase } from './data/expenseRepository.js';
import { registerServiceWorker } from './pwa/register.js';
import './styles.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element #root is missing from index.html');
}

const repository = createExpenseRepository(await openExpenseDatabase());

createRoot(container).render(
  <StrictMode>
    <App repository={repository} />
  </StrictMode>,
);

registerServiceWorker();
