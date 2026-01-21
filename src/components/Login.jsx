import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { api } from '../services/api';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Si ya está autenticado, redirigir al dashboard
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Using the DAE-specific API for isolated login
            const data = await api.login(credentials.username, credentials.password);

            if (data.success) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', data.user.nombre);
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userRole', data.user.rol);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Usuario o contraseña incorrectos');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            setError('Error de conexión con el servidor DAE');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Login Card with glassmorphism */}
            <div className="z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl p-10 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative group">
                {/* Decorative glow - Softened */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>

                <div className="relative">
                    {/* Logo/Title */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                            <LockClosedIcon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Sistema <span className="text-blue-400">PNC</span></h1>
                        <p className="text-blue-200/60 text-xs font-semibold tracking-[0.3em] uppercase">Gestión de Reportes</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-2xl text-sm flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
                                <span className="text-lg">⚠️</span> {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Username */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-blue-200/70 uppercase tracking-widest ml-1">
                                    Usuario
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-blue-400/50 group-focus-within/input:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 outline-none transition-all duration-300"
                                        placeholder="Tu nombre de usuario"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-blue-200/70 uppercase tracking-widest ml-1">
                                    Contraseña
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-blue-400/50 group-focus-within/input:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 outline-none transition-all duration-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group/btn"
                        >
                            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover/btn:opacity-50 transition duration-300"></div>
                            <div className="relative w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-2 overflow-hidden">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    'INGRESAR AL SISTEMA'
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-10 text-center">
                        <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                            <p className="text-[10px] text-white/40 font-medium">
                                <span className="text-blue-400/60 font-mono">user</span>
                                <span className="mx-2 opacity-20">|</span>
                                <span className="text-blue-400/60 font-mono">123</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

