import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import CourseAnalysisView from '../components/CourseAnalysisView';
import { useRounds } from '../contexts/RoundsContext';
import { findCourseAnalysis } from '../utils/roundAnalysis';

/**
 * Página dedicada al análisis agregado de un campo concreto.
 */
const CourseAnalysisPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { savedRounds } = useRounds();

  if (!courseId) {
    return <Navigate to="/analysis" replace />;
  }

  const analysis = findCourseAnalysis(savedRounds, courseId);

  if (!analysis) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">No hay datos suficientes para este campo.</p>
        <button className="mt-4 text-green-500 hover:underline" onClick={() => navigate('/analysis')}>
          Volver al análisis
        </button>
      </div>
    );
  }

  return <CourseAnalysisView courseAnalysis={analysis} onBack={() => navigate('/analysis')} />;
};

export default CourseAnalysisPage;
