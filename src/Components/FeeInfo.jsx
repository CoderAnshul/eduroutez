import React, { useState } from 'react';

const FeeInfo = ({ instituteData }) => {
    const data = instituteData?.data;
    const { minFees, maxFees, fee, courses } = data || {};
    const [showAllCourses, setShowAllCourses] = useState(false);

    if (!minFees && !maxFees && !fee && !courses?.length) return null;

    const visibleCourses = showAllCourses ? courses : courses?.slice(0, 10);

    return (
        <div className="min-h-28 w-full flex flex-col bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl mb-2">
            <div className="p-4 sm:p-8 pb-2">
                <h3 className="text-base sm:text-lg font-bold mb-4">Fee & Course Comparison</h3>

                {minFees && maxFees && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-red-50 border border-red-100 rounded-lg mb-4 sm:mb-6">
                        <span className="text-xs sm:text-sm font-semibold text-gray-600">Fee Range:</span>
                        <span className="text-lg sm:text-xl font-bold text-red-600 break-words">
                            ₹{Number(minFees).toLocaleString()} – ₹{Number(maxFees).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">per annum</span>
                    </div>
                )}

                {fee && (
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Fee Structure</h4>
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-0 text-sm sm:text-base [&_table]:w-full [&_table]:min-w-[600px] [&_table]:border-collapse [&_table]:table-auto [&_th]:whitespace-nowrap [&_th]:p-2 sm:[&_th]:p-3 [&_th]:text-left [&_th]:text-xs sm:[&_th]:text-sm [&_th]:font-semibold [&_th]:bg-gray-50 [&_th]:border [&_th]:border-gray-200 [&_td]:p-2 sm:[&_td]:p-3 [&_td]:border [&_td]:border-gray-200 [&_td]:text-xs sm:[&_td]:text-sm [&_td]:break-words [&_td]:whitespace-normal [&_td]:overflow-wrap-break-word [&_td]:break-all sm:[&_td]:break-words" dangerouslySetInnerHTML={{ __html: fee }} />
                        </div>
                    </div>
                )}

                {courses?.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            All Courses – Fees, Duration & Eligibility ({courses.length} courses)
                        </h4>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-[700px] border-collapse table-auto text-xs sm:text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="whitespace-nowrap p-2 sm:p-3 text-left font-semibold border border-gray-200">Course</th>
                                        <th className="whitespace-nowrap p-2 sm:p-3 text-left font-semibold border border-gray-200">Type</th>
                                        <th className="whitespace-nowrap p-2 sm:p-3 text-left font-semibold border border-gray-200">Duration</th>
                                        <th className="whitespace-nowrap p-2 sm:p-3 text-left font-semibold border border-gray-200">Exam Accepted</th>
                                        <th className="whitespace-nowrap p-2 sm:p-3 text-left font-semibold border border-gray-200">Eligibility</th>
                                        <th className="whitespace-nowrap p-2 sm:p-3 text-left font-semibold border border-gray-200">Fee</th>
                                        <th className="whitespace-nowrap p-2 sm:p-3 text-left font-semibold border border-gray-200">Cutoff</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleCourses.map((c) => (
                                        <tr key={c._id} className="hover:bg-gray-50">
                                            <td className="p-2 sm:p-3 border border-gray-200 font-medium text-red-700 break-words whitespace-normal max-w-[200px]">{c.courseTitle}</td>
                                            <td className="p-2 sm:p-3 border border-gray-200 whitespace-nowrap">{c.courseType || '—'}</td>
                                            <td className="p-2 sm:p-3 border border-gray-200 whitespace-nowrap">
                                                {c.courseDurationYears ? `${c.courseDurationYears}Y` : ''}{c.courseDurationMonths ? ` ${c.courseDurationMonths}M` : '—'}
                                            </td>
                                            <td className="p-2 sm:p-3 border border-gray-200 break-words whitespace-normal max-w-[140px]">{c.examAccepted || '—'}</td>
                                            <td className="p-2 sm:p-3 border border-gray-200 break-words whitespace-normal max-w-[200px]"
                                                dangerouslySetInnerHTML={{ __html: c.eligibility || '—' }} />
                                            <td className="p-2 sm:p-3 border border-gray-200 whitespace-nowrap font-semibold text-red-600">
                                                {c.coursePrice ? `₹${Number(c.coursePrice).toLocaleString()}` : '—'}
                                            </td>
                                            <td className="p-2 sm:p-3 border border-gray-200 break-words whitespace-normal max-w-[140px]">{c.cutOff || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {courses.length > 10 && (
                            <button
                                onClick={() => setShowAllCourses(!showAllCourses)}
                                className="mt-3 text-sm text-red-600 font-semibold hover:text-red-800"
                            >
                                {showAllCourses ? `Show less` : `View all ${courses.length} courses`}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FeeInfo;