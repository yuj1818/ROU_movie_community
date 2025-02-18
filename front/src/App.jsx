import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/common/Layout';
import MovieDetailPage from './pages/movie/MovieDetailPage';
import { Provider } from 'react-redux';
import { store } from './stores/store';
import LoginPage from './pages/auth/LoginPage';

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
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
