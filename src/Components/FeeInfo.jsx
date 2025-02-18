import React from 'react';

const FeeInfo = ({ instituteData }) => {
    return (
        <div className="min-h-28 w-full flex flex-col justify-between bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl mb-2">
            <div className="mb-4  p-8">
                <h3 className="text-lg font-bold">Fee Information</h3>
                <p className="text-base" dangerouslySetInnerHTML={{ __html: instituteData?.data ? instituteData?.data?.fee : 'No data found' }}></p>
            </div>
        </div>
    );
}

export default FeeInfo;