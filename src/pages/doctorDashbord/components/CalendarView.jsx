
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendarStyle.css'; 


export const CalendarView = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="bg-gray-100 ">
      <h3 className="text-xl font-bold text-textPrimary mb-4">التقويم</h3>
      <Calendar
        onChange={setDate}
        value={date}
        locale="ar-EG"
        calendarType="gregory"
      />
      <p className="mt-4 text-sm text-gray-600 text-center">
        التاريخ المختار: {date.toLocaleDateString('ar-EG')}
      </p>
    </div>
  );
};

