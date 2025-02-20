import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/common/Layout';
import MovieDetailPage from './pages/movie/MovieDetailPage';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { store, persistor } from './stores/store';
import { PersistGate } from 'redux-persist/integration/react';
import LoginPage from './pages/auth/LoginPage';
import MovieSearchPage from './pages/movie/MovieSearchPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'movie',
        children: [
          {
            path: ':movie_id',
            element: <MovieDetailPage />,
          },
        ],
      },
      {
        path: 'search',
        element: <MovieSearchPage />,
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
