import React, { useState, useEffect } from 'react';
import {
    File, UploadCloud, Trash2, Search, Filter, FileText, Image as ImageIcon,
    Download, Eye, Clock, Database, HardDrive, CheckCircle, X, Folder,
    Users, MessageSquare, Award, Monitor, User, Building, FileCheck,
    LayoutGrid, List as ListIcon, MoreVertical, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllFiles, uploadFile, deleteFile, BASE_URL } from '../../../../api';

const FOLDERS = [
    { id: 'all', label: 'All Files', icon: HardDrive, color: 'text-gray-500' },
    { id: 'client_docs', label: 'Client Documents', icon: Users, color: 'text-blue-500' },
    { id: 'director_docs', label: 'Director Proofs', icon: User, color: 'text-indigo-500' },
    { id: 'company_docs', label: 'Company Docs', icon: Building, color: 'text-orange-500' },
    { id: 'fssai_docs', label: 'FSSAI Files', icon: FileCheck, color: 'text-green-500' },
    { id: 'service_files', label: 'Service Files', icon: FileText, color: 'text-purple-500' },
    { id: 'chats', label: 'Chat Attachments', icon: MessageSquare, color: 'text-pink-500' },
    { id: 'certificates', label: 'Certificates', icon: Award, color: 'text-yellow-500' },
    { id: 'marketing', label: 'Marketing Assets', icon: Monitor, color: 'text-red-500' },
    { id: 'others', label: 'Other Files', icon: Folder, color: 'text-gray-400' },
];

