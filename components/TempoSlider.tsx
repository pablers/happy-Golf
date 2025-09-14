import React from 'react';

interface TempoSliderProps {
  min: number;
  max: number;
  value: number;
  optimalStart: number;
  optimalEnd: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TempoSlider: React.FC<TempoSliderProps> = ({ min, max, value, optimalStart, optimalEnd, onChange }) => {
  const optimalRangeStartPercentage = ((optimalStart - min) / (max - min)) * 100;
  const optimalRangeWidthPercentage = ((optimalEnd - optimalStart) / (max - min)) * 100;

  return (
    <div className="relative w-full h-8 flex items-center">
      {/* Track background */}
      <div className="absolute w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
      
      {/* Optimal range highlight */}
      <div
        className="absolute h-2 bg-green-500/50 rounded-full"
        style={{
          left: `${optimalRangeStartPercentage}%`,
          width: `${optimalRangeWidthPercentage}%`,
        }}
        aria-hidden="true"
      />
      
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step="1"
        onChange={onChange}
        className="w-full h-full appearance-none bg-transparent cursor-pointer tempo-slider z-10"
        aria-label="Tempo Slider"
      />
    </div>
  );
};

export default TempoSlider;