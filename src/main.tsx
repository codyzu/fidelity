import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import 'react-phone-input-2/lib/style.css';
import '@unocss/reset/normalize.css';
import 'virtual:uno.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './i18n'; // eslint-disable-line import/no-unassigned-import
import LoadingSpinner from './loading-spinner';
import ErrorPage from './error-page';

const Client = lazy(async () => import('./client'));
const Scanner = lazy(async () => import('./scanner'));
const LoginFinish = lazy(async () => import('./login-finish'));
const App = lazy(async () => import('./app'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {index: true, element: <Client />},
      {path: '/scan', element: <Scanner />},
    ],
    errorElement: <ErrorPage />,
  },
  {path: '/finishLogin', element: <LoginFinish />, errorElement: <ErrorPage />},
]);

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>,
);
