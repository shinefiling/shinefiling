
import {
    User, Landmark, Briefcase, Shield, FileText, Database,
    Truck, Lock, Zap, GraduationCap, Building, Stamp, Award, Scale, Coins
} from 'lucide-react';

export const SERVICE_DATA = {
    business_reg: {
        id: 'business_reg',
        label: 'Business Registration',
        icon: Building,
        color: 'indigo', // Professional Indigo
        colorHex: '#6366f1',
        items: [
            'Private Limited Company Registration', 'One Person Company (OPC)',
            'Limited Liability Partnership (LLP)', 'Partnership Firm Registration',
            'Sole Proprietorship Registration', 'Section 8 NGO Company',
            'Nidhi Company Registration', 'Producer Company Registration',
            'Public Limited Company'
        ]
    },
    tax_compliance: {
        id: 'tax_compliance',
        label: 'Tax & Compliance',
        icon: Coins,
        color: 'emerald', // Trustworthy Green
        colorHex: '#10b981',
        items: [
            'GST Registration', 'GST Monthly Return (GSTR-1 & 3B)', 'GST Annual Return (GSTR-9)',
            'Income Tax Return (ITR 1–7)', 'TDS Return Filing', 'Professional Tax Reg & Filing',
            'Advance Tax Filing', 'Tax Audit Filing'
        ]
    },
    roc_compliance: {
        id: 'roc_compliance',
        label: 'ROC / MCA Filings',
        icon: Briefcase,
        color: 'blue', // Corporate Blue
        colorHex: '#3b82f6',
        items: [
            'Annual ROC Filing (AOC-4, MGT-7)', 'Director KYC (DIR-3 KYC)', 'Add/Remove Director',
            'Change of Registered Office', 'Share Transfer Filing', 'Increase Authorized Capital',
            'MOA/AOA Amendment', 'Company Name Change', 'Strike Off Company'
        ]
    },
    licenses: {
        id: 'licenses',
        label: 'Government Licenses',
        icon: Landmark,
        color: 'orange', // Warning/Alert Orange for Licenses
        colorHex: '#f97316',
        items: [
            'FSSAI License (Basic/State/Central)', 'Shop & Establishment License', 'Trade License',
            'Labour License', 'Factory License', 'Drug License', 'Fire Safety NOC',
            'Pollution Control (CTE/CTO)', 'Import Export Code (IEC)', 'Gumastha License',
            'Bar / Liquor License'
        ]
    },
    ipr: {
        id: 'ipr',
        label: 'Intellectual Property',
        icon: Shield,
        color: 'violet', // Premium Violet
        colorHex: '#8b5cf6',
        items: [
            'Trademark Registration', 'Trademark Objection Reply', 'Trademark Hearing Support',
            'Trademark Assignment', 'Trademark Renewal', 'Copyright Registration',
            'Patent Filing (Provisional/Complete)', 'Design Registration'
        ]
    },
    labour_hr: {
        id: 'labour_hr',
        label: 'Labour Law & HR',
        icon: User,
        color: 'cyan', // Calm Cyan
        colorHex: '#06b6d4',
        items: [
            'PF Registration & Filing', 'ESI Registration & Filing', 'Professional Tax Reg & Return',
            'Labour Welfare Fund Filing', 'Gratuity Act Registration', 'Bonus Act Compliance',
            'Minimum Wages Compliance'
        ]
    },
    certifications: {
        id: 'certifications',
        label: 'Business Certifications',
        icon: Award,
        color: 'amber', // Gold/Amber for Awards/Certs
        colorHex: '#f59e0b',
        items: [
            'MSME / Udyam Registration', 'ISO Certification (9001, 14001)', 'Startup India Recognition',
            'Digital Signature (DSC)', 'Bar Code Registration', 'TAN / PAN Application'
        ]
    },
    legal: {
        id: 'legal',
        label: 'Legal Drafting',
        icon: Scale,
        color: 'rose', // Serious Rose/Red for Legal
        colorHex: '#f43f5e',
        items: [
            'Partnership Deed', 'Founders Agreement', 'Shareholders Agreement', 'Employment Agreement',
            'Rent Agreement', 'Franchise Agreement', 'NDA (Non-Disclosure)', 'Vendor Agreement'
        ]
    },
    financial: {
        id: 'financial',
        label: 'Financial Services',
        icon: FileText,
        color: 'teal', // Financial Teal
        colorHex: '#14b8a6',
        items: [
            'CMA Data Preparation', 'Project Report for Loans', 'Bank Loan Documentation',
            'Cash Flow Compliance', 'Startup Pitch Deck', 'Business Valuation Reports'
        ]
    },
    storage: {
        id: 'storage',
        label: 'Mini DigiLocker',
        icon: Database,
        color: 'yellow',
        colorHex: '#eab308',
        items: [
            'Store PAN Card', 'Store Aadhaar Card', 'Store Rent Agreement', 'Store GST Cert',
            'Store FSSAI Cert', 'Business Doc Vault', 'Secure PDF Download'
        ]
    }
};
