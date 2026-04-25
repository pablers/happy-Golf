import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { AuthProvider } from './contexts/AuthContext';
import { RoundsProvider } from './contexts/RoundsContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RoundsProvider>
        <RouterProvider router={router} />
      </RoundsProvider>
    </AuthProvider>
  );
};

export default App;
