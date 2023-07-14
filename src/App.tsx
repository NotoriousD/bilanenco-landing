import { lazy, Suspense } from 'react';
import { Amplify } from 'aws-amplify';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Loader } from 'components/Loader';

import awsExports from './aws-exports';
import './styles/App.css';
import css from './styles/main.module.scss';

Amplify.configure(awsExports);

const MainPage = lazy(() =>
  import('pages/MainPage').then((module) => ({ default: module.MainPage }))
);

const ThankYouPage = lazy(() =>
  import('pages/ThankYouPage').then((module) => ({ default: module.ThankYouPage }))
);

const ErrorPage = lazy(() =>
  import('pages/ErrorPage').then((module) => ({ default: module.ErrorPage }))
);

export const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainPage />,
    },
    {
      path: '/thank-you',
      element: <ThankYouPage />,
    },
    {
      path: '*',
      element: <ErrorPage />,
    },
  ]);
  return (
    <div className={css.root}>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
}
