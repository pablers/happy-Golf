import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseAnalysisView from '../components/CourseAnalysisView';
import { useRounds } from '../contexts/RoundsContext';

// Página de detalle para el análisis agregado por campo.
const CourseAnalysisPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { getCourseAnalysis } = useRounds();

  const courseAnalysis = useMemo(() => (courseId ? getCourseAnalysis(courseId) : null), [courseId, getCourseAnalysis]);

  if (!courseAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <p className="text-lg text-gray-600 dark:text-gray-300">No se encontró información para este campo.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">Volver</button>
      </div>
    );
  }

  return <CourseAnalysisView courseAnalysis={courseAnalysis} onBack={() => navigate(-1)} />;
};

export default CourseAnalysisPage;
