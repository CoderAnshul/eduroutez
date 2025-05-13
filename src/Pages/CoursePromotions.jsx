import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from 'react-query';
import axiosInstance from '../ApiFunctions/axios';

const baseURL = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const fetchPromotions = async () => {
  const response = await axiosInstance.get(`${baseURL}/promotions?limit=10000`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('accessToken'),
      'x-refresh-token': localStorage.getItem('refreshToken'),
    },
  });
  if (response.status !== 200) {
    throw new Error('Failed to fetch promotions');
  }
  return response.data;
};

const Promotions = ({ location, className }) => {
  const [randomPromo, setRandomPromo] = useState(null);

  const { data: promotionsData, isLoading, isError } = useQuery(
    'promotions',
    fetchPromotions,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    }
  );

  const filteredPromotions = useMemo(() => {
    if (promotionsData?.data?.result) {
      return promotionsData.data.result.filter(
        (promo) => promo.location === location
      );
    }
    return [];
  }, [promotionsData, location]);

  useEffect(() => {
    if (filteredPromotions.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredPromotions.length);
      setRandomPromo(filteredPromotions[randomIndex]);
    }
  }, [filteredPromotions]);

  const handlePromoClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (randomPromo && randomPromo.link) {
        let url = randomPromo.link;

        if (!/^https?:\/\//i.test(url)) {
          url = 'https://' + url;
        }

        try {
          window.open(url, '_blank');
        } catch (error) {
          console.error('Error opening link:', error);
          window.location.href = url;
        }
      }
    },
    [randomPromo]
  );

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-lg" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !randomPromo) {
    return null;
  }

  const isClickable = Boolean(randomPromo.link);

  return (
    <div className={`w-full mt-4 ${className || ''}`}>
      <div className={`w-full ${className || ''}`}>
        {isClickable ? (
          <a
            href={randomPromo.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative rounded-lg block cursor-pointer hover:opacity-95 ${className || ''}`}
            onClick={handlePromoClick}
          >
            <div className={`relative w-full`}>
              {randomPromo.image && (
                <img
                  src={`${imageUrl}/${randomPromo.image}`}
                  alt={randomPromo.title || 'Promotion'}
                  className={`w-full h-full object-cover md:object-contain rounded-lg ${className || ''}`}
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              {randomPromo.title && (
                <h3 className="text-2xl font-bold mb-2">{randomPromo.title}</h3>
              )}
              {randomPromo.description && (
                <p className="text-sm text-white/90 mb-2">
                  {randomPromo.description}
                </p>
              )}
              <p className="text-sm text-white/90 underline hover:text-white">
                Learn more
              </p>
            </div>
          </a>
        ) : (
          <div className={`relative rounded-lg ${className || ''}`}>
            <div className={`relative w-full`}>
              {randomPromo.image && (
                <img
                  src={`${imageUrl}/${randomPromo.image}`}
                  alt={randomPromo.title || 'Promotion'}
                  className={`w-full h-full object-cover md:object-contain rounded-lg ${className || ''}`}
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              {randomPromo.description && (
                <p className="text-sm text-white/90 mb-2">
                  {randomPromo.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;
