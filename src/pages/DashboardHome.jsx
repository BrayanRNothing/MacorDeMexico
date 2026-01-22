import React, { useState, useEffect } from 'react';
import { ChartBarIcon, UsersIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDocuments: 0,
        activeReports: 0
    });

    const updateStats = async () => {
        try {
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Get documents from API
            const documentsData = await api.getPNCReports();
            const documents = documentsData.success ? documentsData.reports : [];

            setStats({
                totalUsers: users.length,
                totalDocuments: documents.length,
                activeReports: documents.filter(d => d.data?.status === 'Activo').length
            });
        } catch (err) {
            console.error('Error updating stats:', err);
            // Fallback to just showing users if API fails
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            setStats({
                totalUsers: users.length,
                totalDocuments: 0,
                activeReports: 0
            });
        }
    };

    useEffect(() => {
        // Initial load
        updateStats();

        // Listen for storage changes
        window.addEventListener('storage', updateStats);

        // Custom event for same-tab updates
        window.addEventListener('localStorageUpdated', updateStats);

        return () => {
            window.removeEventListener('storage', updateStats);
            window.removeEventListener('localStorageUpdated', updateStats);
        };
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-sm text-gray-400">Bienvenido al Sistema de Reportes PNC</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Total Usuarios</p>
                            <p className="text-3xl font-bold mt-2">
                                {stats.totalUsers}
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <UsersIcon className="w-7 h-7 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Total Documentos</p>
                            <p className="text-3xl font-bold mt-2">
                                {stats.totalDocuments}
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <DocumentTextIcon className="w-7 h-7 text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Reportes Activos</p>
                            <p className="text-3xl font-bold mt-2">
                                {stats.activeReports}
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <ChartBarIcon className="w-7 h-7 text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Welcome Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Bienvenido al Sistema PNC</h2>
                <p className="text-sm text-gray-300 mb-6">
                    Este sistema te permite gestionar usuarios y documentos de reportes PNC de manera eficiente.
                    Utiliza el menú lateral para navegar entre las diferentes secciones.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4 hover:bg-blue-500/20 transition-all duration-200">
                        <h3 className="text-sm font-semibold mb-2 flex items-center">
                            <UsersIcon className="w-5 h-5 mr-2 text-blue-400" />
                            Gestión de Usuarios
                        </h3>
                        <p className="text-xs text-gray-400">
                            Crea, edita y elimina usuarios del sistema
                        </p>
                    </div>
                    <div className="bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:bg-purple-500/20 transition-all duration-200">
                        <h3 className="text-sm font-semibold mb-2 flex items-center">
                            <DocumentTextIcon className="w-5 h-5 mr-2 text-purple-400" />
                            Gestión de Documentos
                        </h3>
                        <p className="text-xs text-gray-400">
                            Administra reportes PNC y genera PDFs
                        </p>
                    </div>
                    <div className="bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4 hover:bg-orange-500/20 transition-all duration-200">
                        <h3 className="text-sm font-semibold mb-2 flex items-center">
                            <ChartBarIcon className="w-5 h-5 mr-2 text-orange-400" />
                            Métricas y Análisis
                        </h3>
                        <p className="text-xs text-gray-400">
                            Visualiza gráficas de calidad por roles
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;

