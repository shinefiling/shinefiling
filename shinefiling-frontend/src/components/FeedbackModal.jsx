import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { submitTestimonial } from '../api';

const FeedbackModal = ({ order, onClose, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!feedback.trim()) {
            alert('Please provide your feedback');
            return;
        }

        setSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await submitTestimonial({
                orderId: order.id,
                customerName: user.fullName || 'Anonymous',
                customerEmail: user.email,
                serviceName: order.serviceName,
                rating: rating,
                feedback: feedback.trim()
            });

            alert('Thank you for your feedback!');
            if (onSubmit) onSubmit();
            onClose();
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#10232A]/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-600"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[#10232A] mb-2">Share Your Experience</h3>
                    <p className="text-sm text-[#3D4D55]">
                        How was your experience with <span className="font-bold">{order.serviceName}</span>?
                    </p>
                </div>

                {/* Rating */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-[#10232A] mb-3">Rate your experience</label>
                    <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={32}
                                    className={star <= rating ? 'text-[#B58863] fill-[#B58863]' : 'text-slate-300'}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feedback Text */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-[#10232A] mb-2">Your Feedback</label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Tell us about your experience..."
                        className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#B58863] focus:ring-2 focus:ring-[#B58863]/20 resize-none text-sm"
                        maxLength={500}
                    />
                    <p className="text-xs text-slate-400 mt-1 text-right">{feedback.length}/500</p>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting || !feedback.trim()}
                    className="w-full bg-[#B58863] hover:bg-[#A57753] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    {submitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={18} /> Submit Feedback
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FeedbackModal;
