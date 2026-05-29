import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { ExpirationAlerts } from './components/ExpirationAlerts';
import { Sales } from './components/Sales';
import { SalesHistory } from './components/SalesHistory';
import { SaleDetail } from './components/SaleDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'inventory',
        element: <Inventory />,
      },
      {
        path: 'alerts',
        element: <ExpirationAlerts />,
      },
      {
        path: 'sales',
        element: <Sales />,
      },
      {
        path: 'sales-history',
        element: <SalesHistory />,
      },
      {
        path: 'sales-detail/:id',
        element: <SaleDetail />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);