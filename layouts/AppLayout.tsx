import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

/**
 * Dispone la cabecera y el área principal compartidos por todas las páginas protegidas.
 */
const AppLayout: React.FC = () => (
  <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
    <Header />
    <div className="flex-grow flex flex-col overflow-y-hidden">
      <Outlet />
    </div>
  </div>
);

export default AppLayout;
