import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import Home from '../Pages/Home/Home';
import Stock from '../Pages/Stock/Stock';
import Sales from '../Pages/Sales/Sales';
import Order from '../Pages/Order/OrderCart';
import Dashboard from '../Pages/Dashboard/Dashboard';
import StockManage from '../Pages/StockManage/StockManage';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/sales',
        element: <Sales />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/stock',
        element: <Stock />,
      },
      {
        path: '/stockManage',
        element: <StockManage />,
      },
      {
        path: '/order',
        element: <Order />,
      },
    ],
  },
]);
