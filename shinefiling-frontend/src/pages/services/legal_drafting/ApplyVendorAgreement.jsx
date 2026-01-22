import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { submitVendorAgreement } from '../../../api';
import { uploadFile } from '../../../utils/uploadFile';
import { ArrowLeft, Loader, CheckCircle, Upload } from 'lucide-react';

const ApplyVendorAgreement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        vendorName: '',
        serviceDescription: '',
        paymentTerms: '',
        email: '',
        mobile: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setFormData(prev => ({ ...prev, email: user.email, mobile: user.mobile || '' }));
        } else { navigate('/login'); }
    }, [navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const finalPayload = {
                submissionId: `VENDOR-${Date.now()}`,
                userEmail: formData.email,
                plan: "standard",
                amountPaid: 1499,
                status: "INITIATED",
                formData: formData,
                documents: [],
                automationQueue: []
            };

            const uploadedDocs = [];
            for (const file of selectedFiles) {
                const url = await uploadFile(file);
                uploadedDocs.push({
                    documentType: "User Upload",
                    fileName: file.name,
                    fileUrl: url
                });
            }
            finalPayload.documents = uploadedDocs;

            await submitVendorAgreement(finalPayload);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard?tab=orders'), 2000);
        } catch (err) { setError(err.message || 'Failed'); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar isLoggedIn={true} />
            <div className="pt-32 px-6 max-w-4xl mx-auto">
                <button onClick={() => navigate('/services/vendor-agreement')} className="flex items-center text-gray-500 mb-6"><ArrowLeft size={20} className="mr-2" /> Back</button>
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Vendor Agreement Application</h1>
                    {success ? (
                        <div className="text-center py-12"><CheckCircle size={64} className="mx-auto text-green-500 mb-4" /><h2 className="text-2xl font-bold">Application Submitted!</h2></div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="text-red-500">{error}</div>}
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-sm font-medium mb-2">Company Name (Client)</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full border rounded-lg p-3" /></div>
                                <div><label className="block text-sm font-medium mb-2">Vendor/Supplier Name</label><input type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} required className="w-full border rounded-lg p-3" /></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-2">Service Description / Products Supply</label><textarea name="serviceDescription" value={formData.serviceDescription} onChange={handleChange} required rows="3" className="w-full border rounded-lg p-3"></textarea></div>
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-sm font-medium mb-2">Payment Terms (e.g. Net 30)</label><input type="text" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} required className="w-full border rounded-lg p-3" /></div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Upload Documents (Optional)</h3>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                    <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                    <p className="text-sm text-gray-600 font-medium">Click to upload drafts or notes</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG allowed</p>
                                    {selectedFiles.length > 0 && (
                                        <div className="mt-4 text-left">
                                            <p className="text-sm font-bold text-green-600 mb-2">Selected Files:</p>
                                            <ul className="text-xs text-gray-600 space-y-1">
                                                {selectedFiles.map((f, i) => <li key={i} className="flex items-center gap-1"><CheckCircle size={10} /> {f.name}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-emerald-700 text-white font-bold py-4 rounded-xl hover:bg-emerald-800 transition flex justify-center">{loading ? <Loader className="animate-spin" /> : 'Submit'}</button>
                        </form>
                    )}
                </div>
            </div>
        </div >
    );
};
export default ApplyVendorAgreement;