const FileManager = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            setLoading(true);
            const data = await getAllFiles();
            if (Array.isArray(data)) setFiles(data);
        } catch (e) {
            console.error("Failed to load files", e);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const category = selectedFolder === 'all' ? 'others' : selectedFolder;
            await uploadFile(file, category);
            await loadFiles();
        } catch (e) {
            alert("Upload failed: " + e.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this file?")) return;
        try {
            await deleteFile(id);
            setFiles(prev => prev.filter(f => f.id !== id));
        } catch (e) {
            alert("Delete failed");
        }
    };

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (type) => {
        if (!type) return <File size={24} className="text-gray-400" />;
        if (type.includes('image')) return <ImageIcon size={24} className="text-purple-500" />;
        if (type.includes('pdf')) return <FileText size={24} className="text-red-500" />;
        return <File size={24} className="text-blue-500" />;
    };

    const filteredFiles = files.filter(f => {
        const matchesSearch = (f.originalFileName || f.fileName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFolder = selectedFolder === 'all' || f.category === selectedFolder || (!f.category && selectedFolder === 'others');
        return matchesSearch && matchesFolder;
    });

    const activeFolder = FOLDERS.find(f => f.id === selectedFolder);
    const totalSize = files.reduce((acc, curr) => acc + (curr.size || 0), 0);

    return (
        <div className="flex bg-[#F8FAFC] h-[calc(100vh-100px)] overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            {/* Sidebar */}
            <div className="w-72 bg-white border-r border-slate-100 flex flex-col shrink-0 h-full">
                <div className="p-6 border-b border-slate-50">
                    <h2 className="text-xl font-bold text-[#10232A] flex items-center gap-2">
                        <HardDrive size={24} className="text-[#B58863]" /> File Storage
                    </h2>
                    <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100 relative overflow-hidden">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 relative z-10">
                            <span>Storage Used</span>
                            <span>45%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden relative z-10">
                            <div className="bg-[#10232A] h-full w-[45%] rounded-full shadow-sm"></div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium relative z-10">
                            {formatSize(totalSize)} used of 10 GB
                        </p>
                        {/* Decorative background blob */}
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-100 rounded-full blur-2xl opacity-50"></div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 [&::-webkit-scrollbar]:hidden">
                    <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Categories</p>
                    {FOLDERS.map((folder) => {
                        const count = files.filter(f => f.category === folder.id).length;
                        const MyIcon = folder.icon;
                        const isActive = selectedFolder === folder.id;

                        return (
                            <button
                                key={folder.id}
                                onClick={() => setSelectedFolder(folder.id)}
                                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden
                                    ${isActive
                                        ? 'bg-[#FDFBF7] text-[#B58863] font-bold shadow-sm ring-1 ring-[#B58863]/20'
                                        : 'text-[#3D4D55] hover:bg-slate-50 hover:text-[#10232A] border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    <MyIcon size={18} className={`transition-colors duration-200 ${isActive ? 'text-[#B58863]' : folder.color}`} />
                                    <span>{folder.label}</span>
                                </div>
                                {count > 0 && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold relative z-10 transition-colors
                                        ${isActive ? 'bg-white text-[#B58863] shadow-sm' : 'bg-slate-100 text-[#3D4D55]'}`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-white h-full relative">
                {/* Header Toolbar */}
                <div className="h-20 px-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-xl sticky top-0 z-20">
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-0.5">
                            <span>Files</span>
                            <ChevronRight size={12} />
                            <span className="text-slate-600">Overview</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-[#10232A] tracking-tight">
                                {activeFolder.label}
                            </h2>
                            <span className="text-xs font-bold bg-[#FDFBF7] text-[#B58863] px-2.5 py-1 rounded-full border border-[#B58863]/20">
                                {filteredFiles.length}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative group">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#B58863] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#B58863]/10 focus:border-[#B58863] transition-all w-64 shadow-sm font-bold text-[#10232A]"
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="p-1 bg-slate-100 rounded-xl flex border border-slate-200">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-[#B58863] shadow-sm' : 'text-[#3D4D55] hover:text-[#10232A]'}`}
                            >
                                <ListIcon size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white text-[#B58863] shadow-sm' : 'text-[#3D4D55] hover:text-[#10232A]'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>

                        {/* Upload Button */}
                        <label className={`
                            px-6 py-2.5 bg-[#10232A] text-white font-bold rounded-xl shadow-lg shadow-[#10232A]/10 
                            hover:bg-[#B58863] hover:shadow-[#B58863]/20 hover:scale-[1.02] active:scale-[0.98]
                            transition-all duration-200 cursor-pointer flex items-center gap-2.5
                            ${uploading ? 'opacity-70 pointer-events-none' : ''}
                        `}>
                            {uploading ? <Clock size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                            <span className="text-sm">Upload</span>
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-pulse">
                            <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
                            <p>Loading your files...</p>
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <activeFolder.icon size={48} className="opacity-20 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-500">No files found</h3>
                            <p className="text-sm text-slate-400 mt-2">Upload documents to {activeFolder.label} to get started.</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {viewMode === 'list' ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                                >
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 pl-8">Name</th>
                                                <th className="px-6 py-4">Size</th>
                                                <th className="px-6 py-4">Type</th>
                                                <th className="px-6 py-4">Uploaded At</th>
                                                <th className="px-6 py-4 text-right pr-8">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredFiles.map((file) => (
                                                <tr key={file.id} className="hover:bg-indigo-50/30 transition duration-150 group">
                                                    <td className="px-6 py-4 pl-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-white group-hover:shadow-sm transition border border-transparent group-hover:border-indigo-100">
                                                                {getFileIcon(file.contentType)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-700 line-clamp-1 max-w-[200px]">{file.originalFileName || file.fileName}</p>
                                                                <a
                                                                    href={`${BASE_URL.replace('/api', '')}${file.url}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-[11px] text-[#B58863] hover:text-[#10232A] hover:underline flex items-center gap-1 mt-0.5"
                                                                >
                                                                    View File <Eye size={10} />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-mono text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{formatSize(file.size)}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-semibold text-slate-500 capitalize">{file.contentType?.split('/')[1] || 'Unknown'}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                                                        {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right pr-8">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                                                            <a
                                                                href={`${BASE_URL.replace('/api', '')}${file.url}`}
                                                                download
                                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                                                            >
                                                                <Download size={16} />
                                                            </a>
                                                            <button
                                                                onClick={() => handleDelete(file.id)}
                                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                                >
                                    {filteredFiles.map((file) => (
                                        <div key={file.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#B58863]/20 transition group relative">
                                            <div className="aspect-square bg-slate-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-slate-100">
                                                {file.contentType?.includes('image') ? (
                                                    <img
                                                        src={`${BASE_URL.replace('/api', '')}${file.url}`}
                                                        alt={file.fileName}
                                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                                                    />
                                                ) : (
                                                    <div className="scale-150 transform group-hover:scale-125 transition duration-300">
                                                        {getFileIcon(file.contentType)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm truncate mb-1">{file.originalFileName || file.fileName}</p>
                                                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                                                    <span>{formatSize(file.size)}</span>
                                                    <span>{file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : ''}</span>
                                                </div>
                                            </div>

                                            {/* Overlay Actions */}
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDelete(file.id)}
                                                    className="p-1.5 bg-white/90 backdrop-blur text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                <a
                                                    href={`${BASE_URL.replace('/api', '')}${file.url}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1.5 bg-white/90 backdrop-blur text-indigo-500 rounded-full shadow-sm hover:bg-indigo-500 hover:text-white transition"
                                                >
                                                    <Eye size={12} />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileManager;
