import React, { useEffect, useState } from 'react';
import { CalendarDays, Clock, MapPin, User } from 'lucide-react';
import axiosInstance from '../ApiFunctions/axios';

const ScheduledSlots = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const apiUrl = import.meta.env.VITE_BASE_URL;
    const id = localStorage.getItem("userId");

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`${apiUrl}/scheduled-slots/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                const sortedSlots = (response.data?.data?.result || []).sort((a, b) => new Date(b.date) - new Date(a.date));
                setSlots(sortedSlots);
                setError(null);
            } catch (error) {
                console.log('Error fetching scheduled slots:', error.message);
                setError('Failed to fetch scheduled slots. Please try again later.');
                console.error('Error fetching scheduled slots:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [apiUrl, id]);

    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="text-center p-8 bg-red-50 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!slots || slots.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No scheduled slots found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Your Scheduled Sessions</h1>
            <div className="space-y-4">
                {slots.map((slot) => (
                    <div key={slot._id || Math.random()} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-gray-50 p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">
                                    Session with {slot.counselorId?.firstname || 'Unknown Counselor'}
                                </h2>
                                <span className={`${getStatusBadgeColor(slot.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                                    {slot.status || 'Scheduled'}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">
                                            {typeof slot.counselorId?.level === 'string' ? slot.counselorId.level : 'Career Counselor'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">
                                            {formatDate(slot.date)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">
                                            {typeof slot.slot === 'string' ? slot.slot : 'Time not specified'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">
                                            {typeof slot.counselorId?.city === 'string' ? slot.counselorId.city : 'Location not specified'}, 
                                            {typeof slot.counselorId?.country === 'string' ? slot.counselorId.country : ''}
                                        </span>
                                    </div>
                                </div>
                                {slot.link && (
                                    <div className="flex items-center justify-end">
                                        <a
                                            href={slot.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                                        >
                                            Join Meeting
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduledSlots;