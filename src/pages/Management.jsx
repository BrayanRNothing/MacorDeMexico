import React, { useState, useEffect } from 'react';
import { UserPlusIcon, PlusIcon, TrashIcon, TagIcon, UserGroupIcon, BuildingOfficeIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const Management = () => {
    const [users, setUsers] = useState([]);
    const [catalogs, setCatalogs] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(false);

    // Form states
    const [userForm, setUserForm] = useState({ nombre: '', email: '', password: '', rol: 'usuario' });
    const [catalogForm, setCatalogForm] = useState({ categoria: 'defecto', valor: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const usersRes = await api.getUsers();
            const catalogsRes = await api.getCatalogs();
            if (usersRes.success) setUsers(usersRes.users);
            if (catalogsRes.success) setCatalogs(catalogsRes.catalogs);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await api.createUser(userForm);
            if (res.success) {
                setUserForm({ nombre: '', email: '', password: '', rol: 'usuario' });
                fetchData();
            } else {
                alert(res.message);
            }
        } catch (error) {
            alert('Error al crear usuario');
        }
    };

    const handleAddCatalogValue = async (e) => {
        e.preventDefault();
        try {
            const res = await api.createCatalogItem(catalogForm.categoria, catalogForm.valor);
            if (res.success) {
                setCatalogForm({ ...catalogForm, valor: '' });
                fetchData();
            }
        } catch (error) {
            alert('Error al agregar valor');
        }
    };

    const handleDeleteCatalog = async (id) => {
        if (!confirm('¿Eliminar esta opción?')) return;
        try {
            const res = await api.deleteCatalogItem(id);
            if (res.success) fetchData();
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    const catalogCategories = [
        { id: 'defecto', name: 'Defectos', icon: TagIcon },
        { id: 'area', name: 'Áreas', icon: BuildingOfficeIcon },
    ];

    const personnelCategories = [
        { id: 'inspector', name: 'Inspectores', icon: UserIcon },
        { id: 'supervisor', name: 'Supervisores', icon: ShieldCheckIcon },
        { id: 'operador', name: 'Operadores', icon: UserGroupIcon },
        { id: 'auditor', name: 'Auditores', icon: ShieldCheckIcon },
    ];


    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white tracking-tight">Gestión del Sistema</h1>
                <p className="text-blue-200/60 text-sm">Administración de Usuarios y Catálogos DAE</p>
            </header>

            {/* Navigation Tabs */}
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-widest ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:text-white'}`}
                >
                    Usuarios
                </button>
                <button
                    onClick={() => setActiveTab('catalogs')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-widest ${activeTab === 'catalogs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:text-white'}`}
                >
                    Catálogos
                </button>
                <button
                    onClick={() => setActiveTab('personal')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-widest ${activeTab === 'personal' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:text-white'}`}
                >
                    Personal
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'users' ? (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Create User Form */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <UserPlusIcon className="w-6 h-6 text-blue-400" />
                                    <h3 className="text-xl font-bold text-white">Nuevo Usuario</h3>
                                </div>
                                <form onSubmit={handleCreateUser} className="space-y-4">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Nombre Completo"
                                        className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-blue-500/50"
                                        value={userForm.nombre}
                                        onChange={e => setUserForm({ ...userForm, nombre: e.target.value })}
                                    />
                                    <input
                                        required
                                        type="email"
                                        placeholder="Correo Electrónico"
                                        className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-blue-500/50"
                                        value={userForm.email}
                                        onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                                    />
                                    <input
                                        required
                                        type="password"
                                        placeholder="Contraseña"
                                        className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-blue-500/50"
                                        value={userForm.password}
                                        onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                                    />
                                    <select
                                        className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                        value={userForm.rol}
                                        onChange={e => setUserForm({ ...userForm, rol: e.target.value })}
                                    >
                                        <option value="usuario">Usuario</option>
                                        <option value="moderador">Moderador</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                                    >
                                        Crear Usuario
                                    </button>
                                </form>
                            </div>

                            {/* Users List */}
                            <div className="xl:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-left border-b border-white/10">
                                            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Nombre</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Email</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Rol</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 text-white font-medium">{user.nombre}</td>
                                                <td className="px-6 py-4 text-white/60">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.rol === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                        {user.rol}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === 'catalogs' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {catalogCategories.map(cat => (
                                <div key={cat.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[500px]">
                                    <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <cat.icon className="w-5 h-5 text-blue-400" />
                                            <h3 className="font-bold text-white">{cat.name}</h3>
                                        </div>
                                    </div>

                                    <div className="p-4 border-b border-white/5">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const val = e.target.valor.value;
                                                if (val) {
                                                    setCatalogForm({ categoria: cat.id, valor: val });
                                                    api.createCatalogItem(cat.id, val).then(fetchData);
                                                    e.target.valor.value = '';
                                                }
                                            }}
                                            className="relative"
                                        >
                                            <input
                                                name="valor"
                                                type="text"
                                                placeholder={`Agregar ${cat.name.slice(0, -1)}...`}
                                                className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                                            />
                                            <button type="submit" className="absolute right-2 top-2 p-1.5 text-blue-400 hover:text-blue-300">
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                        {catalogs.filter(c => c.categoria === cat.id).map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 group hover:bg-white/10 transition-colors">
                                                <span className="text-sm text-white/80">{item.valor}</span>
                                                <button
                                                    onClick={() => handleDeleteCatalog(item.id)}
                                                    className="p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {catalogs.filter(c => c.categoria === cat.id).length === 0 && (
                                            <p className="text-center text-[10px] text-white/20 uppercase py-10 tracking-widest">Sin registros</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {personnelCategories.map(cat => (
                                <div key={cat.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[500px]">
                                    <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <cat.icon className="w-5 h-5 text-blue-400" />
                                            <h3 className="font-bold text-white">{cat.name}</h3>
                                        </div>
                                    </div>

                                    <div className="p-4 border-b border-white/5">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const val = e.target.valor.value;
                                                if (val) {
                                                    setCatalogForm({ categoria: cat.id, valor: val });
                                                    api.createCatalogItem(cat.id, val).then(fetchData);
                                                    e.target.valor.value = '';
                                                }
                                            }}
                                            className="relative"
                                        >
                                            <input
                                                name="valor"
                                                type="text"
                                                placeholder={`Nombre del ${cat.name.slice(0, -2)}...`}
                                                className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                                            />
                                            <button type="submit" className="absolute right-2 top-2 p-1.5 text-blue-400 hover:text-blue-300">
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                        {catalogs.filter(c => c.categoria === cat.id).map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 group hover:bg-white/10 transition-colors">
                                                <span className="text-sm text-white/80">{item.valor}</span>
                                                <button
                                                    onClick={() => handleDeleteCatalog(item.id)}
                                                    className="p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {catalogs.filter(c => c.categoria === cat.id).length === 0 && (
                                            <p className="text-center text-[10px] text-white/20 uppercase py-10 tracking-widest">Sin registros</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Management;
