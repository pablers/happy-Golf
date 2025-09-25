import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseAnalysisView from '../CourseAnalysisView';
import { useRounds } from '../../contexts/RoundsContext';
import { findCourseAnalysis } from '../../services/analysisService';

const CourseAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { savedRounds } = useRounds();

  const courseAnalysis = useMemo(
    () => (courseId ? findCourseAnalysis(courseId, savedRounds) : null),
    [courseId, savedRounds],
  );

  if (!courseAnalysis) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-gray-600 dark:text-gray-400">No hay datos suficientes para este campo.</p>
        <button
          onClick={() => navigate('/analysis')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Volver al análisis
        </button>
      </div>
    );
  }

  return <CourseAnalysisView courseAnalysis={courseAnalysis} onBack={() => navigate(-1)} />;
};

export default CourseAnalysisPage;
