import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, Search, User, Bell, LogOut, ArrowRight, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICE_DATA } from '../data/services';
import { getNotifications, getServiceCatalog } from '../api';
import { getInactiveServices } from '../utils/serviceManager';

const Navbar = ({ isLoggedIn, onLogout, user }) => {
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        if (!isLoggedIn || !user) return;

        let interval;
        const fetchNotes = async () => {
            try {
                const data = await getNotifications(user.email);
                if (Array.isArray(data)) {
                    setNotifications(data);
                    setNotificationCount(data.filter(n => !n.isRead && !n.read).length);
                }
            } catch (e) { }
        };

        fetchNotes();
        interval = setInterval(fetchNotes, 10000);
        return () => clearInterval(interval);
    }, [isLoggedIn, user]);

    // Service Filtering Logic
    const [inactiveList, setInactiveList] = useState([]);
    const [apiCatalog, setApiCatalog] = useState([]);

    useEffect(() => {
        // Initial Fetch
        const fetchCatalog = async () => {
            try {
                const catalog = await getServiceCatalog();
                if (Array.isArray(catalog)) setApiCatalog(catalog);
                setInactiveList(getInactiveServices());
            } catch (err) {
                console.warn("[Navbar] Failed to fetch service catalog:", err);
            }
        };
        fetchCatalog();

        const handleStatusChange = () => setInactiveList(getInactiveServices());
        window.addEventListener('serviceStatusChanged', handleStatusChange);
        return () => window.removeEventListener('serviceStatusChanged', handleStatusChange);
    }, []);

    const isServiceActive = (serviceName) => {
        const apiService = apiCatalog.find(s => s.name === serviceName);
        if (apiService && apiService.status === 'INACTIVE') return false;
        if (inactiveList.includes(serviceName)) return false;
        return true;
    };

    const categories = [
        'business_reg', 'tax_compliance', 'roc_compliance', 'licenses',
        'ipr', 'labour_hr', 'certifications', 'legal', 'financial'
    ];

    const navLabels = {
        business_reg: 'BUSINESS REG',
        tax_compliance: 'TAX & GST',
        roc_compliance: 'ROC COMPLEX',
        licenses: 'GOVT LICENSES',
        ipr: 'TRADEMARK/IP',
        labour_hr: 'LABOUR & HR',
        certifications: 'CERTIFICATES',
        legal: 'LEGAL DRAFTS',
        financial: 'FINANCIALS',
        storage: 'MINI DIGILOCKER'
    };

    const getServiceSlug = (name) => {
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const map = {
            "privatelimitedcompanyregistration": "private-limited-company",
            "onepersoncompanyopc": "one-person-company",
            "limitedliabilitypartnershipllp": "llp-registration",
            "partnershipfirmregistration": "partnership-firm",
            "soleproprietorshipregistration": "sole-proprietorship",
            "section8ngocompany": "section-8-company",
            "nidhicompanyregistration": "nidhi-company-registration",
            "producercompanyregistration": "producer-company-registration",
            "publiclimitedcompany": "public-limited-company",

            "gstregistration": "tax-compliance/gst-registration",
            "gstmonthlyreturngstr13b": "tax-compliance/gst-monthly-return",
            "gstannualreturngstr9": "tax-compliance/gst-annual-return",
            "incometaxreturnitr17": "tax-compliance/income-tax-return",
            "tdsreturnfiling": "tax-compliance/tds-return-filing",
            "professionaltaxregfiling": "tax-compliance/professional-tax",
            "advancetaxfiling": "tax-compliance/advance-tax",
            "taxauditfiling": "tax-compliance/tax-audit",

            "annualrocfilingaoc4mgt7": "roc-filing/annual-return",
            "directorkycdir3kyc": "roc-filing/director-kyc",
            "addremovedirector": "roc-filing/add-remove-director",
            "changeofregisteredoffice": "roc-filing/change-registered-office",
            "sharetransferfiling": "roc-filing/share-transfer",
            "increaseauthorizedcapital": "roc-filing/increase-authorized-capital",
            "moaaoaamendment": "roc-filing/moa-amendment",
            "companynamechange": "roc-filing/company-name-change",
            "strikeoffcompany": "roc-filing/strike-off-company",

            "fssailicensebasicstatecentral": "licenses/fssai-license",
            "shopestablishmentlicense": "licenses/shop-establishment-license",
            "tradelicense": "licenses/trade-license",
            "labourlicense": "licenses/labour-license",
            "factorylicense": "licenses/factory-license",
            "druglicense": "licenses/drug-license",
            "firesafetynoc": "licenses/fire-safety-noc",
            "pollutioncontrolctecto": "licenses/pollution-control",
            "importexportcodeiec": "licenses/import-export-code",
            "gumasthalicense": "licenses/gumastha-license",
            "barliquorlicense": "licenses/bar-liquor-license",

            "trademarkregistration": "intellectual-property/trademark-registration",
            "trademarkobjectionreply": "intellectual-property/trademark-objection",
            "trademarkhearingsupport": "intellectual-property/trademark-hearing",
            "trademarkassignment": "intellectual-property/trademark-assignment",
            "trademarkrenewal": "intellectual-property/trademark-renewal",
            "copyrightregistration": "intellectual-property/copyright-registration",
            "patentfilingprovisionalcomplete": "intellectual-property/patent-filing",
            "designregistration": "intellectual-property/design-registration",

            "pfregistrationfiling": "labour/pf-registration",
            "esiregistrationfiling": "labour/esi-registration",
            "professionaltaxregreturn": "labour-law/professional-tax",
            "labourwelfarefundfiling": "labour-law/labour-welfare-fund",
            "gratuityactregistration": "labour-law/gratuity-act",
            "bonusactcompliance": "labour-law/bonus-act",
            "minimumwagescompliance": "labour-law/minimum-wages",

            "msmeudyamregistration": "business-certifications/msme-registration",
            "isocertification900114001": "business-certifications/iso-certification",
            "startupindiarecognition": "business-certifications/startup-india",
            "digitalsignaturedsc": "business-certifications/digital-signature",
            "barcoderegistration": "business-certifications/bar-code",
            "tanpanapplication": "business-certifications/tan-pan",

            "partnershipdeed": "legal-drafting/partnership-deed",
            "foundersagreement": "legal-drafting/founders-agreement",
            "shareholdersagreement": "legal-drafting/shareholders-agreement",
            "employmentagreement": "legal-drafting/employment-agreement",
            "rentagreement": "legal-drafting/rent-agreement",
            "franchiseagreement": "legal-drafting/franchise-agreement",
            "ndanondisclosure": "legal-drafting/nda",
            "vendoragreement": "legal-drafting/vendor-agreement",

            "cmadatapreparation": "financial-services/cma-data-preparation",
            "projectreportforloans": "financial-services/project-report",
            "bankloandocumentation": "financial-services/bank-loan-documentation",
            "cashflowcompliance": "financial-services/cash-flow-compliance",
            "startuppitchdeck": "financial-services/startup-pitch-deck",
            "businessvaluationreports": "financial-services/business-valuation",
        };
        const key = normalize(name);
        return map[key];
    };

    // Smart Scroll Logic
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show if scrolling UP or at the very TOP
            if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                // Hide if scrolling DOWN and not at top
                setIsVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`fixed w-full z-50 top-0 left-0 transition-transform duration-300 ease-in-out font-sans shadow-premium ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            {/* ROW 1: Logo & Auth (White Background) */}
            <div className="w-full bg-white h-20 border-b border-slate-100">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-full flex justify-between items-center">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-0 group relative z-10 text-2xl font-black tracking-tighter text-navy leading-none shrink-0">
                        <img
                            src="/logo.png"
                            alt="ShineFiling"
                            className="h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity -mr-1.5"
                        />
                        <span className="pt-2">
                            hine<span className="text-bronze">Filing</span>
                        </span>
                    </Link>

                    {/* SEARCH BAR (Fills the empty space) */}
                    <div className="hidden lg:flex flex-1 max-w-2xl mx-12 relative group z-50">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search size={16} className="text-slate-400 group-focus-within:text-bronze transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchQuery(val);
                                if (val.trim()) {
                                    const query = val.toLowerCase();
                                    const results = [];
                                    for (const catKey of Object.keys(SERVICE_DATA)) {
                                        const cat = SERVICE_DATA[catKey];
                                        cat.items.forEach(item => {
                                            if (item.toLowerCase().includes(query) && isServiceActive(item)) {
                                                results.push({ name: item, category: cat.label });
                                            }
                                        });
                                    }
                                    setSearchResults(results.slice(0, 8)); // Limit to 8 results
                                } else {
                                    setSearchResults([]);
                                }
                            }}
                            onFocus={() => {
                                if (searchQuery.trim() && searchResults.length === 0) {
                                    // Trigger search if focusing back on populated field
                                    const val = searchQuery;
                                    const query = val.toLowerCase();
                                    const results = [];
                                    for (const catKey of Object.keys(SERVICE_DATA)) {
                                        const cat = SERVICE_DATA[catKey];
                                        cat.items.forEach(item => {
                                            if (item.toLowerCase().includes(query) && isServiceActive(item)) {
                                                results.push({ name: item, category: cat.label });
                                            }
                                        });
                                    }
                                    setSearchResults(results.slice(0, 8));
                                }
                            }}
                            onBlur={() => setTimeout(() => setSearchResults([]), 200)} // Delay to allow click
                            placeholder="Search for services (e.g. GST, Company Registration)..."
                            className="w-full h-11 pl-11 pr-4 rounded-full bg-slate-50 border border-slate-200/80 text-sm font-medium text-navy placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-bronze focus:ring-4 focus:ring-bronze/10 transition-all shadow-inner hover:bg-white hover:shadow-md"
                        />
                        {/* SEARCH DROPDOWN */}
                        <AnimatePresence>
                            {searchResults.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2"
                                >
                                    {searchResults.map((res, idx) => {
                                        const slug = getServiceSlug(res.name);
                                        const url = slug ? `/services/${slug}` : `/services/apply?name=${encodeURIComponent(res.name)}`;
                                        return (
                                            <Link
                                                key={idx}
                                                to={url}
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setSearchResults([]);
                                                }}
                                                className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors group/result"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-navy group-hover/result:text-bronze transition-colors">{res.name}</span>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400">{res.category}</span>
                                                </div>
                                                <ArrowRight size={14} className="text-slate-300 group-hover/result:text-bronze -translate-x-2 group-hover/result:translate-x-0 transition-all" />
                                            </Link>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* TOP LINKS */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link to="/about-us" className="text-xs font-bold text-navy hover:text-bronze tracking-wider uppercase transition-colors">ABOUT US</Link>
                        <Link to="/contact-us" className="text-xs font-bold text-navy hover:text-bronze tracking-wider uppercase transition-colors">CONTACT US</Link>
                        <Link to="/careers" className="text-xs font-bold text-navy hover:text-bronze tracking-wider uppercase transition-colors">CAREERS</Link>

                        <div className="h-5 w-px bg-slate-200"></div>

                        {!isLoggedIn ? (
                            <>
                                <Link to="/login" className="text-xs font-bold text-navy hover:text-bronze tracking-wider uppercase transition-colors">LOGIN</Link>
                                <Link to="/signup" className="px-8 py-2.5 rounded-full bg-bronze hover:bg-bronze-dark text-white text-xs font-bold tracking-wider shadow-lg shadow-bronze/20 transition-all hover:-translate-y-0.5">
                                    SIGN UP
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-6">
                                {/* NOTIFICATIONS */}
                                <button className="relative text-navy hover:text-bronze transition p-1">
                                    <Bell size={20} />
                                    {notificationCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                                </button>

                                {/* USER PROFILE */}
                                <div className="flex items-center gap-3 cursor-pointer group relative">
                                    <div className="text-right hidden xl:block">
                                        <p className="text-xs font-bold text-navy">{user?.fullName}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">My Account</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm ring-2 ring-slate-100 group-hover:ring-bronze transition-all overflow-hidden relative">
                                        {user?.profileImage ? (
                                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'
                                        )}
                                    </div>

                                    {/* DROPDOWN */}
                                    <div className="absolute top-full right-0 mt-4 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                        <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                                            <p className="text-xs font-bold text-navy">{user?.email}</p>
                                        </div>
                                        <Link
                                            to={(user?.role?.includes('ADMIN')) ? "/admin-dashboard" : (user?.role === 'AGENT' ? "/agent-dashboard" : "/dashboard")}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-navy transition-colors"
                                        >
                                            <User size={16} /> Dashboard
                                        </Link>
                                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left border-t border-slate-50 mt-1">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="lg:hidden text-navy p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* ROW 2: Primary Navigation Categories (Deep Navy Background) */}
            <div className="hidden lg:block w-full bg-navy h-12 shadow-md relative z-40">
                <div className="max-w-[1600px] mx-auto px-2 lg:px-4 xl:px-8 h-full">
                    <div className="flex w-full justify-between items-center h-full">
                        {categories.map((catKey, idx) => {
                            const category = SERVICE_DATA[catKey];
                            if (!category) return null;

                            const isWide = category.items.length > 5;
                            // Smarter positioning logic
                            let dropdownPosClass = "left-1/2 -translate-x-1/2 origin-top";
                            if (idx < 3) dropdownPosClass = "left-0 origin-top-left";
                            if (idx > 5) dropdownPosClass = "right-0 origin-top-right";

                            return (
                                <div
                                    key={catKey}
                                    className="relative group h-full flex items-center"
                                    onMouseEnter={() => setHoveredMenu(catKey)}
                                    onMouseLeave={() => setHoveredMenu(null)}
                                >
                                    <button className={`flex items-center gap-0.5 lg:gap-1 xl:gap-1.5 text-[9px] lg:text-[10px] xl:text-xs font-bold uppercase tracking-wide lg:tracking-wider transition-colors h-full px-1 lg:px-2 ${hoveredMenu === catKey ? 'text-bronze' : 'text-white/90 hover:text-white'}`}>
                                        <span className="whitespace-nowrap">{navLabels[catKey]}</span>
                                        <ChevronDown size={10} className={`transform transition-transform duration-300 opacity-50 ${hoveredMenu === catKey ? 'rotate-180 text-bronze opacity-100' : ''}`} />
                                    </button>

                                    {/* MEGA MENU DROPDOWN */}
                                    <AnimatePresence>
                                        {hoveredMenu === catKey && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                                transition={{ duration: 0.15 }}
                                                className={`absolute top-[100%] ${dropdownPosClass} bg-white rounded-b-xl border border-slate-200/60 shadow-2xl p-6 z-50 ${isWide ? 'w-[500px] xl:w-[600px]' : 'w-64 xl:w-72'}`}
                                            >
                                                <div className="relative z-10">
                                                    <h4 className="flex items-center gap-2 text-navy font-bold text-xs uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
                                                        <category.icon size={16} className="text-bronze" />
                                                        {category.label}
                                                    </h4>
                                                    <div className={`grid gap-x-8 gap-y-3 ${isWide ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                                        {category.items.map((item, idy) => {
                                                            if (!isServiceActive(item)) return null;
                                                            const slug = getServiceSlug(item);
                                                            return (
                                                                <Link
                                                                    key={idy}
                                                                    to={slug ? `/services/${slug}` : `/services/apply?name=${encodeURIComponent(item)}`}
                                                                    className="text-xs text-slate-600 hover:text-bronze hover:translate-x-1 transition-all flex items-center justify-between group/item py-1"
                                                                >
                                                                    <span className="truncate max-w-[90%]">{item}</span>
                                                                    <ArrowRight size={10} className="text-bronze opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Simplified for brevity, matches style) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="xl:hidden bg-navy fixed inset-0 z-[60] flex flex-col text-white"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <span className="text-xl font-black">Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {categories.map(cat => (
                                <div key={cat} className="border-b border-white/5 pb-4">
                                    <p className="text-bronze text-xs font-bold uppercase mb-2">{navLabels[cat]}</p>
                                    <div className="space-y-2 pl-4">
                                        {SERVICE_DATA[cat]?.items.slice(0, 5).map(item => (
                                            <p key={item} className="text-sm text-white/70">{item}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
