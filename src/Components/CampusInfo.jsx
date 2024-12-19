import React from 'react'

const CampusInfo = ({instituteData}) => {
  return (
    <div className="min-h-28 w-full flex flex-col justify-between bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl mb-2 p-4 pt-8">
    <div className="mb-4">
        <h3 className="text-lg font-bold">Campus Information</h3>
        <p className="text-base">{instituteData?.data? `${instituteData?.data?.campusInfo}`: 'no data found'}</p>
      </div>
</div>
  )
}

export default CampusInfo