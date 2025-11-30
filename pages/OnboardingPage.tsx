import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingView from '../components/OnboardingView';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { SpinnerIcon } from '../components/icons';

const OnboardingPage: React.FC = () => {
    const { token, userProfile, login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        // Redirect if not logged in
        if (!token) {
            navigate('/login');
        }
        // Redirect if profile already completed (has more than default data)
        if (userProfile && userProfile.favoriteCourseIds.length > 0) {
            navigate('/');
        }
    }, [token, userProfile, navigate]);

    const handleComplete = async (handicap: number, trainingObjective: string, favoriteCourseIds: string[]) => {
        if (!token) return;

        setIsLoading(true);
        setError('');

        try {
            const updatedProfile = await api.completeProfile(token, handicap, trainingObjective, favoriteCourseIds);
            // Update the auth context with the new profile
            login(token, updatedProfile);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Error al completar el perfil. Inténtalo de nuevo.');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-white dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center">
                <div className="text-center">
                    <SpinnerIcon className="w-12 h-12 text-green-600 dark:text-green-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Guardando tu perfil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-white dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md">
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={() => setError('')}
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        );
    }

    return <OnboardingView onComplete={handleComplete} initialName={userProfile?.name || 'Usuario'} />;
};

export default OnboardingPage;
