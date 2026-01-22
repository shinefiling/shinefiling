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
    const [expandedMobileCat, setExpandedMobileCat] = useState(null);
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
        'ipr', 'labour_hr', 'certifications', 'legal',
        'legal_notices', 'corrections', 'closure', 'financial'
    ];

    const navLabels = {
        business_reg: 'BUSINESS REG',
        tax_compliance: 'TAX & GST',
        roc_compliance: 'ROC COMPLIANCE',
        licenses: 'LICENSES',
        ipr: 'TRADEMARK',
        labour_hr: 'LABOUR/HR',
        certifications: 'CERTIFICATES',
        legal: 'DRAFTING',
        financial: 'FINANCE',
        legal_notices: 'NOTICES',
        corrections: 'CORRECTIONS',
        closure: 'CLOSURE',
        storage: 'DIGILOCKER'
    };

    const getServiceSlug = (name) => {
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const map = {
            "privatelimitedcompanyregistration": "private-limited-company",
            "onepersoncompanyopcregistration": "one-person-company",
            "limitedliabilitypartnershipllpregistration": "llp-registration",
            "partnershipfirmregistration": "partnership-firm",
            "soleproprietorshipregistration": "sole-proprietorship",
            "section8ngocompanyregistration": "section-8-company",
            "nidhicompanyregistration": "nidhi-company-registration",
            "producercompanyregistration": "producer-company-registration",
            "publiclimitedcompanyregistration": "public-limited-company",
            "indiansubsidiaryregistration": "indian-subsidiary-registration",
            "foreigncompanyregistrationindia": "foreign-company-registration",
            "startupincorporationadvisory": "startup-incorporation-advisory",

            "gstregistration": "tax-compliance/gst-registration",
            "gstamendmentcorrection": "tax-compliance/gst-amendment",
            "gstmonthlyreturngstr1": "gst-return/gstr-1",
            "gstmonthlyreturngstr3b": "gst-return/gstr-3b",
            "gstannualreturngstr9": "tax_compliance/gst-annual-return",
            "gstauditgstr9c": "tax-compliance/gst-audit",
            "gstcancellation": "tax-compliance/gst-cancellation",

            "incometaxreturnitr1": "income-tax/itr-1",
            "incometaxreturnitr2": "income-tax/itr-2",
            "incometaxreturnitr3": "income-tax/itr-3",
            "incometaxreturnitr4": "income-tax/itr-4",
            "incometaxreturnitr567": "income-tax/itr-5-6-7",

            "tdsreturnfiling": "tax-compliance/tds-return-filing",
            "professionaltaxregfiling": "tax-compliance/professional-tax",
            "advancetaxfiling": "tax-compliance/advance-tax",
            "taxauditfiling": "tax-compliance/tax-audit",

            "annualrocfilingaoc4": "roc-filing/annual-return",
            "annualrocfilingmgt7": "roc-filing/annual-return",
            "directorkycdir3kyc": "roc-filing/director-kyc",
            "adddirector": "roc-filing/add-remove-director",
            "removedirector": "roc-filing/add-remove-director",
            "changeregisteredoffice": "roc-filing/change-registered-office",
            "sharetransferfiling": "roc-filing/share-transfer",
            "increaseauthorizedcapital": "roc-filing/increase-authorized-capital",
            "moaamendment": "roc-filing/moa-amendment",
            "aoaamendment": "roc-filing/aoa-amendment",
            "companynamechange": "roc-filing/company-name-change",
            "strikeoffcompany": "roc-filing/strike-off-company",

            "fssairegistrationbasic": "licenses/fssai-license",
            "fssailicensestate": "licenses/fssai-license",
            "fssailicensecentral": "licenses/fssai-central-license",
            "fssairenewal": "licenses/fssai-renewal",
            "fssaicorrection": "licenses/fssai-license",
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
            "trademarkhearingrepresentation": "intellectual-property/trademark-hearing",
            "trademarkassignment": "intellectual-property/trademark-assignment",
            "trademarkrenewal": "intellectual-property/trademark-renewal",
            "copyrightregistration": "intellectual-property/copyright-registration",
            "patentfilingprovisionalcomplete": "intellectual-property/patent-filing",
            "patentprovisionalfiling": "intellectual-property/patent-provisional",
            "patentcompletefiling": "intellectual-property/patent-complete",
            "designregistration": "intellectual-property/design-registration",

            "pfregistrationfiling": "labour/pf-registration",
            "pfregistration": "labour/pf-registration",
            "pffiling": "labour/pf-filing",
            "pfreturnfiling": "labour/pf-filing",
            "esiregistrationfiling": "labour/esi-registration",
            "esiregistration": "labour/esi-registration",
            "esifiling": "labour/esi-filing",
            "esireturnfiling": "labour/esi-filing",
            "professionaltaxregreturn": "labour/professional-tax-registration",
            "professionaltaxregistration": "labour/professional-tax-registration",
            "professionaltaxfiling": "labour/professional-tax-filing",
            "labourwelfarefundfiling": "labour/labour-welfare-fund",
            "payrollcompliance": "labour/payroll-compliance",
            "gratuityactregistration": "labour-law/gratuity-act",
            "bonusactcompliance": "labour-law/bonus-act",
            "minimumwagescompliance": "labour-law/minimum-wages",

            "msmeudyamregistration": "business-certifications/msme-registration",
            "isocertification90011400127001": "business-certifications/iso-certification",
            "startupindiaregistration": "business-certifications/startup-india",
            "digitalsignaturecertificatedsc": "business-certifications/digital-signature",
            "barcodegs1registration": "business-certifications/bar-code",
            "panapplication": "business-certifications/tan-pan",
            "tanapplication": "business-certifications/tan-pan",

            "partnershipdeeddrafting": "legal-drafting/partnership-deed",
            "foundersagreement": "legal-drafting/founders-agreement",
            "shareholdersagreement": "legal-drafting/shareholders-agreement",
            "employmentagreement": "legal-drafting/employment-agreement",
            "rentleaseagreement": "legal-drafting/rent-agreement",
            "franchiseagreement": "legal-drafting/franchise-agreement",
            "ndanondisclosureagreement": "legal-drafting/nda",
            "vendorserviceagreement": "legal-drafting/vendor-agreement",

            "legalnoticedrafting": "legal-notices/legal-notice-drafting",
            "replytolegalnotice": "legal-notices/reply-to-legal-notice",
            "chequebouncenoticesection138": "legal-notices/cheque-bounce-notice",
            "gstincometaxnoticereply": "legal-notices/tax-notice-reply",
            "rocnoticereply": "legal-notices/roc-notice-reply",

            "pancorrection": "corrections/pan-correction",
            "gstcertificatecorrection": "corrections/gst-correction",
            "fssailicensecorrection": "corrections/fssai-correction",
            "companyllpdetailcorrection": "corrections/company-llp-correction",
            "dindsccorrection": "corrections/din-dsc-correction",

            "llpclosure": "business-closure/llp-closure",
            "gstcancellationbusinessclosure": "tax-compliance/gst-cancellation",
            "proprietorshipclosure": "business-closure/proprietorship-closure",
            "fssailicensecancellation": "business-closure/fssai-cancellation",

            "cmadatapreparation": "financial-services/cma-data-preparation",
            "projectreportforbankloan": "financial-services/project-report",
            "bankloandocumentation": "financial-services/bank-loan-documentation",
            "cashflowcompliance": "financial-services/cash-flow-compliance",
            "startuppitchdeck": "financial-services/startup-pitch-deck",
            "businessvaluation": "financial-services/business-valuation",
            "virtualcfoservices": "financial-services/virtual-cfo",
            "cashflowstatement": "financial-services/cash-flow-compliance",
        };
        const key = normalize(name);
        return map[key];
    };

    // Smart Scroll Logic
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    // Dynamic "More" Categories Count
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w >= 1440) setVisibleCount(12);
            else if (w >= 1200) setVisibleCount(10);
            else if (w >= 1024) setVisibleCount(8);
            else setVisibleCount(0);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        <>
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
                    {/* Gold Separation Line */}
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-bronze via-yellow-400 to-bronze z-50"></div>
                    <div className="max-w-[1600px] mx-auto px-6 h-full">
                        <div className="flex w-full justify-between items-center h-full">
                            {categories.slice(0, visibleCount).map((catKey, idx) => {
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
                                        <button className={`flex items-center gap-0.5 lg:gap-1 xl:gap-1.5 text-[8.5px] lg:text-[9.5px] xl:text-xs font-bold uppercase tracking-wide lg:tracking-wider transition-colors h-full px-0.5 lg:px-1.5 ${hoveredMenu === catKey ? 'text-bronze' : 'text-white/90 hover:text-white'}`}>
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

                            {/* MORE DROPDOWN */}
                            {categories.length > visibleCount && (
                                <div
                                    className="relative group h-full flex items-center"
                                    onMouseEnter={() => setHoveredMenu('more')}
                                    onMouseLeave={() => setHoveredMenu(null)}
                                >
                                    <button className={`flex items-center gap-1 xl:gap-1.5 text-[9.5px] lg:text-[10px] xl:text-xs font-bold uppercase tracking-wider transition-colors h-full px-1 lg:px-2 ${hoveredMenu === 'more' ? 'text-bronze' : 'text-white/90 hover:text-white'}`}>
                                        MORE
                                        <ChevronDown size={10} className={`transform transition-transform duration-300 opacity-50 ${hoveredMenu === 'more' ? 'rotate-180 text-bronze opacity-100' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {hoveredMenu === 'more' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-[100%] right-0 bg-white rounded-b-xl border border-slate-200/60 shadow-2xl p-4 min-w-[220px] z-50"
                                            >
                                                <div className="space-y-1">
                                                    {categories.slice(visibleCount).map((catKey) => {
                                                        const category = SERVICE_DATA[catKey];
                                                        return (
                                                            <div key={catKey} className="group/sub relative">
                                                                <div className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-bronze transition-all cursor-pointer">
                                                                    <div className="flex items-center gap-3">
                                                                        <category.icon size={14} className="text-slate-400 group-hover/sub:text-bronze" />
                                                                        <span className="text-xs font-bold uppercase tracking-wide">{navLabels[catKey]}</span>
                                                                    </div>
                                                                    <ArrowRight size={12} className="text-slate-300 group-hover/sub:text-bronze opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all" />
                                                                </div>

                                                                {/* SECONDARY MEGA MENU ON HOVER */}
                                                                <div className="absolute top-0 right-[100%] pr-2 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all">
                                                                    <div className="bg-white border border-slate-100 rounded-xl shadow-2xl p-5 min-w-[280px]">
                                                                        <h5 className="flex items-center gap-2 text-navy font-bold text-[10px] uppercase tracking-wider mb-3 pb-2 border-b border-slate-50">
                                                                            <category.icon size={12} className="text-bronze" />
                                                                            {category.label}
                                                                        </h5>
                                                                        <div className="space-y-2">
                                                                            {category.items.map((item, idy) => {
                                                                                if (!isServiceActive(item)) return null;
                                                                                const slug = getServiceSlug(item);
                                                                                return (
                                                                                    <Link
                                                                                        key={idy}
                                                                                        to={slug ? `/services/${slug}` : `/services/apply?name=${encodeURIComponent(item)}`}
                                                                                        className="block text-xs text-slate-500 hover:text-bronze transition-colors py-1"
                                                                                    >
                                                                                        {item}
                                                                                    </Link>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            {/* Mobile Menu (Enhanced) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-[60] bg-white flex flex-col lg:hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <span className="text-xl font-black text-navy tracking-tight">Menu</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 -mr-2 text-slate-400 hover:text-navy hover:bg-slate-50 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-slate-50">
                            <div className="p-5 space-y-6">
                                {/* Mobile Search */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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
                                                    setSearchResults(results.slice(0, 5));
                                                } else {
                                                    setSearchResults([]);
                                                }
                                            }}
                                            placeholder="Find a service..."
                                            className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-sm font-medium focus:border-bronze focus:ring-4 focus:ring-bronze/10 outline-none transition-all shadow-sm"
                                        />
                                        {/* Mobile Search Results */}
                                        {searchResults.length > 0 && searchQuery && (
                                            <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
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
                                                                setMobileMenuOpen(false);
                                                            }}
                                                            className="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-navy">{res.name}</span>
                                                                <span className="text-[10px] uppercase text-slate-400 font-bold">{res.category}</span>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Auth Buttons */}
                                {!isLoggedIn ? (
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-center h-12 rounded-xl bg-white border border-slate-200 text-navy font-bold text-sm shadow-sm hover:border-bronze transition-all"
                                        >
                                            LOGIN
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-center h-12 rounded-xl bg-gradient-to-r from-bronze to-yellow-600 text-white font-bold text-sm shadow-lg shadow-bronze/20 transition-all hover:shadow-bronze/30 hover:-translate-y-0.5"
                                        >
                                            SIGN UP
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-bold text-lg">
                                                {user?.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-navy">{user?.fullName}</p>
                                                <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                to={user?.role?.includes('ADMIN') ? "/admin-dashboard" : (user?.role === 'AGENT' ? "/agent-dashboard" : "/dashboard")}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center justify-center h-10 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-navy hover:bg-slate-100 transition-colors"
                                            >
                                                DASHBOARD
                                            </Link>
                                            <button
                                                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                                                className="flex items-center justify-center h-10 rounded-lg bg-red-50 border border-red-100 text-xs font-bold text-red-500 hover:bg-red-100 transition-colors"
                                            >
                                                LOGOUT
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Services Accordion */}
                                <div className="space-y-4 pt-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Our Services</label>
                                    <div className="space-y-2">
                                        {categories.map((catKey) => {
                                            const category = SERVICE_DATA[catKey];
                                            if (!category) return null;
                                            const isOpen = expandedMobileCat === catKey;

                                            return (
                                                <div key={catKey} className={`rounded-xl border transition-all duration-200 ${isOpen ? 'bg-white border-bronze/30 shadow-md' : 'bg-white border-slate-200 shadow-sm'}`}>
                                                    <button
                                                        onClick={() => setExpandedMobileCat(isOpen ? null : catKey)}
                                                        className="w-full flex items-center justify-between p-4"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${isOpen ? 'bg-bronze/10 text-bronze' : 'bg-slate-50 text-slate-400'}`}>
                                                                <category.icon size={18} />
                                                            </div>
                                                            <span className={`text-sm font-bold uppercase tracking-wide ${isOpen ? 'text-navy' : 'text-slate-600'}`}>{navLabels[catKey]}</span>
                                                        </div>
                                                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-bronze' : ''}`} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-4 pb-4 space-y-1">
                                                                    <div className="h-px w-full bg-slate-100 mb-3"></div>
                                                                    {category.items.map((item, idy) => {
                                                                        if (!isServiceActive(item)) return null;
                                                                        const slug = getServiceSlug(item);
                                                                        return (
                                                                            <Link
                                                                                key={idy}
                                                                                to={slug ? `/services/${slug}` : `/services/apply?name=${encodeURIComponent(item)}`}
                                                                                onClick={() => setMobileMenuOpen(false)}
                                                                                className="block py-2 text-sm text-slate-500 hover:text-bronze font-medium pl-11 relative"
                                                                            >
                                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                                                                {item}
                                                                            </Link>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Bottom Links */}
                                <div className="space-y-1 pt-4 pb-8 border-t border-slate-100">
                                    <Link to="/about-us" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-navy hover:bg-slate-50 rounded-lg">ABOUT SHINEFILING</Link>
                                    <Link to="/contact-us" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-navy hover:bg-slate-50 rounded-lg">CONTACT US</Link>
                                    <Link to="/careers" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-navy hover:bg-slate-50 rounded-lg">CAREERS</Link>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
