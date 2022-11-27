import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import 'react-phone-input-2/lib/style.css';
import '@unocss/reset/normalize.css';
import 'uno.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './i18n'; // eslint-disable-line import/no-unassigned-import
import App from './app';

const Client = lazy(async () => import('./client'));
const Scanner = lazy(async () => import('./scanner'));
const LoginFinish = lazy(async () => import('./login-finish'));
// Const App = lazy(async () => import('./app'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {index: true, element: <Client />},
      {path: '/scan', element: <Scanner />},
    ],
  },
  {path: '/finishLogin', element: <LoginFinish />},
]);

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>,
);
