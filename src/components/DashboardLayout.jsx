import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Map paths to descriptive titles for the mobile header
    const getPageTitle = (path) => {
        if (path === '/dashboard') return 'DASHBOARD';
        if (path.includes('/users')) return 'USUARIOS';
        if (path.includes('/documents')) return 'DOCUMENTOS';
        if (path.includes('/metrics')) return 'MÉTRICAS';
        if (path.includes('/management')) return 'GESTIÓN';
        return 'PNC SYSTEM';

    };

    return (
        <div className="flex min-h-screen overflow-hidden bg-slate-950">
            {/* Mobile Top Header - Fixed and aligned */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 z-30 flex items-center px-4">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2.5 bg-blue-600/20 border border-blue-500/20 rounded-xl text-blue-400 active:scale-90 transition-transform"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>
                <div className="ml-4">
                    <h1 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">SISTEMA PNC</h1>
                    <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">{getPageTitle(location.pathname)}</p>
                </div>
            </header>

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className="flex-1 overflow-y-auto p-4 sm:p-4 lg:p-6 pt-20 lg:pt-6 lg:ml-0">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;

