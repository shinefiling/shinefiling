import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Facebook, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-navy pt-24 pb-12 text-white border-t border-navy-light font-sans">
            <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 text-sm mb-20">
                {/* Column 1: Brand & Contact */}
                <div className="lg:col-span-2 space-y-8 pr-8">
                    <div>
                        <Link to="/" className="flex items-center gap-0.5 mb-6 group">
                            <img
                                src="/logo.png"
                                alt="ShineFiling"
                                className="h-12 w-auto object-contain"
                            />
                            <span className="text-3xl font-black tracking-tighter text-white leading-none mt-1">
                                hine<span className="text-[#B58863]">Filing</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 max-w-sm leading-relaxed mb-8 text-base font-light">
                            India's most trusted AI-Powered Legal & Financial Compliance Platform. We simplify business for thousands of entrepreneurs.
                        </p>

                        <div className="flex gap-4">
                            {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                                <button key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-bronze hover:text-white transition-all text-slate-400">
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-5 pt-8 border-t border-white/5">
                        <div className="flex items-start gap-4 text-slate-300">
                            <MapPin size={20} className="text-bronze mt-1 flex-shrink-0" />
                            <span className="font-light">123, Tech Plaza, Cyber City,<br />Gurugram, India 122002</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-300">
                            <Phone size={20} className="text-bronze flex-shrink-0" />
                            <span className="font-light">+91 8489529876</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-300">
                            <Mail size={20} className="text-bronze flex-shrink-0" />
                            <span className="font-light">support@shinefiling.com</span>
                        </div>
                    </div>
                </div>

                {/* Column 2: Start Business */}
                <div>
                    <h4 className="text-bronze font-bold mb-6 tracking-widest uppercase text-xs">Start Business</h4>
                    <ul className="space-y-4 text-slate-300 font-light">
                        <li><Link to="/services/private-limited-company" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Pvt Ltd Company</Link></li>
                        <li><Link to="/services/llp-registration" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> LLP Registration</Link></li>
                        <li><Link to="/services/one-person-company" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> One Person Co (OPC)</Link></li>
                        <li><Link to="/services/partnership-firm" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Partnership Firm</Link></li>
                        <li><Link to="/services/section-8-company" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Section 8 NGO</Link></li>
                        <li><Link to="/services/nidhi-company-registration" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Nidhi Company</Link></li>
                    </ul>
                </div>

                {/* Column 3: IPR & Licenses */}
                <div>
                    <h4 className="text-bronze font-bold mb-6 tracking-widest uppercase text-xs">IPR & Licenses</h4>
                    <ul className="space-y-4 text-slate-300 font-light">
                        <li><Link to="/services/intellectual-property/trademark-registration" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Trademark Reg</Link></li>
                        <li><Link to="/services/intellectual-property/copyright-registration" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Copyright Filing</Link></li>
                        <li><Link to="/services/intellectual-property/patent-filing" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Patent Filing</Link></li>
                        <li><Link to="/services/business-certifications/iso-certification" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> ISO Certification</Link></li>
                        <li><Link to="/services/licenses/fssai-license" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> FSSAI Food Lic</Link></li>
                        <li><Link to="/services/licenses/import-export-code" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Import Export Code</Link></li>
                    </ul>
                </div>

                {/* Column 4: Tax & Compliance */}
                <div>
                    <h4 className="text-bronze font-bold mb-6 tracking-widest uppercase text-xs">Tax & Compliance</h4>
                    <ul className="space-y-4 text-slate-300 font-light">
                        <li><Link to="/services/gst-registration" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> GST Registration</Link></li>
                        <li><Link to="/services/tax-compliance/gst-monthly-return" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> GST Returns</Link></li>
                        <li><Link to="/services/tax-compliance/income-tax-return" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Income Tax (ITR)</Link></li>
                        <li><Link to="/services/tax-compliance/tds-return-filing" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> TDS Return</Link></li>
                        <li><Link to="/services/roc-filing/annual-return" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> ROC Annual Filing</Link></li>
                        <li><Link to="/services/tax-compliance/professional-tax" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Professional Tax</Link></li>
                    </ul>
                </div>

                {/* Column 5: Legal & Citizen */}
                <div>
                    <h4 className="text-bronze font-bold mb-6 tracking-widest uppercase text-xs">Legal Services</h4>
                    <ul className="space-y-4 text-slate-300 font-light">
                        <li><Link to="/services/rent-agreement" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Rent Agreement</Link></li>
                        <li><Link to="/services/legal-drafting/nda" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> NDA Drafting</Link></li>
                        <li><Link to="/services/legal-drafting/founders-agreement" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Founder Agreement</Link></li>
                        <li><Link to="/services/legal-drafting/partnership-deed" className="hover:text-bronze transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-bronze rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Partnership Deed</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium">
                <p>© 2025 ShineFiling India Private Limited. All rights reserved.</p>
                <div className="flex gap-8 mt-4 md:mt-0">
                    <Link to="/terms" className="hover:text-bronze transition-colors">Terms of Service</Link>
                    <Link to="/privacy" className="hover:text-bronze transition-colors">Privacy Policy</Link>
                    <Link to="/sitemap" className="hover:text-bronze transition-colors">Sitemap</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
