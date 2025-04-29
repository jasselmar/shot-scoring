import { useState } from 'react'
import './App.css'

function App() {
  const [shots, setShots] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [shotCount, setShotCount] = useState(5);
  const [shotCountInput, setShotCountInput] = useState('5');
  const [currentShot, setCurrentShot] = useState({
    placement: null,
    speed: null,
    pretty: null
  });

  const criteria = {
    placement: [
      { value: 2, label: 'Smart placement – deep, sideline, kitchen edge, or out of reach' },
      { value: 1, label: 'In-bounds but neutral – mid-court or easily returnable' },
      { value: 0, label: 'Out or badly misplaced' }
    ],
    speed: [
      { value: 2, label: 'Ideal pace – matched the moment with good speed or softness' },
      { value: 1, label: 'Slightly over/underhit – didn\'t match tactical need' },
      { value: 0, label: 'Wrong power – too hard/soft, unforced error, or mishit' }
    ],
    pretty: [
      { value: 2, label: 'Clean and intentional – good form, controlled shot type' },
      { value: 1, label: 'Functional but flawed – minor mishit or lack of control' },
      { value: 0, label: 'Mishit or failed attempt – not what was intended' }
    ]
  };

  const handleScoreChange = (category, value) => {
    setCurrentShot(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const calculateShotScore = (shot) => {
    if (shot.placement !== null && shot.speed !== null && shot.pretty !== null) {
      return (shot.placement + shot.speed + shot.pretty) * 16.67;
    }
    return 0;
  };

  const submitShot = () => {
    if (!playerName.trim()) {
      alert('Please enter a player name before submitting shots');
      return;
    }
    if (shots.length >= shotCount) {
      alert(`Maximum ${shotCount} shots allowed!`);
      return;
    }
    if (currentShot.placement === null || currentShot.speed === null || currentShot.pretty === null) {
      alert('Please score all categories before submitting');
      return;
    }
    setShots(prev => [...prev, currentShot]);
    setCurrentShot({ placement: null, speed: null, pretty: null });
  };

  const calculateAverage = () => {
    if (shots.length === 0) return 0;
    const total = shots.reduce((sum, shot) => sum + calculateShotScore(shot), 0);
    return (total / shots.length).toFixed(2);
  };

  const formatScore = (score) => {
    return score >= 100 ? Math.round(score).toString() : score.toFixed(2);
  };

  const renderScoring = (category) => (
    <div className="scoring-section">
      <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
      {criteria[category].map((option) => (
        <div key={option.value} className="score-option">
          <input
            type="radio"
            id={`${category}-${option.value}`}
            name={category}
            checked={currentShot[category] === option.value}
            onChange={() => handleScoreChange(category, option.value)}
          />
          <label htmlFor={`${category}-${option.value}`}>
            {option.value}: {option.label}
          </label>
        </div>
      ))}
    </div>
  );

  const resetScoring = () => {
    setShots([]);
    setPlayerName('');
    setCurrentShot({
      placement: null,
      speed: null,
      pretty: null
    });
  };

  const isComplete = shots.length >= shotCount;

  return (
    <div className="app">
      <h1 className="app-title">Tennibot Shot Scoring</h1>
      
      {!isComplete && (
        <>
          <div className="input-container">
            <div className="name-input-container">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter player name"
                disabled={shots.length > 0}
                className="name-input"
              />
            </div>
            <div className="shot-count-container">
              <label htmlFor="shotCount">Number of Shots:</label>
              <div className="shot-count-controls">
                <input
                  type="text"
                  id="shotCount"
                  value={shotCountInput}
                  onChange={(e) => setShotCountInput(e.target.value)}
                  className="name-input"
                  placeholder="5"
                />
                <div className="shot-count-buttons">
                  <button 
                    className="update-button"
                    onClick={() => {
                      const num = parseInt(shotCountInput);
                      if (!isNaN(num) && num >= 1 && num <= 50) {
                        setShotCount(num);
                      } else {
                        setShotCountInput(shotCount.toString());
                      }
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="scoring-container">
            {renderScoring('placement')}
            {renderScoring('speed')}
            {renderScoring('pretty')}
          </div>

          <button 
            className="submit-button" 
            onClick={submitShot}
            disabled={shots.length >= shotCount}
          >
            Submit Shot ({shots.length}/{shotCount})
          </button>
        </>
      )}

      <div className="results">
        <h2 className="results-title">
          {playerName ? `${playerName}'s Shots` : 'Shots'} Recorded: {shots.length}
        </h2>
        {shots.map((shot, index) => (
          <div key={index} className="shot-score">
            Shot {index + 1}: {formatScore(calculateShotScore(shot))}
          </div>
        ))}
        {shots.length > 0 && (
          <div className="average-score">
            <h2>Average Score: {formatScore(parseFloat(calculateAverage()))}</h2>
            {isComplete && (
              <button 
                className="reset-button"
                onClick={resetScoring}
              >
                Score Next Player
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
