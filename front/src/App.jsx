import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/common/Layout';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { store, persistor } from './stores/store';
import { PersistGate } from 'redux-persist/integration/react';
import LoginPage from './pages/auth/LoginPage';
import SearchPage from './pages/SearchPage';
import SignUpPage from './pages/auth/SignUpPage';
import PostCreatePage from './pages/community/PostCreatePage';
import ReviewCreatePage from './pages/movie/ReviewCreatePage';
import PostDetailPage from './pages/community/PostDetailPage';
import PostEditPage from './pages/community/PostEditPage';
import { getCookie } from './utils/cookie';

const HomePage = lazy(() => import('./pages/HomePage'));
const MovieDetailPage = lazy(() => import('./pages/movie/MovieDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const goHome = () => {
  if (getCookie('userId')) {
    return redirect('/');
  }
  return null;
};

const goLogin = () => {
  if (!getCookie('userId')) {
    return redirect('/login');
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<p className="text-white">로딩...</p>}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: <LoginPage />,
        loader: goHome,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
        loader: goHome,
      },
      {
        path: 'movie',
        children: [
          {
            path: ':movie_id',
            element: (
              <Suspense fallback={<p className="text-white">로딩...</p>}>
                <MovieDetailPage />
              </Suspense>
            ),
          },
          {
            path: 'review/:movie_id',
            element: <ReviewCreatePage />,
            loader: goLogin,
          },
        ],
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'profile/:user_id',
        element: (
          <Suspense fallback={<p className="text-white">로딩...</p>}>
            <ProfilePage />
          </Suspense>
        ),
        loader: goLogin,
      },
      {
        path: 'review',
        children: [
          {
            path: 'create',
            element: <PostCreatePage />,
            loader: goLogin,
          },
          {
            path: ':review_id',
            element: <PostDetailPage />,
          },
          {
            path: 'edit/:review_id',
            element: <PostEditPage />,
            loader: goLogin,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CookiesProvider>
          <RouterProvider router={router} />
        </CookiesProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
