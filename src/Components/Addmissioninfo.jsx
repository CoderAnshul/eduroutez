import React from 'react'

const Addmissioninfo = ({instituteData}) => {
  return (
    <div className="min-h-28 w-full flex flex-col justify-between bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl mb-2 p-4 pt-8">
        <div className="mb-4">
            <h3 className="text-lg font-bold">Addmission Information</h3>
            <div className="text-base" dangerouslySetInnerHTML={{ __html: instituteData?.data ? instituteData?.data?.admissionInfo : 'no data found' }} />
          </div>
    </div>
  )
}

export default Addmissioninfo
