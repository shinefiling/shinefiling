import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Plus, Trash2, Save, X } from 'lucide-react';

const CareersControl = () => {
    const [jobs, setJobs] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        location: 'Remote',
        type: 'Full-time',
        description: '',
        department: 'Engineering'
    });

    // Load jobs on mount
    useEffect(() => {
        const storedJobs = localStorage.getItem('careers_jobs');
        if (storedJobs) {
            setJobs(JSON.parse(storedJobs));
        } else {
            // Default initial jobs
            const initialJobs = [
                {
                    id: 1,
                    title: "Senior Legal Consultant",
                    location: "New Delhi (Hybrid)",
                    type: "Full-time",
                    description: "We are looking for an experienced Legal Consultant to handle corporate compliance and regulatory pilings.",
                    department: "Legal"
                },
                {
                    id: 2,
                    title: "Frontend Developer",
                    location: "Remote",
                    type: "Content",
                    description: "Join our tech team to build the next generation of legal-tech platforms using React and TailwindCSS.",
                    department: "Tech"
                }
            ];
            setJobs(initialJobs);
            localStorage.setItem('careers_jobs', JSON.stringify(initialJobs));
        }
    }, []);

    // Save jobs whenever they change
    const saveJobs = (updatedJobs) => {
        setJobs(updatedJobs);
        localStorage.setItem('careers_jobs', JSON.stringify(updatedJobs));
    };

    const handleAddJob = (e) => {
        e.preventDefault();
        const job = {
            id: Date.now(),
            ...newJob,
            postedAt: new Date().toLocaleDateString()
        };
        const updated = [job, ...jobs];
        saveJobs(updated);
        setIsAdding(false);
        setNewJob({ title: '', location: 'Remote', type: 'Full-time', description: '', department: 'Engineering' });
    };

    const handleDeleteJob = (id) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            const updated = jobs.filter(j => j.id !== id);
            saveJobs(updated);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#10232A]">Careers & Hiring</h2>
                    <p className="text-[#3D4D55] text-sm">Manage job openings and valid applications.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#10232A] text-white rounded-lg font-bold hover:bg-[#B58863] transition-colors shadow-lg shadow-[#10232A]/20"
                >
                    <Plus size={18} /> Post New Job
                </button>
            </div>

            {/* Visual Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-[#3D4D55] font-bold uppercase">Active Openings</p>
                        <h3 className="text-2xl font-black text-[#10232A]">{jobs.length}</h3>
                    </div>
                    <div className="p-3 bg-[#FDFBF7] text-[#B58863] rounded-lg border border-[#B58863]/20"><Briefcase size={24} /></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-[#3D4D55] font-bold uppercase">Total Applications</p>
                        <h3 className="text-2xl font-black text-[#10232A]">124</h3>
                    </div>
                    <div className="p-3 bg-[#FDFBF7] text-[#B58863] rounded-lg border border-[#B58863]/20"><Briefcase size={24} /></div>
                </div>
            </div>

            {/* Add Job Modal/Form */}
            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-[#10232A]">Post New Job</h3>
                        <button onClick={() => setIsAdding(false)} className="text-[#3D4D55] hover:text-[#10232A]"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleAddJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-[#3D4D55] mb-1">Job Title</label>
                            <input
                                required
                                type="text"
                                value={newJob.title}
                                onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                                className="w-full p-2 border border-[#B58863]/20 rounded-lg focus:ring-2 focus:ring-[#B58863]/20 focus:border-[#B58863] outline-none text-sm text-[#10232A]"
                                placeholder="e.g. Legal Associate"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#3D4D55] mb-1">Department</label>
                            <select
                                value={newJob.department}
                                onChange={e => setNewJob({ ...newJob, department: e.target.value })}
                                className="w-full p-2 border border-[#B58863]/20 rounded-lg focus:ring-2 focus:ring-[#B58863]/20 focus:border-[#B58863] outline-none text-sm font-bold text-[#10232A]"
                            >
                                <option>Legal</option>
                                <option>Tech</option>
                                <option>Sales</option>
                                <option>Marketing</option>
                                <option>Operations</option>
                                <option>Finance</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#3D4D55] mb-1">Location</label>
                            <input
                                type="text"
                                value={newJob.location}
                                onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                className="w-full p-2 border border-[#B58863]/20 rounded-lg focus:ring-2 focus:ring-[#B58863]/20 focus:border-[#B58863] outline-none text-sm text-[#10232A]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#3D4D55] mb-1">Job Type</label>
                            <select
                                value={newJob.type}
                                onChange={e => setNewJob({ ...newJob, type: e.target.value })}
                                className="w-full p-2 border border-[#B58863]/20 rounded-lg focus:ring-2 focus:ring-[#B58863]/20 focus:border-[#B58863] outline-none text-sm font-bold text-[#10232A]"
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Internship</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-[#3D4D55] mb-1">Description</label>
                            <textarea
                                required
                                value={newJob.description}
                                onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                                className="w-full p-2 border border-[#B58863]/20 rounded-lg focus:ring-2 focus:ring-[#B58863]/20 focus:border-[#B58863] outline-none text-sm h-24 resize-none text-[#10232A]"
                                placeholder="Brief description of the role..."
                            />
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-bold text-[#3D4D55] hover:bg-[#FDFBF7] rounded-lg transition">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-[#10232A] hover:bg-[#B58863] rounded-lg shadow-lg shadow-[#10232A]/20 transition">Post Job</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Job List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-[#10232A]">Current Job Openings</h3>
                    <span className="text-xs font-bold text-gray-400 uppercase">Live on Website</span>
                </div>
                {jobs.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <Briefcase size={48} className="mx-auto mb-2 opacity-20" />
                        <p>No active job postings.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {jobs.map((job) => (
                            <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center group">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-[#10232A]">{job.title}</h4>
                                        <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{job.department}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                                        <span className="flex items-center gap-1">• {job.type}</span>
                                        <span className="flex items-center gap-1">• Posted: {job.postedAt || 'Recently'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Job"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareersControl;
