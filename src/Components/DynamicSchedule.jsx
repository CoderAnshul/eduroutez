import React from 'react';

const DynamicSchedule = ({ slots = {} }) => {
    // Get all days of the week
    console.log('date todate', slots);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];

    const getDaySchedule = (slots) => {
        if (!slots) return { start: null, end: null };
        const startKey = `${currentDay}Start`;
        const endKey = `${currentDay}End`;
        return {
            start: slots[startKey],
            end: slots[endKey]
        };
    };

    const schedule = getDaySchedule(slots);
    const isAvailable = schedule.start && schedule.end;

    if (!isAvailable) {
        return (
            <span className="text-gray-500">
                Not available today
            </span>
        );
    }

    return (
        <span className="text-gray-600">
            {schedule.start} - {schedule.end}
        </span>
    );
};

export default DynamicSchedule;
