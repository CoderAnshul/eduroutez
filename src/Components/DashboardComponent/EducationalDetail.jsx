import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';

const EducationalDetail = () => {
    const [educationData, setEducationData] = useState({
        institute: '',
        degree: '',
        program: '',
        startDate: '',
        currentlyEnrolled: false,
        endDate: '',
        description: '',
        certificateImage: null
    });
    const [message, setMessage] = useState('');
    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

    // Fetch educational details
    useEffect(() => {
        const fetchEducationData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) throw new Error("User ID not found in localStorage");

                const response = await axios.get(`${VITE_BASE_URL}/student/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('accessToken'),
                        'x-refresh-token': localStorage.getItem('refreshToken')
                    }
                });

                const education = response.data.data.educations[0] || {};
                setEducationData({
                    institute: education.institute || '',
                    degree: education.degree || '',
                    program: education.program || '',
                    startDate: education.startDate || '',
                    currentlyEnrolled: education.currentlyEnrolled || false,
                    endDate: education.endDate || '',
                    description: education.description || '',
                    certificateImage: null
                });
            } catch (error) {
                console.error("Error fetching education data:", error);
                setMessage("Failed to fetch education data.");
            }
        };

        fetchEducationData();
    }, []);

    // Update education details mutation
    const { mutate, isPending: isSubmitting } = useMutation({
        mutationFn: async (finalFormData) => {
            const endpoint = `${VITE_BASE_URL}/student`;
            const response = await axios.post(endpoint, finalFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': localStorage.getItem('accessToken'),
                    'x-refresh-token': localStorage.getItem('refreshToken')
                }
            });
            return response.data;
        },
        onSuccess: () => {
            alert('Educational details updated successfully!');
        },
        onError: () => {
            alert('Something went wrong');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalFormData = new FormData();
        Object.keys(educationData).forEach(key => {
            finalFormData.append(key, educationData[key]);
        });

        mutate(finalFormData);
    };

    return (
        <div className="p-2 md:p-2 border border-gray-300 rounded-lg">
            <div className="max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold mb-6">Educational Details</h2>
                <form onSubmit={handleSubmit}>
                    {/* Institute */}
                    <div className="mb-4">
                        <label className="block font-medium mb-2">
                            Institute <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={educationData.institute}
                            onChange={(e) => setEducationData({
                                ...educationData,
                                institute: e.target.value
                            })}
                            className="w-full max-w-2/5 border rounded px-4 py-2"
                            required
                        />
                    </div>

                    {/* Degree */}
                    <div className="mb-4">
                        <label className="block font-medium mb-2">
                            Degree <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={educationData.degree}
                            onChange={(e) => setEducationData({
                                ...educationData,
                                degree: e.target.value
                            })}
                            className="w-full max-w-2/5 border rounded px-4 py-2"
                            required
                        />
                    </div>

                    {/* Program */}
                    <div className="mb-4">
                        <label className="block font-medium mb-2">
                            Program <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={educationData.program}
                            onChange={(e) => setEducationData({
                                ...educationData,
                                program: e.target.value
                            })}
                            className="w-full max-w-2/5 border rounded px-4 py-2"
                            required
                        />
                    </div>

                    {/* Start Date */}
                    <div className="mb-4">
                        <label className="block font-medium mb-2">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={educationData.startDate}
                            onChange={(e) => setEducationData({
                                ...educationData,
                                startDate: e.target.value
                            })}
                            className="w-full max-w-2/5 border rounded px-4 py-2"
                            required
                        />
                    </div>

                    {/* Currently Enrolled */}
                    <div className="mb-4">
                        <label className="block font-medium mb-2">
                            Currently Enrolled
                        </label>
                        <input
                            type="checkbox"
                            checked={educationData.currentlyEnrolled}
                            onChange={(e) => setEducationData({
                                ...educationData,
                                currentlyEnrolled: e.target.checked
                            })}
                            className="w-full max-w-2/5 border rounded px-4 py-2"
                        />
                    </div>

                    {/* End Date */}
                    <div className="mb-4">
                        <label className="block font-medium mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={educationData.endDate}
                            onChange={(e) => setEducationData({
                                ...educationData,
                                endDate: e.target.value
                            })}
                            className="w-full max-w-2/5 border rounded px-4 py-2"
                            disabled={educationData.currentlyEnrolled}
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            value={educationData.description}
                            onChange={(e) => setEducationData({
                                ...educationData,
                                description: e.target.value
                            })}
                            className="w-full max-w-2/5 border rounded px-4 py-2"
                        />
                    </div>

                    {/* Certificate Image */}
                    <div className="mb-4">
                        <label className="block font-medium mb-2">
                            Certificate Image
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setEducationData({
                                ...educationData,
                                certificateImage: e.target.files[0]
                            })}
                            className="w-full max-w-2/5 border rounded px-4 py-2"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-red-500 text-white font-semibold rounded shadow-md hover:bg-red-600 transition"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save & Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EducationalDetail;