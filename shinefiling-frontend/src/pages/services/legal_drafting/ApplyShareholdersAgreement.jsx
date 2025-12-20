import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { submitShareholdersAgreement } from '../../../api';
import { ArrowLeft, Loader, CheckCircle } from 'lucide-react';

const ApplyShareholdersAgreement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        shareholderNames: '',
        shareCapitalDetails: '',
        email: '',
        mobile: ''
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setFormData(prev => ({ ...prev, email: user.email, mobile: user.mobile || '' }));
        } else { navigate('/login'); }
    }, [navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitShareholdersAgreement(formData);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) { setError(err.message || 'Failed'); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar isLoggedIn={true} />
            <div className="pt-32 px-6 max-w-4xl mx-auto">
                <button onClick={() => navigate('/services/shareholders-agreement')} className="flex items-center text-gray-500 mb-6"><ArrowLeft size={20} className="mr-2" /> Back</button>
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Shareholders Agreement Application</h1>
                    {success ? (
                        <div className="text-center py-12"><CheckCircle size={64} className="mx-auto text-green-500 mb-4" /><h2 className="text-2xl font-bold">Application Submitted!</h2></div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="text-red-500">{error}</div>}
                            <div><label className="block text-sm font-medium mb-2">Company Name</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full border rounded-lg p-3" /></div>
                            <div><label className="block text-sm font-medium mb-2">Shareholder Names (Separate by comma)</label><textarea name="shareholderNames" value={formData.shareholderNames} onChange={handleChange} required rows="3" className="w-full border rounded-lg p-3" placeholder="e.g. John Doe, Jane Smith"></textarea></div>
                            <div><label className="block text-sm font-medium mb-2">Share Capital Details (Authorized/Paid-up)</label><textarea name="shareCapitalDetails" value={formData.shareCapitalDetails} onChange={handleChange} required rows="3" className="w-full border rounded-lg p-3" placeholder="e.g. Authorized Capital: 10 Lakhs, Paid-up: 1 Lakh"></textarea></div>
                            <button type="submit" disabled={loading} className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition flex justify-center">{loading ? <Loader className="animate-spin" /> : 'Submit'}</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ApplyShareholdersAgreement;
