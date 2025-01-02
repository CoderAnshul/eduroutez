import React, { useState } from 'react';

const EducationalDetail = () => {
    const [institutionName, setInstitutionName] = useState('');
    const [degree, setDegree] = useState('');
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [graduationYear, setGraduationYear] = useState('');

    const handleUpdate = (e) => {
        e.preventDefault();
        console.log('Institution Name:', institutionName);
        console.log('Degree:', degree);
        console.log('Field of Study:', fieldOfStudy);
        console.log('Graduation Year:', graduationYear);
        alert('Educational details updated successfully!');
    };

    return (
        <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Update Educational Details</h2>
            <form onSubmit={handleUpdate}>
                {/* Institution Name */}
                <div className="mb-4">
                    <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">
                        Institution Name
                    </label>
                    <input
                        type="text"
                        id="institutionName"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        className="mt-1 block max-w-2/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
                        placeholder="Enter institution name"
                        required
                    />
                </div>

                {/* Degree */}
                <div className="mb-4">
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                        Degree
                    </label>
                    <input
                        type="text"
                        id="degree"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="mt-1 block max-w-2/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
                        placeholder="Enter degree"
                        required
                    />
                </div>

                {/* Field of Study */}
                <div className="mb-4">
                    <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700">
                        Field of Study
                    </label>
                    <input
                        type="text"
                        id="fieldOfStudy"
                        value={fieldOfStudy}
                        onChange={(e) => setFieldOfStudy(e.target.value)}
                        className="mt-1 block max-w-2/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
                        placeholder="Enter field of study"
                        required
                    />
                </div>

                {/* Graduation Year */}
                <div className="mb-4">
                    <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
                        Graduation Year
                    </label>
                    <input
                        type="text"
                        id="graduationYear"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className="mt-1 block max-w-2/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
                        placeholder="Enter graduation year"
                        required
                    />
                </div>

                {/* Update Button */}
                <div>
                    <button
                        type="submit"
                        className="max-w-2/5 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EducationalDetail;