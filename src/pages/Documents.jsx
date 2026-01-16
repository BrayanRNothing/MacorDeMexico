import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, DocumentArrowDownIcon, ClipboardDocumentCheckIcon, BeakerIcon, AdjustmentsHorizontalIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { generatePNCReport } from '../services/pdfService';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);
    const [activeTab, setActiveTab] = useState('general');

    const initialFormState = {
        folio: '',
        detectedIn: {
            recepcion: false,
            procesoCNC: true,
            embarque: false,
            almacenaje: false,
            cliente: false
        },
        cliente: '',
        fecha: new Date().toISOString().split('T')[0],
        numParte: '',
        modeloPadre: '',
        dimensiones: '',
        peso: '',
        pesoUnidad: 'Kg',
        cantidad: '',
        unidad: 'Pza',
        proveedor: '',
        remision: '',
        fechaRemision: '',
        descripcionNC: '',
        dictamen: '',
        operador: '',
        areaResponsable: {
            recibo: false,
            produccion: false,
            embarques: false,
            otros: ''
        },
        disposicion: {
            devolucion: false,
            recuperar: false,
            desviacion: false,
            scrap: false,
            otro: ''
        },
        docsSoporte: {
            certificado: false,
            especificaciones: false,
            queja: false,
            desviacion: false,
            otro: ''
        },
        autorizaciones: {
            calidad: '',
            ingenieria: '',
            gerencia: '',
            direccion: ''
        },
        accionesTomadas: '',
        notificadoA: {
            produccion: false,
            ingenieria: false,
            embarques: false,
            comercial: false,
            compras: false,
            otro: ''
        },
        status: 'Activo'
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = () => {
        const savedDocs = JSON.parse(localStorage.getItem('documents') || '[]');
        setDocuments(savedDocs);
    };

    const saveDocuments = (updatedDocs) => {
        localStorage.setItem('documents', JSON.stringify(updatedDocs));
        setDocuments(updatedDocs);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingDoc) {
            const updatedDocs = documents.map(d =>
                d.id === editingDoc.id ? { ...formData, id: d.id, title: formData.cliente || 'Sin Cliente' } : d
            );
            saveDocuments(updatedDocs);
        } else {
            const newDoc = {
                ...formData,
                id: Date.now().toString(),
                title: formData.cliente || 'Sin Cliente',
                createdAt: new Date().toISOString()
            };
            saveDocuments([...documents, newDoc]);
        }

        closeModal();
    };

    const handleEdit = (doc) => {
        setEditingDoc(doc);
        setFormData(doc);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este reporte?')) {
            saveDocuments(documents.filter(d => d.id !== id));
        }
    };

    const handleGeneratePDF = (doc) => {
        generatePNCReport(doc);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingDoc(null);
        setFormData(initialFormState);
        setActiveTab('general');
    };

    const toggleCheckbox = (section, field) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: !prev[section][field]
            }
        }));
    };

    const handleSubFieldChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Reportes PNC</h1>
                    <p className="text-blue-200/60 text-sm">Control de Producto No Conforme</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>NUEVO REPORTE</span>
                </button>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {documents.map(doc => (
                    <div key={doc.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">FOLIO: {doc.folio || 'N/A'}</div>
                                    <h3 className="text-lg font-bold text-white truncate w-48">{doc.cliente || 'Cliente no especificado'}</h3>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${doc.status === 'Activo' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                    'bg-slate-500/20 text-slate-400 border border-slate-500/20'
                                    }`}>
                                    {doc.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Núm. Parte</p>
                                    <p className="text-sm text-white/80 font-medium truncate">{doc.numParte || '-'}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Fecha</p>
                                    <p className="text-sm text-white/80 font-medium">{new Date(doc.fecha).toLocaleDateString('es-MX')}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => handleGeneratePDF(doc)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/5 hover:bg-green-500/20 text-white/70 hover:text-green-400 rounded-xl transition-all text-xs font-bold border border-white/5 hover:border-green-500/30"
                                >
                                    <DocumentArrowDownIcon className="w-4 h-4" />
                                    PDF
                                </button>
                                <button
                                    onClick={() => handleEdit(doc)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/5 hover:bg-blue-500/20 text-white/70 hover:text-blue-400 rounded-xl transition-all text-xs font-bold border border-white/5 hover:border-blue-500/30"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                    EDITAR
                                </button>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="px-3 flex items-center justify-center py-2.5 bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 rounded-xl transition-all border border-white/5 hover:border-red-500/30"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {documents.length === 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-20 text-center">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <DocumentArrowDownIcon className="w-10 h-10 text-blue-400/50" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Sin reportes registrados</h3>
                    <p className="text-white/40 max-w-xs mx-auto text-sm mb-8">Comienza creando un nuevo Reporte de Producto No Conforme (PNC) para tu gestión de calidad.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 active:scale-95"
                    >
                        Crear Primer Reporte
                    </button>
                </div>
            )}

            {/* Form Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {editingDoc ? 'Editar Reporte PNC' : 'Nuevo Reporte de Producto No Conforme'}
                                </h2>
                                <p className="text-blue-400/60 text-xs font-medium uppercase tracking-widest mt-1">Formato Estándar de Calidad</p>
                            </div>
                            <button onClick={closeModal} className="text-white/40 hover:text-white transition-colors">
                                <PlusIcon className="w-8 h-8 rotate-45" />
                            </button>
                        </div>

                        {/* Modal Navigation - Improved for mobile discoverability */}
                        <div className="flex border-b border-white/5 overflow-x-auto bg-slate-900/50 relative shadow-inner custom-scrollbar">
                            <div className="flex min-w-full px-2">
                                {[
                                    { id: 'general', label: 'Datos Generales', icon: ClipboardDocumentCheckIcon },
                                    { id: 'nc', label: 'No Conformidad', icon: BeakerIcon },
                                    { id: 'disposicion', label: 'Disposición', icon: AdjustmentsHorizontalIcon },
                                    { id: 'autorizaciones', label: 'Firmas y Notificación', icon: UserGroupIcon }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'text-blue-400 border-blue-400 bg-blue-400/5' : 'text-white/40 border-transparent hover:text-white/60 hover:bg-white/5'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            {/* Horizontal scroll indicator for mobile */}
                            <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-slate-900 to-transparent pointer-events-none lg:hidden"></div>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {activeTab === 'general' && (
                                <div className="space-y-8">
                                    {/* Header and Folio */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest ml-1">No. Folio</label>
                                            <input
                                                type="text"
                                                value={formData.folio}
                                                onChange={(e) => setFormData({ ...formData, folio: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                placeholder="Ej. 43266"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest ml-1">Fecha de Reporte</label>
                                            <input
                                                type="date"
                                                value={formData.fecha}
                                                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest ml-1">Estado</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                            >
                                                <option value="Activo">Activo</option>
                                                <option value="Cerrado">Cerrado</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Detectado en */}
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Detectado en:</p>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                            {Object.keys(formData.detectedIn).map(key => (
                                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${formData.detectedIn[key] ? 'bg-blue-600 border-blue-600' : 'border-white/20 group-hover:border-white/40'
                                                        }`} onClick={() => toggleCheckbox('detectedIn', key)}>
                                                        {formData.detectedIn[key] && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                                                    </div>
                                                    <span className="text-xs text-white/70 capitalize">{key === 'procesoCNC' ? 'Proceso CNC' : key}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* General Fields Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Cliente</label>
                                                <input
                                                    type="text"
                                                    value={formData.cliente}
                                                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Número de Parte</label>
                                                <input
                                                    type="text"
                                                    value={formData.numParte}
                                                    onChange={(e) => setFormData({ ...formData, numParte: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Dimensiones</label>
                                                <input
                                                    type="text"
                                                    value={formData.dimensiones}
                                                    onChange={(e) => setFormData({ ...formData, dimensiones: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Cantidad</label>
                                                    <input
                                                        type="text"
                                                        value={formData.cantidad}
                                                        onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Unidad</label>
                                                    <select
                                                        value={formData.unidad}
                                                        onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    >
                                                        <option value="Pza">Pza</option>
                                                        <option value="Kg">Kg</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Modelo o Padre</label>
                                                <input
                                                    type="text"
                                                    value={formData.modeloPadre}
                                                    onChange={(e) => setFormData({ ...formData, modeloPadre: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Peso</label>
                                                    <input
                                                        type="text"
                                                        value={formData.peso}
                                                        onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Unidad Peso</label>
                                                    <select
                                                        value={formData.pesoUnidad}
                                                        onChange={(e) => setFormData({ ...formData, pesoUnidad: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    >
                                                        <option value="Kg">Kg</option>
                                                        <option value="LBS">LBS</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Proveedor</label>
                                                <input
                                                    type="text"
                                                    value={formData.proveedor}
                                                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Remisión</label>
                                                    <input
                                                        type="text"
                                                        value={formData.remision}
                                                        onChange={(e) => setFormData({ ...formData, remision: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Fecha Remisión</label>
                                                    <input
                                                        type="date"
                                                        value={formData.fechaRemision}
                                                        onChange={(e) => setFormData({ ...formData, fechaRemision: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'nc' && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1">Descripción de No Conformidad</label>
                                        <textarea
                                            value={formData.descripcionNC}
                                            onChange={(e) => setFormData({ ...formData, descripcionNC: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none min-h-[150px] resize-none"
                                            placeholder="Detalla la falla encontrada..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1">Dictamen de Calidad</label>
                                            <input
                                                type="text"
                                                value={formData.dictamen}
                                                onChange={(e) => setFormData({ ...formData, dictamen: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                placeholder="Ej. Scrap, Retrabajo..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1">Operador</label>
                                            <input
                                                type="text"
                                                value={formData.operador}
                                                onChange={(e) => setFormData({ ...formData, operador: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                placeholder="Nombre del operador..."
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Área Responsable:</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['recibo', 'produccion', 'embarques'].map(key => (
                                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${formData.areaResponsable[key] ? 'bg-blue-600 border-blue-600' : 'border-white/20 group-hover:border-white/40'
                                                        }`} onClick={() => toggleCheckbox('areaResponsable', key)}>
                                                        {formData.areaResponsable[key] && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                                                    </div>
                                                    <span className="text-xs text-white/70 capitalize">{key}</span>
                                                </label>
                                            ))}
                                            <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                                                <span className="text-xs text-white/40">Otro:</span>
                                                <input
                                                    type="text"
                                                    value={formData.areaResponsable.otros}
                                                    onChange={(e) => handleSubFieldChange('areaResponsable', 'otros', e.target.value)}
                                                    className="flex-1 bg-transparent border-b border-white/10 focus:border-blue-500 outline-none text-xs text-white py-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'disposicion' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Disposicion */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Disposición:</p>
                                            <div className="space-y-3">
                                                {['devolucion', 'recuperar', 'desviacion', 'scrap'].map(key => (
                                                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                                        <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${formData.disposicion[key] ? 'bg-blue-600 border-blue-600' : 'border-white/20 group-hover:border-white/40'
                                                            }`} onClick={() => toggleCheckbox('disposicion', key)}>
                                                            {formData.disposicion[key] && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                                                        </div>
                                                        <span className="text-xs text-white/70 capitalize">
                                                            {key === 'devolucion' ? 'Devolución a Proveedor' :
                                                                key === 'recuperar' ? 'Recuperar / Retrabajar' :
                                                                    key === 'desviacion' ? 'Usar c/ Desviación' : 'Degradar a SCRAP'}
                                                        </span>
                                                    </label>
                                                ))}
                                                <div className="flex items-center gap-3 pt-2">
                                                    <span className="text-xs text-white/40">Otro:</span>
                                                    <input
                                                        type="text"
                                                        value={formData.disposicion.otro}
                                                        onChange={(e) => handleSubFieldChange('disposicion', 'otro', e.target.value)}
                                                        className="flex-1 bg-transparent border-b border-white/10 focus:border-blue-500 outline-none text-xs text-white py-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Soporte */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Doc. Soporte:</p>
                                            <div className="space-y-3">
                                                {['certificado', 'especificaciones', 'queja', 'desviacion'].map(key => (
                                                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                                        <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${formData.docsSoporte[key] ? 'bg-blue-600 border-blue-600' : 'border-white/20 group-hover:border-white/40'
                                                            }`} onClick={() => toggleCheckbox('docsSoporte', key)}>
                                                            {formData.docsSoporte[key] && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                                                        </div>
                                                        <span className="text-xs text-white/70 capitalize">
                                                            {key === 'certificado' ? 'Certificado de Calidad' :
                                                                key === 'especificaciones' ? 'Especificaciones - Dibujo' :
                                                                    key === 'queja' ? 'Reporte de Queja' : 'Solicitud de Desviación'}
                                                        </span>
                                                    </label>
                                                ))}
                                                <div className="flex items-center gap-3 pt-2">
                                                    <span className="text-xs text-white/40">Otro:</span>
                                                    <input
                                                        type="text"
                                                        value={formData.docsSoporte.otro}
                                                        onChange={(e) => handleSubFieldChange('docsSoporte', 'otro', e.target.value)}
                                                        className="flex-1 bg-transparent border-b border-white/10 focus:border-blue-500 outline-none text-xs text-white py-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1">Acciones Tomadas</label>
                                        <textarea
                                            value={formData.accionesTomadas}
                                            onChange={(e) => setFormData({ ...formData, accionesTomadas: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none min-h-[120px] resize-none"
                                            placeholder="Describe las correcciones realizadas..."
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'autorizaciones' && (
                                <div className="space-y-8">
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Firmas / Autorizaciones:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {['calidad', 'ingenieria', 'gerencia', 'direccion'].map(key => (
                                                <div key={key} className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/40 capitalize tracking-widest ml-1">{key === 'gerencia' ? 'Gerencia de Planta' : key === 'direccion' ? 'Dirección General' : key}</label>
                                                    <input
                                                        type="text"
                                                        value={formData.autorizaciones[key]}
                                                        onChange={(e) => handleSubFieldChange('autorizaciones', key, e.target.value)}
                                                        className="w-full bg-slate-950/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-blue-500/50 outline-none text-sm"
                                                        placeholder="Nombre..."
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Notificado a:</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {['produccion', 'ingenieria', 'embarques', 'comercial', 'compras'].map(key => (
                                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${formData.notificadoA[key] ? 'bg-blue-600 border-blue-600' : 'border-white/20 group-hover:border-white/40'
                                                        }`} onClick={() => toggleCheckbox('notificadoA', key)}>
                                                        {formData.notificadoA[key] && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                                                    </div>
                                                    <span className="text-xs text-white/70 capitalize">{key}</span>
                                                </label>
                                            ))}
                                            <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                                                <span className="text-xs text-white/40">Otro:</span>
                                                <input
                                                    type="text"
                                                    value={formData.notificadoA.otro}
                                                    onChange={(e) => handleSubFieldChange('notificadoA', 'otro', e.target.value)}
                                                    className="flex-1 bg-transparent border-b border-white/10 focus:border-blue-500 outline-none text-xs text-white py-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 mt-12">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-8 py-4 text-white/40 font-bold rounded-2xl hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-sm uppercase tracking-[0.2em]"
                                >
                                    {editingDoc ? 'Actualizar Reporte' : 'Guardar y Finalizar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documents;
