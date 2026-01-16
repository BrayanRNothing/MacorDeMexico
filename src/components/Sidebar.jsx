import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logotipo-macor-mexico.png';
import {
    HomeIcon,
    UsersIcon,
    DocumentTextIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const navigate = useNavigate();
    const currentUser = String(localStorage.getItem('currentUser') || 'Usuario');
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, end: true },
        { name: 'Usuarios', path: '/dashboard/users', icon: UsersIcon },
        { name: 'Documentos', path: '/dashboard/documents', icon: DocumentTextIcon },
    ];

    return (
        <>
            {/* Mobile Menu Button - Moved to be more centered and visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-blue-600/30 backdrop-blur-md border border-white/10 rounded-xl text-white shadow-lg active:scale-90 transition-transform"
            >
                {isOpen ? (
                    <XMarkIcon className="w-6 h-6" />
                ) : (
                    <Bars3Icon className="w-6 h-6" />
                )}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar with Glassmorphism */}
            <div
                className={`
                    fixed lg:static inset-y-0 left-0 z-40
                    w-64 h-screen flex flex-col overflow-hidden
                    transform transition-all duration-300 ease-in-out
                    bg-slate-950/20 backdrop-blur-xl border-r border-white/10
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Sidebar content */}
                <div className="flex flex-col h-full p-4 relative z-10">
                    {/* Logo/Title */}
                    <div className="mb-8 mt-16 lg:mt-4">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 p-1">
                                <img src={logo} alt="Logo" className="w-full h-auto object-contain" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">
                                    SISTEMA <span className="text-blue-400">PNC</span>
                                </h1>
                                <p className="text-blue-200/60 text-[10px] uppercase tracking-widest font-medium">Gestión de Reportes</p>
                            </div>
                        </div>
                    </div>

                    {/* User Info Card */}
                    <div className="mb-6">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-3 shadow-inner">
                            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 border border-white/20 shadow-lg">
                                <span className="text-white font-bold text-lg">
                                    {currentUser.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-sm text-white truncate">{currentUser}</p>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                    <p className="text-[10px] text-blue-200/70 font-medium">Administrador</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar no-scrollbar">
                        <div className="text-[10px] font-bold text-blue-200/40 uppercase tracking-[0.2em] px-4 mb-4">
                            Menú Principal
                        </div>
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        end={item.end}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                                ? 'bg-blue-500/20 text-white font-medium border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-400' : ''}`} />
                                                <span className="tracking-wide">{item.name}</span>
                                                {isActive && (
                                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <div className="pt-4 border-t border-white/5 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-semibold rounded-xl transition-all duration-300 border border-red-500/20 hover:border-red-500/40 group"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
