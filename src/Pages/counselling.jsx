import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../ApiFunctions/axios';
import { useQuery } from 'react-query';

const Counselling = () => {
  const { email } = useParams();
  const apiUrl = import.meta.env.VITE_BASE_URL;

  // Fetching counselor slots
  const { data, isLoading } = useQuery({
    queryKey: ['counselor-slots', email],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${apiUrl}/counselorslots/${email}`
      );
      return response.data;
    },
    enabled: !!email, // Only fetch if email is available
  });

  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);

  // Generate 30-minute time slots between start and end times
  const generateTimeSlots = (start, end) => {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    while (currentTime < endTime) {
      const nextTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
      slots.push(
        `${currentTime.toTimeString().slice(0, 5)} - ${nextTime
          .toTimeString()
          .slice(0, 5)}`
      );
      currentTime = nextTime;
    }
    return slots;
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setDate(e.target.value);

    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const selectedDay = dayNames[selectedDate.getDay()];

    if (data?.data) {
      const startKey = `${selectedDay}Start`;
      const endKey = `${selectedDay}End`;
      const start = data.data[startKey];
      const end = data.data[endKey];

      if (start && end) {
        const slots = generateTimeSlots(start, end);
        setTimeSlots(slots);
      } else {
        setTimeSlots([]); // No slots available for the selected day
      }
    }
  };

  const handleClick = (slot) => {
    const studentEmail = localStorage.getItem('email');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const selectedSlot = {
      slot,
      date,
      studentEmail,
      email,
    };
    console.log(selectedSlot);
    axiosInstance
      .post(`${apiUrl}/bookslot`, selectedSlot, {
        headers: {
          'Content-Type': 'application/json',
          'Student-Email': studentEmail,
          'x-access-token': accessToken,
          'x-refresh-token': refreshToken
        },
      })
      .then((response) => {
        console.log('Slot booked successfully:', response.data);
        alert('Slot booked successfully!');
      })
      .catch((error) => {
        console.error('Error booking slot:', error.message);
        alert('Failed to book slot. Please try again.');
      });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='w-full h-full flex flex-col items-center justify-center justify-col'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800'>Select the Date of Counselling</h2>
      <input
        className='w-[10rem] bg-slate-200 rounded-lg p-2 text-center'
        type='date'
        onChange={handleDateChange}
      />
      <div className='mt-4 flex flex-wrap gap-2'>
        <h1 className='text-lg font-semibold text-gray-700'>Available Slots:</h1>
        {timeSlots.length > 0 ? (
          timeSlots.map((slot, index) => (
            <button
              key={index}
              className='px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600'
              onClick={() => handleClick(slot)}
            >
              {slot}
            </button>
          ))
        ) : (
          date && <p>No available slots for the selected date.</p>
        )}
      </div>
    </div>
  );
};

export default Counselling;
