import axios from 'axios';

// Use Vite environment variable VITE_API_BASE_URL in production builds
// (must be set in the Vercel dashboard). In development, requests go to the
// Vite dev server proxy (see vite.config.js). As a last resort in production,
// fall back to the deployed Render backend so the site works even if the
// env var is missing from a build.
const DEPLOYED_BACKEND = 'https://cardiovision-bt72.onrender.com';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '' : DEPLOYED_BACKEND);

// Render's free tier cold-starts a PyTorch instance in ~30-60s, so the
// timeout must exceed a cold boot or first requests will abort early.
export const REQUEST_TIMEOUT_MS = 90000;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictStenosis = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getModelComparison = async () => {
  const response = await api.get('/api/models/comparison');
  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;
