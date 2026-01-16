import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Usuario',
        phone: ''
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(savedUsers);
    };

    const saveUsers = (updatedUsers) => {
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingUser) {
            const updatedUsers = users.map(u =>
                u.id === editingUser.id ? { ...formData, id: u.id } : u
            );
            saveUsers(updatedUsers);
        } else {
            const newUser = {
                ...formData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            saveUsers([...users, newUser]);
        }

        closeModal();
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData(user);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            saveUsers(users.filter(u => u.id !== id));
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'Usuario', phone: '' });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Usuarios</h1>
                    <p className="text-sm text-gray-400">Gestiona los usuarios del sistema</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-1.5 px-3 py-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>Nuevo Usuario</span>
                </button>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {users.map(user => (
                    <div key={user.id} className="glass rounded-lg p-4 hover:scale-105 transition-transform duration-200">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <PencilIcon className="w-3.5 h-3.5 text-blue-400" />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <TrashIcon className="w-3.5 h-3.5 text-red-400" />
                                </button>
                            </div>
                        </div>
                        <h3 className="font-semibold text-sm mb-0.5">{user.name}</h3>
                        <p className="text-xs text-gray-400 mb-2 truncate">{user.email}</p>
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                                {user.role}
                            </span>
                            {user.phone && (
                                <span className="text-xs text-gray-400">{user.phone}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {users.length === 0 && (
                <div className="glass rounded-lg p-8 text-center">
                    <p className="text-sm text-gray-400">No hay usuarios registrados</p>
                    <p className="text-xs text-gray-500 mt-1">Haz clic en "Nuevo Usuario" para agregar uno</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 text-sm rounded-lg glass-dark focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 text-sm rounded-lg glass-dark focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Rol</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 text-sm rounded-lg glass-dark focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option>Usuario</option>
                                    <option>Administrador</option>
                                    <option>Supervisor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 text-sm rounded-lg glass-dark focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="flex space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-3 py-2 text-sm glass-dark rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                                >
                                    {editingUser ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
