const env = import.meta.env;

// Remove trailing slash if present
const backendUrl = String(env.VITE_BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');
const neverExpiresAt = '9999-12-31T23:59:59.999Z';

const constants = {
    backendUrl: backendUrl,
    apiUrl: `${backendUrl}/api`,
    neverExpiresAt,
}

export default constants;
