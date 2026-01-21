
// Usa variable de entorno VITE_API_URL, si no existe usa Railway como fallback
const API_URL = import.meta.env.VITE_API_URL || 'https://focused-presence-production-6e28.up.railway.app/api';


export const api = {
    // Auth (DAE Specific)
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/dae/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    },

    // PNC Reports
    getPNCReports: async () => {
        const response = await fetch(`${API_URL}/pnc`);
        return await response.json();
    },

    createPNCReport: async (reportData) => {
        const response = await fetch(`${API_URL}/pnc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportData)
        });
        return await response.json();
    },

    updatePNCReport: async (id, reportData) => {
        const response = await fetch(`${API_URL}/pnc/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportData)
        });
        return await response.json();
    },

    deletePNCReport: async (id) => {
        const response = await fetch(`${API_URL}/pnc/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

    // Management & Catalogs
    getCatalogs: async () => {
        const response = await fetch(`${API_URL}/dae/catalogs`);
        return await response.json();
    },

    createCatalogItem: async (categoria, valor) => {
        const response = await fetch(`${API_URL}/dae/catalogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoria, valor })
        });
        return await response.json();
    },

    deleteCatalogItem: async (id) => {
        const response = await fetch(`${API_URL}/dae/catalogs/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

    // Users (DAE Specific)
    getUsers: async () => {
        const response = await fetch(`${API_URL}/dae/users`);
        return await response.json();
    },

    createUser: async (userData) => {
        const response = await fetch(`${API_URL}/dae/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    }
};

export default api;
