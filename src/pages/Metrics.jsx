import React, { useState, useEffect } from 'react';
import { ChartBarIcon, UserIcon, MapPinIcon, ExclamationTriangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Metrics = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = () => {
        const savedDocs = JSON.parse(localStorage.getItem('documents') || '[]');
        setDocuments(savedDocs);
    };

    const filterByPeriod = (docs) => {
        if (selectedPeriod === 'all') return docs;
        
        const now = new Date();
        const filtered = docs.filter(doc => {
            const docDate = new Date(doc.fecha);
            const diffTime = now - docDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (selectedPeriod === 'week') return diffDays <= 7;
            if (selectedPeriod === 'month') return diffDays <= 30;
            if (selectedPeriod === 'quarter') return diffDays <= 90;
            return true;
        });
        return filtered;
    };

    const filteredDocs = filterByPeriod(documents);

    // Agrupar por Inspector
    const groupByInspector = () => {
        const grouped = {};
        filteredDocs.forEach(doc => {
            const inspector = doc.roles?.inspector || 'Sin asignar';
            grouped[inspector] = (grouped[inspector] || 0) + 1;
        });
        return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    };

    // Agrupar por Área
    const groupByArea = () => {
        const grouped = {};
        filteredDocs.forEach(doc => {
            const area = doc.roles?.area || 'Sin asignar';
            grouped[area] = (grouped[area] || 0) + 1;
        });
        return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    };

    // Agrupar por Defecto
    const groupByDefecto = () => {
        const grouped = {};
        filteredDocs.forEach(doc => {
            const defecto = doc.roles?.defecto || 'Sin especificar';
            grouped[defecto] = (grouped[defecto] || 0) + 1;
        });
        return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    };

    // Agrupar por Supervisor
    const groupBySupervisor = () => {
        const grouped = {};
        filteredDocs.forEach(doc => {
            const supervisor = doc.roles?.supervisor || 'Sin asignar';
            grouped[supervisor] = (grouped[supervisor] || 0) + 1;
        });
        return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    };

    // Tendencia mensual
    const getTrendData = () => {
        const months = {};
        filteredDocs.forEach(doc => {
            const date = new Date(doc.fecha);
            const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
            months[monthKey] = (months[monthKey] || 0) + 1;
        });
        return Object.entries(months)
            .sort((a, b) => {
                const [monthA, yearA] = a[0].split('/').map(Number);
                const [monthB, yearB] = b[0].split('/').map(Number);
                return yearA - yearB || monthA - monthB;
            })
            .map(([name, value]) => ({ name, value }));
    };

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#6366f1'];

    const inspectorData = groupByInspector();
    const areaData = groupByArea();
    const defectoData = groupByDefecto();
    const supervisorData = groupBySupervisor();
    const trendData = getTrendData();

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-2">{title}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Métricas de Calidad</h1>
                    <p className="text-blue-200/60 text-sm">Análisis de Reportes PNC por Roles</p>
                </div>
                <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                >
                    <option value="all">Todo el tiempo</option>
                    <option value="week">Última semana</option>
                    <option value="month">Último mes</option>
                    <option value="quarter">Último trimestre</option>
                </select>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="Total Reportes" value={filteredDocs.length} icon={ChartBarIcon} color="bg-blue-500/20" />
                <StatCard title="Inspectores" value={inspectorData.length} icon={UserIcon} color="bg-purple-500/20" />
                <StatCard title="Áreas Afectadas" value={areaData.length} icon={MapPinIcon} color="bg-pink-500/20" />
                <StatCard title="Tipos de Defecto" value={defectoData.length} icon={ExclamationTriangleIcon} color="bg-orange-500/20" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Reportes por Inspector */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <UserIcon className="w-6 h-6 text-blue-400" />
                        <h3 className="text-lg font-bold text-white">Reportes por Inspector</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={inspectorData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#ffffff40" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#ffffff40" style={{ fontSize: '12px' }} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }} 
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Reportes por Área */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <MapPinIcon className="w-6 h-6 text-pink-400" />
                        <h3 className="text-lg font-bold text-white">Reportes por Área</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={areaData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {areaData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }} 
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Reportes por Supervisor */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <UserCircleIcon className="w-6 h-6 text-purple-400" />
                        <h3 className="text-lg font-bold text-white">Reportes por Supervisor</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={supervisorData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#ffffff40" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#ffffff40" style={{ fontSize: '12px' }} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }} 
                            />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Tipos de Defecto */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
                        <h3 className="text-lg font-bold text-white">Tipos de Defecto</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={defectoData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#ffffff40" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={100} />
                            <YAxis stroke="#ffffff40" style={{ fontSize: '12px' }} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }} 
                            />
                            <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Full Width Charts */}
            <div className="grid grid-cols-1 gap-6">
                {/* Tendencia Temporal */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <ChartBarIcon className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-lg font-bold text-white">Tendencia Temporal</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#ffffff40" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#ffffff40" style={{ fontSize: '12px' }} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }} 
                            />
                            <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* No Data State */}
            {filteredDocs.length === 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-20 text-center">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ChartBarIcon className="w-10 h-10 text-blue-400/50" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Sin datos para mostrar</h3>
                    <p className="text-white/40 max-w-xs mx-auto text-sm">
                        {selectedPeriod !== 'all' 
                            ? 'No hay reportes en el período seleccionado.' 
                            : 'Comienza creando reportes PNC para ver las métricas de calidad.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Metrics;
