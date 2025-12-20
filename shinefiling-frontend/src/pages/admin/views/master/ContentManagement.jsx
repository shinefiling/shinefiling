import React, { useState } from 'react';
import {
    Globe, FileText, Layout, Image as ImageIcon, Settings, ExternalLink,
    Plus, Edit, Trash2, Eye, Save, UploadCloud, Search, CheckCircle,
    Type, X, MessageSquare, ArrowRight, MousePointer, BarChart2, Activity,
    Users, Clock, Smartphone, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const BANNERS = [
    { id: 1, title: 'Startup India Sale', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80', status: 'Active', clicks: 1250 },
    { id: 2, title: 'GST Filing Guide', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80', status: 'Scheduled', clicks: 0 },
    { id: 3, title: 'Trademark Safe', image: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&q=80', status: 'Inactive', clicks: 850 }
];

const BLOGS = [
    { id: 1, title: 'How to Register a Pvt Ltd Company in 2025', author: 'Legal Team', date: 'Dec 12, 2024', status: 'Published', views: '4.5k' },
    { id: 2, title: 'Understanding GST Slabs for Services', author: 'Tax Expert', date: 'Dec 10, 2024', status: 'Draft', views: '-' },
    { id: 3, title: '5 Compliance Rulings Every Startup Must Know', author: 'Admin', date: 'Nov 28, 2024', status: 'Published', views: '1.2k' }
];

// --- REUSABLE COMPONENTS ---

const TabButton = ({ active, label, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all font-bold text-sm ${active
            ? 'border-[#B58863] text-[#B58863] bg-[#FDFBF7]'
            : 'text-[#3D4D55] hover:text-[#10232A] hover:bg-gray-50 border-transparent'
            }`}
    >
        <Icon size={18} /> {label}
    </button>
);

const AreaChart = ({ color = "#3B82F6", height = 200 }) => (
    <div className="relative w-full overflow-hidden" style={{ height }}>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full opacity-20">
            <path d="M0 50 L0 35 L10 32 L20 40 L30 25 L40 30 L50 20 L60 25 L70 15 L80 22 L90 10 L100 20 L100 50 Z" fill={color} />
        </svg>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full fill-none stroke-current stroke-2" style={{ color }}>
            <polyline points="0,35 10,32 20,40 30,25 40,30 50,20 60,25 70,15 80,22 90,10 100,20" vectorEffect="non-scaling-stroke" />
        </svg>
    </div>
);

const ContentManagement = ({ stats }) => {
    const [activeTab, setActiveTab] = useState('analytics'); // Default to new tab
    const [showPreview, setShowPreview] = useState(false);

    // Banner Logic
    const [banners, setBanners] = useState(BANNERS);
    const handleDeleteBanner = (id) => setBanners(prev => prev.filter(b => b.id !== id));

    const visitorCount = stats?.kpi?.[2]?.value || '42.5k'; // Index 2 is "Total Users" from backend
    const activeNow = Math.floor(Math.random() * 50) + 10; // Random simulations for "Live" feel

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <div>
                    <h2 className="text-2xl font-bold text-[#10232A] flex items-center gap-2">
                        <Layout className="text-[#B58863]" /> CMS Studio
                    </h2>
                    <p className="text-[#3D4D55] text-xs mt-1">Manage digital presence, blogs, and media assets.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition ${showPreview ? 'bg-[#FDFBF7] border-[#B58863]/20 text-[#B58863]' : 'border-gray-200 text-[#3D4D55] hover:bg-gray-50'}`}
                    >
                        <Eye size={16} /> {showPreview ? 'Hide Preview' : 'Live Preview'}
                    </button>
                    <button className="px-5 py-2 bg-[#10232A] text-white font-bold rounded-xl text-xs shadow-lg hover:bg-[#B58863] transition flex items-center gap-2">
                        Visit Site <ExternalLink size={14} />
                    </button>
                </div>
            </div>

            {/* --- TABS --- */}
            <div className="flex border-b border-gray-100 bg-white overflow-x-auto">
                <TabButton active={activeTab === 'analytics'} label="Web Analytics" icon={BarChart2} onClick={() => setActiveTab('analytics')} />
                <TabButton active={activeTab === 'banners'} label="Banner & Hero" icon={ImageIcon} onClick={() => setActiveTab('banners')} />
                <TabButton active={activeTab === 'blogs'} label="Blog Posts" icon={FileText} onClick={() => setActiveTab('blogs')} />
                <TabButton active={activeTab === 'seo'} label="SEO Meta" icon={Globe} onClick={() => setActiveTab('seo')} />
                <TabButton active={activeTab === 'legal'} label="Legal Pages" icon={Settings} onClick={() => setActiveTab('legal')} />
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                <AnimatePresence mode='wait'>

                    {/* 1. ANALYTICS TAB */}
                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-8"
                        >
                            {/* Key Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold text-[#3D4D55] uppercase tracking-widest mb-2">Total Visitors</p>
                                    <h3 className="text-3xl font-extrabold text-[#10232A]">{visitorCount}</h3>
                                    <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><Activity size={12} /> +12% this week</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold text-[#3D4D55] uppercase tracking-widest mb-2">Avg. Duration</p>
                                    <h3 className="text-3xl font-extrabold text-[#10232A]">2m 45s</h3>
                                    <p className="text-xs text-[#B58863] font-bold mt-2 flex items-center gap-1"><Clock size={12} /> High Engagement</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold text-[#3D4D55] uppercase tracking-widest mb-2">Bounce Rate</p>
                                    <h3 className="text-3xl font-extrabold text-[#10232A]">34.2%</h3>
                                    <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><CheckCircle size={12} /> Excellent</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold text-[#3D4D55] uppercase tracking-widest mb-2">Active Now</p>
                                    <h3 className="text-3xl font-extrabold text-[#B58863] animate-pulse">{activeNow}</h3>
                                    <p className="text-xs text-[#3D4D55] font-bold mt-2 flex items-center gap-1"><Users size={12} /> Reading blogs</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Traffic Chart */}
                                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-[#10232A]">Traffic Overview</h3>
                                        <select className="bg-gray-50 border-none text-xs font-bold text-[#3D4D55] rounded-lg p-2"><option>Last 30 Days</option></select>
                                    </div>
                                    <AreaChart height={280} color="#B58863" />
                                </div>

                                {/* Device & Source */}
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="font-bold text-[#2B3446] mb-4 text-sm">Device Breakdown</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-100 rounded-lg text-[#3D4D55]"><Monitor size={16} /></div>
                                                    <span className="text-sm font-bold text-[#3D4D55]">Desktop</span>
                                                </div>
                                                <span className="text-sm font-bold text-[#10232A]">62%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="w-[62%] bg-[#10232A] h-full rounded-full"></div></div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-100 rounded-lg text-[#3D4D55]"><Smartphone size={16} /></div>
                                                    <span className="text-sm font-bold text-[#3D4D55]">Mobile</span>
                                                </div>
                                                <span className="text-sm font-bold text-[#10232A]">38%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="w-[38%] bg-[#B58863] h-full rounded-full"></div></div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#10232A] to-black p-6 rounded-2xl text-white shadow-lg">
                                        <h3 className="font-bold text-lg mb-2">PageSpeed Score</h3>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center font-bold text-xl">98</div>
                                            <div>
                                                <p className="text-green-400 font-bold text-sm">Optimization: Excellent</p>
                                                <p className="text-gray-400 text-xs">Load Time: 0.8s</p>
                                            </div>
                                        </div>
                                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition">View Technical Report</button>
                                    </div>
                                </div>
                            </div>

                            {/* Top Content Table */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100 font-bold text-[#2B3446]">Top Performing Pages</div>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left text-sm min-w-[600px]">
                                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-4">Page URL</th>
                                                <th className="px-6 py-4">Pageviews</th>
                                                <th className="px-6 py-4">Avg. Time</th>
                                                <th className="px-6 py-4">Bounce Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-bold text-[#B58863]">/service/private-limited-registration</td>
                                                <td className="px-6 py-4 font-mono">12,402</td>
                                                <td className="px-6 py-4">3m 20s</td>
                                                <td className="px-6 py-4 text-green-600">22%</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-bold text-[#B58863]">/blog/gst-filing-guide-2024</td>
                                                <td className="px-6 py-4 font-mono">8,100</td>
                                                <td className="px-6 py-4">5m 12s</td>
                                                <td className="px-6 py-4 text-green-600">18%</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-bold text-[#B58863]">/pricing</td>
                                                <td className="px-6 py-4 font-mono">5,200</td>
                                                <td className="px-6 py-4">1m 05s</td>
                                                <td className="px-6 py-4 text-yellow-600">45%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 2. BANNERS TAB */}
                    {activeTab === 'banners' && (
                        <motion.div key="banners" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">

                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-[#10232A]">Homepage Slider</h3>
                                <button className="px-4 py-2 bg-[#10232A] text-white text-xs font-bold rounded-lg shadow hover:bg-[#B58863] flex items-center gap-2">
                                    <Plus size={16} /> Add Slide
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {banners.map((banner) => (
                                    <div key={banner.id} className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                                        {/* Image Area */}
                                        <div className="h-48 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition md:group-hover:scale-105 duration-700 w-full h-full">
                                                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                            </div>
                                            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase backdrop-blur-md ${banner.status === 'Active' ? 'bg-green-500/90 text-white' :
                                                banner.status === 'Scheduled' ? 'bg-yellow-500/90 text-white' : 'bg-gray-500/90 text-white'
                                                }`}>
                                                {banner.status}
                                            </span>
                                            {/* Actions Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                                                <button className="p-2 bg-white rounded-full text-[#10232A] hover:scale-110 transition"><Edit size={18} /></button>
                                                <button onClick={() => handleDeleteBanner(banner.id)} className="p-2 bg-white rounded-full text-red-600 hover:scale-110 transition"><Trash2 size={18} /></button>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-[#10232A]">{banner.title}</h4>
                                                <div className="flex items-center gap-1 text-xs text-[#3D4D55] font-bold">
                                                    <MousePointer size={12} /> {banner.clicks}
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#B58863] w-3/4 rounded-full"></div>
                                            </div>
                                            <p className="text-[10px] text-[#3D4D55] mt-2 font-bold uppercase">Performance Score: High</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Upload Placeholder */}
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 bg-gray-50/50 hover:bg-blue-50/50 hover:border-[#B58863] transition cursor-pointer text-[#3D4D55] hover:text-[#B58863]">
                                    <UploadCloud size={48} className="mb-4 opacity-50" />
                                    <h4 className="font-bold text-sm">Upload New Creative</h4>
                                    <p className="text-xs">Drag & drop or click to browse</p>
                                    <p className="text-[10px] mt-2 opacity-60">1920x600px | JPG, PNG, WEBP</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 3. BLOGS TAB */}
                    {activeTab === 'blogs' && (
                        <motion.div key="blogs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div className="relative w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D4D55]" size={16} />
                                    <input type="text" placeholder="Search posts..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B58863] text-[#10232A] font-bold" />
                                </div>
                                <button className="px-4 py-2 bg-[#10232A] text-white text-xs font-bold rounded-lg shadow hover:bg-[#B58863] flex items-center gap-2">
                                    <Plus size={16} /> New Post
                                </button>
                            </div>
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left text-sm min-w-[900px]">
                                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Title</th>
                                            <th className="px-6 py-4">Author</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Views</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {BLOGS.map((blog, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition group">
                                                <td className="px-6 py-4 font-bold text-[#10232A]">{blog.title}</td>
                                                <td className="px-6 py-4 text-[#3D4D55] text-xs flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">{blog.author[0]}</div> {blog.author}</td>
                                                <td className="px-6 py-4 text-[#3D4D55] text-xs">{blog.date}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${blog.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-[#3D4D55]'}`}>
                                                        {blog.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs">{blog.views}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-[#3D4D55] hover:text-[#B58863] p-2"><Edit size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* 4. SEO TAB */}
                    {activeTab === 'seo' && (
                        <motion.div key="seo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#10232A] mb-4 flex items-center gap-2"><Globe size={18} className="text-[#B58863]" /> Global Meta Tags</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#3D4D55] uppercase mb-1">Site Title</label>
                                            <input type="text" defaultValue="ShineFiling - India's #1 Legal & Tax Services Platform" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#10232A] focus:outline-none focus:border-[#B58863]" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#3D4D55] uppercase mb-1">Meta Description</label>
                                            <textarea className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#B58863]" defaultValue="Register your Private Limited Company, LLP, or GST with ShineFiling. Expert CA/CS assistance for all your business compliance needs. Affordable, Fast, and 100% Online."></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#3D4D55] uppercase mb-1">Keywords (Comma Separated)</label>
                                            <input type="text" defaultValue="company registration, gst filing, trademark, startup india, ca services" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#3D4D55] focus:outline-none focus:border-[#B58863]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SERP PREVIEW */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#3D4D55] text-xs uppercase mb-4 tracking-widest">Google SERP Preview</h3>
                                    <div className="font-sans">
                                        <div className="text-sm text-[#10232A] flex items-center gap-1 mb-1">
                                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center p-1"><img src="/favicon.ico" alt="" className="w-full h-full opacity-50" /></div>
                                            <span className="font-normal text-[#10232A]">shadefiling.com</span>
                                            <span className="text-[#3D4D55] text-xs text-[10px] ml-1">⋮</span>
                                        </div>
                                        <h4 className="text-xl text-[#B58863] hover:underline cursor-pointer font-normal truncate">ShineFiling - India's #1 Legal & Tax Services Platform</h4>
                                        <p className="text-sm text-[#3D4D55] leading-relaxed mt-1 line-clamp-2">
                                            Register your Private Limited Company, LLP, or GST with ShineFiling. Expert CA/CS assistance for all your business compliance needs. Affordable, Fast...
                                        </p>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-[#10232A] text-white font-bold rounded-xl shadow-lg hover:bg-[#B58863] flex items-center justify-center gap-2 transition">
                                    <Save size={18} /> Save SEO Config
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* 5. LEGAL PAGE*/}
                    {activeTab === 'legal' && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#3D4D55]">
                                <FileText size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-[#10232A] mb-2">Legal Page Manager</h3>
                            <p className="text-[#3D4D55] max-w-md mx-auto mb-8">Edit Privacy Policy, Terms of Service, and Refund Policy directly. Includes version control.</p>
                            <button className="px-6 py-3 bg-[#10232A] text-white font-bold rounded-xl shadow-lg hover:bg-[#B58863] transition">Open Editor</button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ContentManagement;
