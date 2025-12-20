import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { submitFoundersAgreement } from '../../../api';
import { ArrowLeft, Loader, CheckCircle } from 'lucide-react';

const ApplyFoundersAgreement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        founderNames: '',
        businessDescription: '',
        equitySplit: '',
        vestingSchedule: '4 Years',
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
            await submitFoundersAgreement(formData);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) { setError(err.message || 'Failed'); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar isLoggedIn={true} />
            <div className="pt-32 px-6 max-w-4xl mx-auto">
                <button onClick={() => navigate('/services/founders-agreement')} className="flex items-center text-gray-500 mb-6"><ArrowLeft size={20} className="mr-2" /> Back</button>
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Founders Agreement Application</h1>
                    {success ? (
                        <div className="text-center py-12"><CheckCircle size={64} className="mx-auto text-green-500 mb-4" /><h2 className="text-2xl font-bold">Application Submitted!</h2></div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="text-red-500">{error}</div>}
                            <div className="grid grid-cols-1 gap-6">
                                <div><label className="block text-sm font-medium mb-2">Startup Name (Proposed)</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full border rounded-lg p-3" /></div>
                                <div><label className="block text-sm font-medium mb-2">Founder Names & Roles</label><textarea name="founderNames" value={formData.founderNames} onChange={handleChange} required rows="3" className="w-full border rounded-lg p-3" placeholder="e.g. John Doe (CEO), Jane Smith (CTO)"></textarea></div>
                                <div><label className="block text-sm font-medium mb-2">Business Description</label><textarea name="businessDescription" value={formData.businessDescription} onChange={handleChange} required rows="3" className="w-full border rounded-lg p-3" placeholder="Short description of the startup idea"></textarea></div>
                                <div><label className="block text-sm font-medium mb-2">Equity Split Details</label><textarea name="equitySplit" value={formData.equitySplit} onChange={handleChange} required rows="2" className="w-full border rounded-lg p-3" placeholder="e.g. John: 60%, Jane: 40%"></textarea></div>
                                <div><label className="block text-sm font-medium mb-2">Vesting Schedule</label>
                                    <select name="vestingSchedule" value={formData.vestingSchedule} onChange={handleChange} className="w-full border rounded-lg p-3">
                                        <option>No Vesting</option>
                                        <option>2 Years</option>
                                        <option>3 Years</option>
                                        <option>4 Years (Standard)</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition flex justify-center">{loading ? <Loader className="animate-spin" /> : 'Submit'}</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ApplyFoundersAgreement;
