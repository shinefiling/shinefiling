import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, AlertTriangle, Calendar as CalendarIcon, ArrowRight, Loader2 } from 'lucide-react';
import { getUserApplications } from '../../api';

// --- Calendar Helpers ---
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Mon=0 start
};

const ClientCompliance = () => {
    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Events Dynamic Logic
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.email) return;

                const applications = await getUserApplications(user.email);

                if (applications) {
                    const mappedEvents = applications.map(app => {
                        // Use createdAt or a mock due date
                        const dateObj = new Date(app.createdAt);
                        // Mock: Spread events out a bit for demo if all on same day, otherwise just use standard
                        // For real app: use 'dueDate' field if available
                        return {
                            id: app.id,
                            title: app.serviceName || 'Filing Due',
                            date: dateObj,
                            type: 'Compliance',
                            status: app.status,
                            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                    });

                    // Add some dummy future deadlines for visual population if list is small
                    if (mappedEvents.length < 3) {
                        const today = new Date();
                        mappedEvents.push(
                            { id: 'mock1', title: 'GSTR-1 Filing', date: new Date(today.getFullYear(), today.getMonth(), 11), type: 'Tax', status: 'Upcoming', time: '10:00 AM' },
                            { id: 'mock2', title: 'TDS Payment', date: new Date(today.getFullYear(), today.getMonth(), 18), type: 'Tax', status: 'Pending', time: '02:00 PM' }
                        );
                    }

                    setEvents(mappedEvents);
                }
            } catch (error) {
                console.error("Failed to load calendar events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Calendar Navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    // Calendar Grid Generation
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

    const calendarGrid = [];
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
        calendarGrid.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isSelected = selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();

        const isToday = new Date().getDate() === day &&
            new Date().getMonth() === currentDate.getMonth() &&
            new Date().getFullYear() === currentDate.getFullYear();

        const hasEvent = events.some(e =>
            new Date(e.date).getDate() === day &&
            new Date(e.date).getMonth() === currentDate.getMonth() &&
            new Date(e.date).getFullYear() === currentDate.getFullYear()
        );

        calendarGrid.push(
            <div key={day} className="flex justify-center items-center relative">
                <button
                    onClick={() => handleDateClick(day)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all relative
                        ${isSelected ? 'bg-[#B58863] text-white shadow-lg shadow-[#B58863]/30 scale-110' :
                            isToday ? 'bg-[#1C3540] text-[#B58863] border border-[#B58863]/30' :
                                'text-slate-300 hover:bg-[#1C3540] hover:text-white'}
                    `}
                >
                    {day}
                    {hasEvent && !isSelected && (
                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#B58863]"></div>
                    )}
                </button>
            </div>
        );
    }

    // Filter Events for Selected Date
    const selectedEvents = events.filter(e =>
        new Date(e.date).getDate() === selectedDate.getDate() &&
        new Date(e.date).getMonth() === selectedDate.getMonth() &&
        new Date(e.date).getFullYear() === selectedDate.getFullYear()
    );

    return (
        <div className="animate-in fade-in duration-500 pb-10">
            <h2 className="text-3xl font-bold text-[#10232A] dark:text-white mb-6">Compliance Calendar</h2>

            <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[600px]">
                {/* Left: Main Calendar */}
                <div className="flex-1 bg-[#10232A] rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden flex flex-col">
                    {/* Background Accents similar to image design */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#B58863]/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px]"></div>

                    {/* Month Header */}
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition"><ChevronLeft size={24} /></button>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white tracking-wide">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                        </div>
                        <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition"><ChevronRight size={24} /></button>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 mb-4 relative z-10">
                        {daysOfWeek.map(d => (
                            <div key={d} className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest">{d}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-y-6 relative z-10 flex-1 content-start">
                        {calendarGrid}
                    </div>
                </div>

                {/* Right: Schedule Panel */}
                <div className="w-full lg:w-[400px] bg-white dark:bg-[#1C3540] rounded-3xl p-8 shadow-xl flex flex-col border border-slate-100 dark:border-[#2A4550]">
                    <div className="mb-8">
                        <h4 className="text-[#B58863] font-bold text-lg uppercase tracking-wider mb-1">{months[selectedDate.getMonth()]}</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-bold text-[#10232A] dark:text-white tracking-tighter">{selectedDate.getDate()}</span>
                            <span className="text-xl text-slate-400 font-medium">{daysOfWeek[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1]}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#B58863]" /></div>
                        ) : selectedEvents.length > 0 ? (
                            selectedEvents.map((evt, i) => (
                                <div key={i} className="group bg-[#FDFBF7] dark:bg-[#10232A] p-4 rounded-2xl border border-transparent hover:border-[#B58863]/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-12 rounded-full ${evt.status === 'Completed' ? 'bg-emerald-500' : evt.status === 'Overdue' ? 'bg-red-500' : 'bg-[#B58863]'}`}></div>
                                        <div>
                                            <h5 className="font-bold text-[#10232A] dark:text-white text-sm mb-1">{evt.title}</h5>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <Clock size={10} /> {evt.time}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1C3540] flex items-center justify-center text-slate-300 group-hover:text-[#B58863] group-hover:translate-x-1 transition-all">
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                                <CalendarIcon size={48} className="mb-4 text-slate-200 dark:text-slate-600" />
                                <p className="text-sm font-medium">No events for this day</p>
                                <button className="mt-4 text-[#B58863] text-xs font-bold hover:underline">+ Add Reminder</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientCompliance;
