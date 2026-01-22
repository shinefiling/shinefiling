import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Facebook, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { SERVICE_DATA } from '../data/services';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // Helper to get slug (Duplicate of Navbar logic to ensure independence)
    const getServiceSlug = (name) => {
        const normalize = (str) =>
            str.toLowerCase().replace(/[^a-z0-9]/g, '');

        const map = {
            "privatelimitedcompanyregistration": "business-registration/private-limited-company", // Corrected manual mapping for safety
            "privatecompany": "business-registration/private-limited-company",
            "onepersoncompanyopcregistration": "business-registration/one-person-company",
            "limitedliabilitypartnershipllpregistration": "business-registration/llp-registration",
            "partnershipfirmregistration": "business-registration/partnership-firm",
            "soleproprietorshipregistration": "business-registration/sole-proprietorship",
            "section8ngocompanyregistration": "business-registration/section-8-company",
            "nidhicompanyregistration": "business-registration/nidhi-company-registration",
            "producercompanyregistration": "business-registration/producer-company-registration",
            "publiclimitedcompanyregistration": "business-registration/public-limited-company",
            "indiansubsidiaryregistration": "business-registration/indian-subsidiary-registration",
            "foreigncompanyregistrationindia": "business-registration/foreign-company-registration",
            "startupincorporationadvisory": "business-registration/startup-incorporation-advisory",

            "gstregistration": "tax-compliance/gst-registration",
            "gstamendmentcorrection": "tax-compliance/gst-amendment",
            "gstmonthlyreturngstr1": "gst-return/gstr-1",
            "gstmonthlyreturngstr3b": "gst-return/gstr-3b",
            "gstannualreturngstr9": "tax_compliance/gst-annual-return",
            "gstauditgstr9c": "tax-compliance/gst-audit",
            "gstcancellation": "tax-compliance/gst-cancellation",
            "gstcancellationbusinessclosure": "tax-compliance/gst-cancellation",

            "incometaxreturnitr1": "income-tax/itr-1",
            "incometaxreturnitr2": "income-tax/itr-2",
            "incometaxreturnitr3": "income-tax/itr-3",
            "incometaxreturnitr4": "income-tax/itr-4",
            "incometaxreturnitr567": "income-tax/itr-5-6-7",

            "tdsreturnfiling": "tax-compliance/tds-return-filing",
            "professionaltaxregreturn": "tax-compliance/professional-tax",
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
            // "professionaltaxregreturn": "labour/professional-tax-registration", // Removed duplicate
            // "professionaltaxregistration": "labour/professional-tax-registration", 
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
        // Fallback for direct matches if exact key isn't found but mapped vaguely
        return map[key] || "services/apply";
    };

    // Organized Columns Logic
    const columns = [
        {
            title: "Start Business",
            items: [...SERVICE_DATA.business_reg.items, ...SERVICE_DATA.closure.items]
        },
        {
            title: "Tax & Compliance",
            items: [...SERVICE_DATA.tax_compliance.items, ...SERVICE_DATA.roc_compliance.items, ...SERVICE_DATA.financial.items]
        },
        {
            title: "Licenses & IP",
            items: [...SERVICE_DATA.licenses.items, ...SERVICE_DATA.ipr.items, ...SERVICE_DATA.certifications.items]
        },
        {
            title: "Legal & HR",
            items: [...SERVICE_DATA.legal.items, ...SERVICE_DATA.labour_hr.items, ...SERVICE_DATA.legal_notices.items, ...SERVICE_DATA.corrections.items]
        }
    ];

    return (
        <footer className="bg-navy pt-20 pb-10 text-white border-t border-navy-light font-sans">
            <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-8 text-sm mb-16">

                {/* BRAND COLUMN (Span 2/12) */}
                <div className="xl:col-span-2 space-y-6">
                    <Link to="/" className="flex items-center gap-0.5 mb-6 group">
                        <img src="/logo.png" alt="ShineFiling" className="h-10 w-auto object-contain" />
                        <span className="text-2xl font-black tracking-tighter text-white leading-none mt-1">
                            hine<span className="text-[#B58863]">Filing</span>
                        </span>
                    </Link>
                    <p className="text-slate-400 leading-relaxed mb-6 text-xs font-light">
                        India's most trusted AI-Powered Legal & Financial Compliance Platform.
                    </p>
                    <div className="flex gap-3 text-slate-400">
                        {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                            <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-bronze hover:text-white transition-all">
                                <Icon size={14} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* DYNAMIC COLUMNS (Span 10/12) */}
                <div className="xl:col-span-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {columns.map((col, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            <h4 className="text-bronze font-bold tracking-widest uppercase text-xs border-b border-white/10 pb-2 mb-2">{col.title}</h4>
                            <ul className="space-y-2 text-slate-400 font-light text-xs">
                                {col.items.slice(0, 15).map((item, i) => { // Limit to 15 per column to keep it "neat"
                                    const slug = getServiceSlug(item);
                                    const linkTo = slug.startsWith('http') ? slug : `/services/${slug}`;
                                    return (
                                        <li key={i}>
                                            <FooterLink to={linkTo} label={item} />
                                        </li>
                                    );
                                })}
                                {col.items.length > 15 && (
                                    <li>
                                        <Link to="/services" className="text-bronze hover:underline text-xs font-bold italic flex items-center gap-1">
                                            View {col.items.length - 15} more <ChevronRight size={10} />
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-[1600px] mx-auto px-6 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium">
                <p>&copy; {currentYear} ShineFiling India Private Limited. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link to="/terms" className="hover:text-bronze transition-colors">Terms of Service</Link>
                    <Link to="/privacy" className="hover:text-bronze transition-colors">Privacy Policy</Link>
                    <Link to="/refund" className="hover:text-bronze transition-colors">Refund Policy</Link>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, label }) => (
    <Link to={to} className="hover:text-white transition-colors flex items-start gap-2 group leading-tight">
        <span className="w-1 h-1 rounded-full bg-bronze mt-1.5 opacity-50 group-hover:opacity-100 transition-all flex-shrink-0"></span>
        <span className="group-hover:translate-x-0.5 transition-transform duration-200">{label}</span>
    </Link>
);

export default Footer;
