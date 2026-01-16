import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-4 lg:p-6 pt-20 lg:pt-6 lg:ml-0">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;

