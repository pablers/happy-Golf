import React from 'react';
import type { HoleScore } from '../types';

interface HeatmapProps {
  scores: HoleScore[];
  getNetScore: (score: HoleScore) => number | null;
}

const Heatmap: React.FC<HeatmapProps> = ({ scores, getNetScore }) => {
  const getColorForNetScore = (netScore: number | null): string => {
    if (netScore === null) return 'bg-gray-300 dark:bg-gray-700'; // Not played
    if (netScore <= -2) return 'bg-blue-600'; // Eagle or better
    if (netScore === -1) return 'bg-green-600'; // Birdie
    if (netScore === 0) return 'bg-yellow-600'; // Par
    if (netScore === 1) return 'bg-orange-600'; // Bogey
    return 'bg-red-600'; // Double Bogey or worse
  };

  const rows = [scores.slice(0, 9), scores.slice(9, 18)];
  const visibleRows = roundHasBackNine() ? rows : [rows[0]];

  function roundHasBackNine() {
    return scores.slice(9, 18).some(hole => hole.strokes !== null);
  }

  return (
    <div className="flex justify-center">
      <table className="border-collapse">
        <tbody>
          {visibleRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map(hole => {
                const netScore = getNetScore(hole);
                const color = getColorForNetScore(netScore);
                return (
                  <td
                    key={hole.hole}
                    className={`w-8 h-8 border border-white dark:border-gray-900 text-white text-xs font-bold text-center ${color}`}
                    title={`Hoyo ${hole.hole}: ${netScore !== null ? netScore : 'N/A'}`}
                  >
                    {netScore !== null ? (netScore > 0 ? `+${netScore}` : netScore === 0 ? 'E' : netScore) : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Heatmap;