const env = import.meta.env;

// Remove trailing slash if present
const backendUrl = String(env.VITE_BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');

const constants = {
    backendUrl: backendUrl,
    apiUrl: `${backendUrl}/api`,
}

export default constants;
