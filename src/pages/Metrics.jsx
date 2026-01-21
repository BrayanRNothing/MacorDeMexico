import React, { useState, useEffect } from 'react';
import { ChartBarIcon, UserIcon, MapPinIcon, ExclamationTriangleIcon, UserCircleIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart } from 'recharts';
import api from '../services/api';




const Metrics = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const data = await api.getPNCReports();
            if (data.success) {
                setDocuments(data.reports.map(r => ({ ...r.data, id: r.id })));
            }
        } catch (err) {
            console.error('Error loading documents:', err);
        }
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

    // Agrupar por Operador
    const groupByOperador = () => {
        const grouped = {};
        filteredDocs.forEach(doc => {
            const operador = doc.roles?.operador || 'Sin asignar';
            grouped[operador] = (grouped[operador] || 0) + 1;
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

    // Agrupar por Auditor (Nuevo)
    const groupByAuditor = () => {
        const grouped = {};
        filteredDocs.forEach(doc => {
            const auditor = doc.roles?.auditor || 'Sin asignar';
            grouped[auditor] = (grouped[auditor] || 0) + 1;
        });
        return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    };

    // Datos para Pareto de Defectos
    const getParetoData = () => {
        const grouped = {};
        filteredDocs.forEach(doc => {
            const defecto = doc.roles?.defecto || 'Sin especificar';
            grouped[defecto] = (grouped[defecto] || 0) + 1;
        });

        const sorted = Object.entries(grouped)
            .sort((a, b) => b[1] - a[1])
            .map(([name, value]) => ({ name, value }));

        const total = sorted.reduce((sum, item) => sum + item.value, 0);
        let cumulative = 0;

        return sorted.map(item => {
            cumulative += item.value;
            return {
                ...item,
                percentage: Math.round((cumulative / total) * 100)
            };
        });
    };

    // Defectos por Área (Frecuencia)
    const getDefectosByAreaData = () => {
        const matrix = {};
        const areas = new Set();
        const defectos = new Set();

        filteredDocs.forEach(doc => {
            const area = doc.roles?.area || 'Sin asignar';
            const defecto = doc.roles?.defecto || 'Sin especificar';
            areas.add(area);
            defectos.add(defecto);

            if (!matrix[area]) matrix[area] = {};
            matrix[area][defecto] = (matrix[area][defecto] || 0) + 1;
        });

        return Array.from(areas).map(area => {
            const data = { name: area };
            Array.from(defectos).forEach(def => {
                data[def] = matrix[area][def] || 0;
            });
            return data;
        });
    };

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#6366f1'];

    const inspectorData = groupByInspector();
    const areaData = groupByArea();
    const defectoData = groupByDefecto();
    const supervisorData = groupBySupervisor();
    const operadorData = groupByOperador();
    const auditorData = groupByAuditor();
    const trendData = getTrendData();
    const paretoData = getParetoData();
    const defectByAreaData = getDefectosByAreaData();


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

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Pareto de Defectos */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 xl:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-lg font-bold text-white">Pareto de Defectos (80/20)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={paretoData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#ffffff40" style={{ fontSize: '10px' }} angle={-45} textAnchor="end" height={100} />
                            <YAxis yAxisId="left" stroke="#ffffff40" style={{ fontSize: '12px' }} label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft', fill: '#ffffff40' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#ffffff40" style={{ fontSize: '12px' }} label={{ value: '% Acumulado', angle: 90, position: 'insideRight', fill: '#ffffff40' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="value" name="Frecuencia" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="percentage" name="% Acumulado" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 5 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Defectos por Área */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 xl:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <MapPinIcon className="w-6 h-6 text-pink-400" />
                        <h3 className="text-lg font-bold text-white">Distribución de Defectos por Área</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={defectByAreaData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis type="number" stroke="#ffffff40" style={{ fontSize: '12px' }} />
                            <YAxis dataKey="name" type="category" stroke="#ffffff40" style={{ fontSize: '12px' }} width={150} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            {Array.from(new Set(filteredDocs.map(d => d.roles?.defecto || 'Sin especificar'))).map((def, idx) => (
                                <Bar key={def} dataKey={def} stackId="a" fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Personnel Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Findings by Inspector */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <UserIcon className="w-6 h-6 text-blue-400" />
                        <h3 className="text-lg font-bold text-white">Por Inspector</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={inspectorData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#ffffff40" style={{ fontSize: '10px' }} />
                            <YAxis stroke="#ffffff40" style={{ fontSize: '10px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Findings by Supervisor */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <UserCircleIcon className="w-6 h-6 text-purple-400" />
                        <h3 className="text-lg font-bold text-white">Por Supervisor</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={supervisorData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#ffffff40" style={{ fontSize: '10px' }} />
                            <YAxis stroke="#ffffff40" style={{ fontSize: '10px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Findings by Operador */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <UserGroupIcon className="w-6 h-6 text-orange-400" />
                        <h3 className="text-lg font-bold text-white">Por Operador</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={operadorData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#ffffff40" style={{ fontSize: '10px' }} />
                            <YAxis stroke="#ffffff40" style={{ fontSize: '10px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Findings by Auditor */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                        <h3 className="text-lg font-bold text-white">Por Auditor</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={auditorData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#ffffff40" style={{ fontSize: '10px' }} />
                            <YAxis stroke="#ffffff40" style={{ fontSize: '10px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Time Trend */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <ChartBarIcon className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">Tendencia Temporal (PNC por Mes)</h3>
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

