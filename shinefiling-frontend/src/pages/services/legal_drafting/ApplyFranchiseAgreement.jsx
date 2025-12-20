import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { submitFranchiseAgreement } from '../../../api';
import { ArrowLeft, Loader, CheckCircle } from 'lucide-react';

const ApplyFranchiseAgreement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        franchisorName: '',
        franchiseeName: '',
        franchiseFee: '',
        royalty: '',
        territory: '',
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
            await submitFranchiseAgreement(formData);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) { setError(err.message || 'Failed'); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar isLoggedIn={true} />
            <div className="pt-32 px-6 max-w-4xl mx-auto">
                <button onClick={() => navigate('/services/franchise-agreement')} className="flex items-center text-gray-500 mb-6"><ArrowLeft size={20} className="mr-2" /> Back</button>
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Franchise Agreement Application</h1>
                    {success ? (
                        <div className="text-center py-12"><CheckCircle size={64} className="mx-auto text-green-500 mb-4" /><h2 className="text-2xl font-bold">Application Submitted!</h2></div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="text-red-500">{error}</div>}
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-sm font-medium mb-2">Franchisor Name (Brand)</label><input type="text" name="franchisorName" value={formData.franchisorName} onChange={handleChange} required className="w-full border rounded-lg p-3" /></div>
                                <div><label className="block text-sm font-medium mb-2">Franchisee Name (Applicant)</label><input type="text" name="franchiseeName" value={formData.franchiseeName} onChange={handleChange} required className="w-full border rounded-lg p-3" /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div><label className="block text-sm font-medium mb-2">Franchise Fee (₹)</label><input type="number" name="franchiseFee" value={formData.franchiseFee} onChange={handleChange} required className="w-full border rounded-lg p-3" /></div>
                                <div><label className="block text-sm font-medium mb-2">Royalty (%)</label><input type="text" name="royalty" value={formData.royalty} onChange={handleChange} required className="w-full border rounded-lg p-3" /></div>
                                <div><label className="block text-sm font-medium mb-2">Territory/Location</label><input type="text" name="territory" value={formData.territory} onChange={handleChange} required className="w-full border rounded-lg p-3" /></div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-rose-700 text-white font-bold py-4 rounded-xl hover:bg-rose-800 transition flex justify-center">{loading ? <Loader className="animate-spin" /> : 'Submit'}</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ApplyFranchiseAgreement;
