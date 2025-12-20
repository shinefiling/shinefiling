import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { submitFinancialService } from '../../../api';
import { ArrowLeft, CheckCircle, Loader } from 'lucide-react';

const ApplyBusinessValuation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        service: 'business-valuation',
        companyName: '',
        valuationPurpose: 'Investment',
        assetsValue: '',
        lastTurnover: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await submitFinancialService('business-valuation', formData);
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
                <button onClick={() => navigate('/services/financial-services/business-valuation')} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Business Valuation</h1>
                    <p className="text-gray-600 mb-8">Get a certified valuation report for your business.</p>

                    {success ? (
                        <div className="text-center py-12">
                            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
                            <p className="text-gray-600">Our valuation experts will contact you for details.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Valuation</label>
                                    <select name="valuationPurpose" value={formData.valuationPurpose} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none">
                                        <option value="Investment">Investment / Funding</option>
                                        <option value="ESOP">ESOP Granting</option>
                                        <option value="Merger">Merger & Acquisition</option>
                                        <option value="Regulatory">Regulatory / FEMA Compliance</option>
                                        <option value="Internal">Internal Assessment</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Assets Value</label>
                                    <input type="text" name="assetsValue" value={formData.assetsValue} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. 5 Cr" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Year Turnover</label>
                                    <input type="text" name="lastTurnover" value={formData.lastTurnover} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. 2 Cr" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition flex items-center justify-center shadow-lg">
                                {loading ? <Loader className="animate-spin" /> : 'Submit Request'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplyBusinessValuation;
