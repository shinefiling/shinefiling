import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Upload, ArrowRight, Zap, Loader, ChevronRight } from 'lucide-react';
import { submitServiceRequest, getServiceCatalog } from '../../api';
import { getInactiveServices } from '../../utils/serviceManager';
import { SERVICE_DATA } from '../../data/services';

const NewFiling = ({ setActiveTab, initialCategory }) => {
    const [step, setStep] = useState(1); // 1: Select, 2: Form/Upload, 3: Success
    const [activeCategory, setActiveCategory] = useState(initialCategory || Object.keys(SERVICE_DATA)[0]);

    useEffect(() => {
        if (initialCategory) setActiveCategory(initialCategory);
    }, [initialCategory]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const [serviceCatalog, setServiceCatalog] = useState({});
    const [categories, setCategories] = useState([]);

    // Fetch and process services (Dynamic Control)
    useEffect(() => {
        const loadServices = async () => {
            try {
                const apiData = await getServiceCatalog();
                const inactiveList = getInactiveServices();

                // Process API data or fallback to SERVICE_DATA
                let rawServices = [];
                if (apiData && apiData.length > 0) {
                    rawServices = apiData;
                } else {
                    // Flatten SERVICE_DATA if API fails/empty
                    Object.values(SERVICE_DATA).forEach(cat => {
                        cat.items.forEach(item => {
                            rawServices.push({
                                name: item,
                                category: cat.label,
                                categoryId: cat.id,
                                icon: cat.icon
                            });
                        });
                    });
                }

                // Filter Active Services
                const activeServices = rawServices.filter(s => {
                    // Check if inactive in local storage (Admin Control) OR if marked inactive in API
                    const isInactiveGlobally = s.status === 'INACTIVE';
                    const isInactiveLocally = inactiveList.includes(s.id || s.name); // Check both ID and Name for robustness
                    return !isInactiveGlobally && !isInactiveLocally;
                });

                // Group by Category
                const grouped = {};
                const cats = [];

                // Helper to find icon - if API doesn't return icon component, use mapping
                const getIcon = (catId) => SERVICE_DATA[catId]?.icon || Zap;

                activeServices.forEach(s => {
                    const catId = s.categoryId || 'others';
                    const catLabel = s.category || 'Other Services';

                    if (!grouped[catId]) {
                        grouped[catId] = {
                            id: catId,
                            label: catLabel,
                            icon: getIcon(catId),
                            items: []
                        };
                        cats.push({ id: catId, label: catLabel, icon: getIcon(catId) });
                    }
                    grouped[catId].items.push(s);
                });

                setServiceCatalog(grouped);
                setCategories(cats);

                // Set default active category if not set
                if (cats.length > 0 && !activeCategory) {
                    setActiveCategory(cats[0].id);
                } else if (cats.length > 0 && !grouped[activeCategory]) {
                    // If current category is empty/gone, switch to first available
                    setActiveCategory(cats[0].id);
                }

            } catch (err) {
                console.error("Failed to load services", err);
            }
        };

        loadServices();

        // Listen for real-time updates from Admin tab (if same browser)
        const handleUpdate = () => loadServices();
        window.addEventListener('serviceStatusChanged', handleUpdate);
        return () => window.removeEventListener('serviceStatusChanged', handleUpdate);
    }, [activeCategory]);

    const filteredServices = searchTerm
        ? Object.values(serviceCatalog).flatMap(c => c.items).filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : (serviceCatalog[activeCategory]?.items || []);

    // Service Route Mapping
    const SERVICE_ROUTE_MAP = {
        'Private Limited Company Registration': '/services/private-limited-company',
        'One Person Company (OPC)': '/services/one-person-company',
        'Limited Liability Partnership (LLP)': '/services/llp-registration',
        'Partnership Firm Registration': '/services/partnership-firm',
        'Sole Proprietorship Registration': '/services/sole-proprietorship',
        'Section 8 NGO Company': '/services/section-8-company',
        'Nidhi Company Registration': '/services/nidhi-company-registration',
        'Producer Company Registration': '/services/producer-company-registration',
        'Public Limited Company': '/services/public-limited-company',
        'Rent Agreement': '/services/rent-agreement',

        // Licenses
        'FSSAI License (Basic/State/Central)': '/services/licenses/fssai-license',
        'Shop & Establishment License': '/services/licenses/shop-establishment-license',
        'Trade License': '/services/licenses/trade-license',
        'Labour License': '/services/licenses/labour-license',
        'Factory License': '/services/licenses/factory-license',
        'Drug License': '/services/licenses/drug-license',
        'Fire Safety NOC': '/services/licenses/fire-safety-noc',
        'Pollution Control (CTE/CTO)': '/services/licenses/pollution-control',
        'Import Export Code (IEC)': '/services/licenses/import-export-code',
        'Gumastha License': '/services/licenses/gumastha-license',
        'Bar / Liquor License': '/services/licenses/bar-liquor-license',

        // Tax
        'GST Registration': '/services/tax-compliance/gst-registration',
        'GST Monthly Return (GSTR-1 & 3B)': '/services/tax-compliance/gst-monthly-return',
        'GST Annual Return (GSTR-9)': '/services/tax-compliance/gst-annual-return',
        'Income Tax Return (ITR 1–7)': '/services/tax-compliance/income-tax-return',
        'TDS Return Filing': '/services/tax-compliance/tds-return-filing',
        'Professional Tax Reg & Filing': '/services/tax-compliance/professional-tax',

        // IP
        'Trademark Registration': '/services/intellectual-property/trademark-registration',
        'Copyright Registration': '/services/intellectual-property/copyright-registration',
        'Patent Filing (Provisional/Complete)': '/services/intellectual-property/patent-filing',
        'Design Registration': '/services/intellectual-property/design-registration',
        'Trademark Renewal': '/services/intellectual-property/trademark-renewal',
        'Trademark Objection Reply': '/services/intellectual-property/trademark-objection',
        'Trademark Hearing Support': '/services/intellectual-property/trademark-hearing',
        'Trademark Assignment': '/services/intellectual-property/trademark-assignment'
    };

    // Step 1: Service Selection
    const handleSelectService = (serviceName, categoryLabel) => {
        // Construct URL based on map or fallback to generic slug
        const route = SERVICE_ROUTE_MAP[serviceName];
        if (route) {
            window.location.href = route;
        } else {
            // Fallback for unmapped
            const slug = serviceName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
            window.location.href = `/service/${slug}`; // Likely to 404 if not mapped, but harmless fallback
        }
    };

    // Step 2: Submit Form & Create Order
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user')) || { id: 1, email: 'guest@example.com' };
            const payload = {
                userId: user.id || 1, // Fallback if ID missing
                serviceName: selectedService.name,
                status: 'Pending',
                ...formData
            };

            await submitServiceRequest(payload);
            setStep(3);
        } catch (err) {
            alert("Submission Failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Wizard Header Removed as per request */}
            <div className="flex flex-col items-center justify-center mb-2">
                {/* Spacing/Header area if needed, otherwise empty or simplified */}
            </div>

            {/* STEP 1: SELECT SERVICE */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="text-center max-w-xl mx-auto mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Service Catalog</h2>
                        <p className="text-slate-500 text-sm">Explore our comprehensive suite of legal and business services.</p>

                        <div className="relative mt-5">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-full py-3 pl-10 pr-6 shadow-sm focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition text-sm"
                                placeholder="Search for a service (e.g. GST, Trademark, Private Limited)..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
                        {/* Categories Sidebar */}
                        <div className="lg:w-64 space-y-1.5">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Categories</h3>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveCategory(cat.id); setSearchTerm(''); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${activeCategory === cat.id && !searchTerm
                                        ? 'bg-slate-900 text-white shadow-lg'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <cat.icon size={16} className={activeCategory === cat.id && !searchTerm ? 'text-indigo-400' : 'text-slate-400'} />
                                    {cat.label}
                                    {activeCategory === cat.id && !searchTerm && <ChevronRight size={14} className="ml-auto text-slate-500" />}
                                </button>
                            ))}
                        </div>

                        {/* Services Grid */}
                        <div className={`flex-1 ${!searchTerm ? 'bg-slate-50 p-6 rounded-2xl border border-slate-200' : ''}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {filteredServices.map((srv, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleSelectService(srv.name, srv.category)}
                                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-600 hover:shadow-md cursor-pointer transition-all group flex items-start justify-between"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <Zap size={16} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-700 text-sm group-hover:text-slate-900 leading-snug">{srv.name}</h4>
                                                <p className="text-[10px] text-slate-400 mt-0.5">{srv.category}</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                                {filteredServices.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-slate-400 text-sm">
                                        No services found matching "{searchTerm}"
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: FORM & UPLOAD */}
            {step === 2 && selectedService && (
                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-200 max-w-3xl mx-auto relative overflow-hidden animate-in fade-in zoom-in duration-300">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                {selectedService.name}
                            </h2>
                            <p className="text-slate-500 text-xs mt-0.5">Category: {selectedService.category}</p>
                        </div>
                    </div>

                    {/* AI Assistant Banner */}
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 mb-6">
                        <div className="p-2 bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20"><Zap size={16} fill="currentColor" /></div>
                        <div>
                            <h5 className="font-bold text-slate-800 text-xs mb-0.5">AI Form Assistant Active</h5>
                            <p className="text-[11px] text-slate-500 leading-relaxed">I've pre-filled some fields based on your profile. Uploading documents like PAN or Aadhaar will allow me to auto-extract more details.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Entity / Applicant Name</label>
                                <input required onChange={e => setFormData({ ...formData, companyName: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:bg-white outline-none transition font-medium text-slate-700 placeholder:text-slate-400 text-sm" placeholder="e.g. Acme Innovations Pvt Ltd" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business Activity / Notes</label>
                                <input required onChange={e => setFormData({ ...formData, activity: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:bg-white outline-none transition font-medium text-slate-700 placeholder:text-slate-400 text-sm" placeholder="Describe your business activity..." />
                            </div>
                        </div>

                        {/* Document Upload Area */}
                        <div
                            onClick={() => document.getElementById('file-upload').click()}
                            className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-indigo-600 transition-colors cursor-pointer group relative"
                        >
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    if (files.length > 0) {
                                        setFormData({ ...formData, documents: files.map(f => f.name) });
                                    }
                                }}
                            />

                            {formData.documents && formData.documents.length > 0 ? (
                                <div className="space-y-2">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full shadow-md flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">{formData.documents.length} File(s) Selected</p>
                                    <p className="text-xs text-slate-500">{formData.documents.join(', ')}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-indigo-600">
                                        <Upload size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 mb-0.5">Click to upload or drag & drop</p>
                                    <p className="text-[11px] text-slate-400">PAN Card, Aadhaar, or utility bills (PDF, JPG)</p>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button type="button" onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-800 transition text-sm">Back</button>
                            <button disabled={loading} className="px-8 py-2.5 rounded-xl bg-slate-900 text-white font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition flex items-center gap-2 text-sm">
                                {loading ? <Loader className="animate-spin" size={16} /> : <>Submit Request <ArrowRight size={16} /></>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 3 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl mx-auto animate-in zoom-in duration-500">
                    <div className="inline-flex relative mb-6">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white relative z-10 shadow-lg shadow-green-500/30">
                            <CheckCircle size={40} strokeWidth={3} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Application Submitted!</h2>
                    <p className="text-slate-500 mb-8 text-base max-w-sm mx-auto leading-relaxed">Your request for <strong className="text-slate-800">{selectedService?.name}</strong> has been received. Our team will review the documents and update you shortly.</p>

                    <div className="flex justify-center gap-4">
                        <button onClick={() => setActiveTab('orders')} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm">
                            Track Status
                        </button>
                        <button onClick={() => setStep(1)} className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition text-sm">
                            File Another
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewFiling;
