import React from 'react';

const Ranking = ({ instituteData }) => {
    if (!instituteData?.data?.ranking) {
        return null; // Return null to not render anything if data doesn't exist
    }
    return (
        <div className="min-h-28 w-full flex flex-col justify-between bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl mb-2 ">
            <div className="mb-4 p-8">

                <h3 className="text-lg font-bold">Ranking</h3>
                <p className="text-base" dangerouslySetInnerHTML={{ __html: instituteData?.data ? instituteData?.data?.ranking : 'No data found' }}></p>
            </div>
        </div>
    );
}

export default Ranking;