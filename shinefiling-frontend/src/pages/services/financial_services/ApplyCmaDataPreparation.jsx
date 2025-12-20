import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { submitFinancialService } from '../../../api';
import { ArrowLeft, CheckCircle, Loader } from 'lucide-react';

const ApplyCmaDataPreparation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        service: 'cma-data-preparation',
        businessName: '',
        loanAmount: '',
        bankName: '',
        turnover: '',
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
            await submitFinancialService('cma-data-preparation', formData);
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
                <button onClick={() => navigate('/services/financial-services/cma-data-preparation')} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for CMA Data Preparation</h1>
                    <p className="text-gray-600 mb-8">Provide details for your Credit Monitoring Arrangement report.</p>

                    {success ? (
                        <div className="text-center py-12">
                            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                            <p className="text-gray-600">Our financial experts will contact you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual Turnover (Approx)</label>
                                    <input type="text" name="turnover" value={formData.turnover} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. 50 Lakhs" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Loan Amount</label>
                                    <input type="text" name="loanAmount" value={formData.loanAmount} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. 1 Cr" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Bank Name</label>
                                    <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. SBI, HDFC" />
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

export default ApplyCmaDataPreparation;
