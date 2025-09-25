import type { UserProfile } from '../types';

/**
 * Perfil mínimo utilizado para sesiones de invitado sin autenticación.
 * Se define en un módulo dedicado para poder reutilizarlo desde distintos contextos.
 */
export const GUEST_PROFILE: UserProfile = {
  name: 'Invitado',
  hcpHistory: [
    { date: new Date('2025-09-11').toISOString(), hcp: 23.2 },
    { date: new Date('2025-06-25').toISOString(), hcp: 26.7 },
    { date: new Date('2025-04-27').toISOString(), hcp: 30.8 },
    { date: new Date('2025-04-12').toISOString(), hcp: 29.7 },
    { date: new Date('2025-02-05').toISOString(), hcp: 32.3 },
    { date: new Date('2025-01-01').toISOString(), hcp: 36.0 },
  ],
  favoriteCourseIds: [],
  trainingObjective: 'recommended',
};
