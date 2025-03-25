import { useState } from 'react';
import usePuzzleStore from '../store/usePuzzles';
import { useTheme } from '../context/ThemeContext';

const DeveloperPanel = () => {
  const { isDarkMode } = useTheme();
  const { developerSettings, updateDeveloperSettings, userProgress } = usePuzzleStore();
  const [isOpen, setIsOpen] = useState(false);
  const [eloInput, setEloInput] = useState(userProgress.elo.toString());

  const handleEloSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newElo = parseInt(eloInput);
      if (!isNaN(newElo)) {
        updateDeveloperSettings({ customElo: newElo });
      }
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full shadow-lg ${
          isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
        }`}
        title="Developer Options"
      >
        🛠️
      </button>

      {isOpen && (
        <div className={`absolute bottom-12 right-0 w-64 p-4 rounded-lg shadow-xl ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h3 className="text-sm font-bold mb-3">Developer Options</h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={developerSettings.forceCorrect}
                onChange={(e) => updateDeveloperSettings({ forceCorrect: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Force Correct Answers</span>
            </label>

            <div className="space-y-1">
              <label className="block text-sm">Custom ELO</label>
              <input
                type="number"
                value={eloInput}
                onChange={(e) => setEloInput(e.target.value)}
                onKeyDown={handleEloSubmit}
                className={`w-full px-2 py-1 rounded text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                } border`}
                placeholder="Enter ELO value"
              />
              <div className="text-xs opacity-70 mt-1">
                Current ELO: {userProgress.elo}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperPanel; 