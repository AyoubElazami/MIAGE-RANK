export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http:
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http:
export const STORAGE_KEYS = {
  TOKEN: 'miagerank_token',
  USER: 'miagerank_user',
};
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  TEAMS: '/teams',
  TEAM_DETAIL: (id) => `/teams/${id}`,
  CHALLENGES: '/challenges',
  CHALLENGE_DETAIL: (id) => `/challenges/${id}`,
  RANKING: '/ranking',
  SCORES: '/scores',
  SCORES_ALL: '/scores/all',
  ADMIN_SCORES: '/admin/scores',
};
export const CHALLENGE_CATEGORIES = [
  { value: 'technique', label: 'Technique' },
  { value: 'creativite', label: 'Créativité' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'innovation', label: 'Innovation' },
  { value: 'autre', label: 'Autre' },
];
export const CHALLENGE_DIFFICULTIES = [
  { value: 'facile', label: 'Facile' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'difficile', label: 'Difficile' },
  { value: 'expert', label: 'Expert' },
];