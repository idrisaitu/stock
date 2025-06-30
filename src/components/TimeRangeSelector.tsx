import React from 'react';
import { TimeRange, TimeRangeLabel } from '../types/stock';

interface TimeRangeSelectorProps {
  value: number;
  onChange: (days: number) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  const ranges: { label: TimeRangeLabel; days: number }[] = [
    { label: '1D', days: 1 },
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
    { label: '1Y', days: 365 },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {ranges.map((range) => (
        <button
          key={range.label}
          onClick={() => onChange(range.days)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            value === range.days
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};