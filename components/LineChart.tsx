import React from 'react';

interface LineChartProps {
  data: (number | null)[];
  secondaryData?: (number | null)[];
  labels: string[];
}

const LineChart: React.FC<LineChartProps> = ({ data, secondaryData, labels }) => {
  const width = 300;
  const height = 150;
  const padding = 20;

  const validData = data.map((d, i) => d !== null ? { x: i, y: d } : null).filter(Boolean) as { x: number; y: number }[];
  const validSecondaryData = secondaryData 
    ? secondaryData.map((d, i) => d !== null ? { x: i, y: d } : null).filter(Boolean) as { x: number; y: number }[]
    : [];

  if (validData.length === 0) {
      return <div className="text-center text-gray-500 py-10">No hay datos para mostrar.</div>;
  }
  
  const allYValues = [
      ...validData.map(d => d.y), 
      ...validSecondaryData.map(d => d.y)
  ];
  
  const maxX = labels.length - 1;
  const dataMaxY = Math.max(...allYValues);
  const dataMinY = Math.min(...allYValues);
  
  // Adjust the Y-axis to be +-1 point around the data range.
  const maxY = dataMaxY + 1;
  const minY = dataMinY - 1;

  const getX = (x: number) => {
    if (maxX <= 0) return width / 2;
    return padding + (x / maxX) * (width - 2 * padding);
  };

  const getY = (y: number) => {
    const yRange = maxY - minY;
    if (yRange === 0) return height / 2;
    return height - padding - ((y - minY) / yRange) * (height - 2 * padding);
  };
  
  const path = validData
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.x)} ${getY(p.y)}`)
    .join(' ');
  
  const secondaryPath = validSecondaryData.length > 0
    ? validSecondaryData
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.x)} ${getY(p.y)}`)
        .join(' ')
    : '';

  // Generate Y-axis labels dynamically
  const yAxisLabels = [];
  const yRange = maxY - minY;
  if (yRange > 0) {
      // Aim for about 4-5 ticks
      const tickCount = Math.min(Math.floor(yRange), 4) + 1;
      const interval = yRange / (tickCount > 1 ? tickCount - 1 : 1);
      for(let i = 0; i < tickCount; i++) {
          const value = minY + (i * interval);
          yAxisLabels.push(Math.round(value));
      }
  } else {
      yAxisLabels.push(Math.round(dataMinY));
  }
  const uniqueYAxisLabels = [...new Set(yAxisLabels)]; // Remove duplicates

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-gray-400 dark:text-gray-500">
        {/* Y-axis lines and labels */}
        {uniqueYAxisLabels.map((label) => {
          const yPos = getY(label);
          if (yPos < padding - 5 || yPos > height - padding + 5) return null; // Give a little margin
          return (
            <g key={label}>
              <line x1={padding} y1={yPos} x2={width - padding} y2={yPos} className="stroke-current opacity-30" strokeWidth="0.5" />
              <text x={padding - 5} y={yPos} dy="0.3em" textAnchor="end" className="fill-current" fontSize="8">{label}</text>
            </g>
          )
        })}
        
        {/* X-axis labels */}
        {labels.map((label, i) => {
             if (labels.length > 9 && (i % 3 !== 0)) return null; // Show fewer labels for 18 holes
             if (labels.length <= 9 && (i % 2 !== 0)) return null; // Show fewer labels for 9 holes
            return (
                <text key={i} x={getX(i)} y={height - padding + 10} textAnchor="middle" className="fill-current" fontSize="8">
                    {label.replace('H','')}
                </text>
            )
        })}

        {/* Secondary Line */}
        {secondaryPath && (
          <path 
            d={secondaryPath} 
            fill="none" 
            className="stroke-blue-400" 
            strokeWidth="1.5" 
            strokeDasharray="4 2" 
          />
        )}

        {/* Main Line */}
        <path d={path} fill="none" className="stroke-green-500" strokeWidth="2" />

        {/* Points */}
        {validData.map((p, i) => (
          <circle key={i} cx={getX(p.x)} cy={getY(p.y)} r="2.5" className="fill-green-500" />
        ))}
      </svg>
    </div>
  );
};

export default LineChart;