import React from 'react';
import ProfileView from '../components/ProfileView';

const ProfilePage: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col overflow-hidden">
      <ProfileView />
    </div>
  );
};

export default ProfilePage;
