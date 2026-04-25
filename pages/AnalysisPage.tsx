import React from 'react';
import AnalysisView from '../components/AnalysisView';

const AnalysisPage: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col overflow-hidden">
      <AnalysisView />
    </div>
  );
};

export default AnalysisPage;
