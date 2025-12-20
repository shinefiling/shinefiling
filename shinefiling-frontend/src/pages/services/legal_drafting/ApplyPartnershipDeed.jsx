import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { submitPartnershipDeed } from '../../../api';
import { ArrowLeft, Upload, CheckCircle, Loader } from 'lucide-react';

const ApplyPartnershipDeed = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        userCategory: 'Individual', // Default
        firmName: '',
        businessAddress: '',
        businessNature: '',
        partner1Name: '',
        partner1Address: '',
        partner2Name: '',
        partner2Address: '',
        capitalContribution: '',
        profitSharingRatio: '',
        email: '',
        mobile: ''
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setFormData(prev => ({ ...prev, email: user.email, mobile: user.mobile || '' }));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        // Mock file upload for now, just store name
        if (e.target.files[0]) {
            setFormData({ ...formData, [e.target.name]: `File: ${e.target.files[0].name}` });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await submitPartnershipDeed(formData);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar isLoggedIn={true} />
            <div className="pt-32 px-6 max-w-4xl mx-auto">
                <button onClick={() => navigate('/services/partnership-deed')} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Partnership Deed Application</h1>
                    <p className="text-gray-600 mb-8">Please provide the details for drafting your Partnership Deed.</p>

                    {success ? (
                        <div className="text-center py-12">
                            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                            <p className="text-gray-600">You can track the status in your dashboard.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Firm Name</label>
                                    <input type="text" name="firmName" value={formData.firmName} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nature of Business</label>
                                    <input type="text" name="businessNature" value={formData.businessNature} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. Retail, Consulting" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Business Address</label>
                                <textarea name="businessAddress" value={formData.businessAddress} onChange={handleChange} required rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none"></textarea>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Partner Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Partner 1 Name</label>
                                        <input type="text" name="partner1Name" value={formData.partner1Name} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Partner 1 Address</label>
                                        <input type="text" name="partner1Address" value={formData.partner1Address} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Partner 2 Name</label>
                                        <input type="text" name="partner2Name" value={formData.partner2Name} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Partner 2 Address</label>
                                        <input type="text" name="partner2Address" value={formData.partner2Address} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Financial Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Capital Contribution (₹)</label>
                                        <input type="number" name="capitalContribution" value={formData.capitalContribution} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Profit Sharing Ratio</label>
                                        <input type="text" name="profitSharingRatio" value={formData.profitSharingRatio} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. 50:50 or 60:40" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition flex items-center justify-center shadow-lg">
                                {loading ? <Loader className="animate-spin" /> : 'Submit Application'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplyPartnershipDeed;
