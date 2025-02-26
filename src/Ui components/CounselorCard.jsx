import React from 'react';
import { Star, MapPin, GraduationCap, Languages, PhoneCall, VideoIcon } from 'lucide-react';

const CounselorCard = ({ counselor }) => {
  const defaultImage = '/api/placeholder/200/200';
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header with gradient and profile photo */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
          <span className="text-sm font-semibold text-blue-600">
            {counselor.level}
          </span>
        </div>
        
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100">
            <img
              src={counselor.profilePhoto || defaultImage}
              alt={`${counselor.firstname} ${counselor.lastname}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="pt-16 px-6 pb-6">
        {/* Name and rating */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {counselor.firstname} {counselor.lastname}
          </h3>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < counselor.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({counselor.reviews?.length || 0} reviews)
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-600">Experience</div>
            <div className="font-semibold text-blue-600">
              {counselor.ExperienceYear || '0'} Years
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-600">Sessions Done</div>
            <div className="font-semibold text-purple-600">
              {counselor.points || 0}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <span className="ml-3">{counselor.category}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Languages className="w-5 h-5 text-green-500" />
            <span className="ml-3">{counselor.language || 'English'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 text-red-500" />
            <span className="ml-3">{`${counselor.city || 'Not specified'}, ${counselor.country || 'India'}`}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
            <VideoIcon className="w-4 h-4 mr-2" />
            Book Session
          </button>
          <button className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
            <PhoneCall className="w-4 h-4 mr-2" />
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounselorCard;