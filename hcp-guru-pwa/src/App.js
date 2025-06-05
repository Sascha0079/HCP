// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'; 
import { golfData } from './golfData'; 

// Funktion zur Berechnung des Course Handicaps mit der Formel
function calculateCourseHcpByFormula(hcpi, cr, sr, par) {
    if (isNaN(hcpi) || cr === undefined || sr === undefined || par === undefined) {
        return null; 
    }
    let slopeDivider = 113;
    // Annahme für 9-Loch basierend auf Par (Schwelle anpassen, falls genauer bekannt)
    // Besser wäre ein explizites Kennzeichen in golfData, ob SR ein 9- oder 18-Loch-Slope ist.
    if (par < 60) { // Beispielhafte Schwelle für 9-Loch-Platz-Erkennung
        slopeDivider = 113 * 2; 
    }
    const courseHandicapExact = hcpi * (sr / slopeDivider) + (cr - par);
    return Math.round(courseHandicapExact); 
}

const genderOptions = [
    { label: "Herren", value: "Herren" },
    { label: "Damen", value: "Damen" },
];
const defaultGender = "Herren";

function App() {
  const clubNames = Object.keys(golfData);
  const [selectedClubName, setSelectedClubName] = useState(clubNames[0] || "");
  
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedCourseParForDisplay, setSelectedCourseParForDisplay] = useState(null); // Nur für Anzeige im Label

  const [appMode, setAppMode] = useState('single'); 

  // --- Spieler States ---
  // Spieler 1
  const [selectedGenderP1, setSelectedGenderP1] = useState(defaultGender);
  const [availableTeesP1, setAvailableTeesP1] = useState([]);
  const [selectedTeeColorP1, setSelectedTeeColorP1] = useState("");
  const [hcpInput1, setHcpInput1] = useState('');
  const [courseHcpP1, setCourseHcpP1] = useState(null);

  // Spieler 2
  const [selectedGenderP2, setSelectedGenderP2] = useState(defaultGender);
  const [availableTeesP2, setAvailableTeesP2] = useState([]);
  const [selectedTeeColorP2, setSelectedTeeColorP2] = useState("");
  const [hcpInput2, setHcpInput2] = useState('');
  const [courseHcpP2, setCourseHcpP2] = useState(null);

  // Spieler 3 (für Team)
  const [selectedGenderP3, setSelectedGenderP3] = useState(defaultGender);
  const [availableTeesP3, setAvailableTeesP3] = useState([]);
  const [selectedTeeColorP3, setSelectedTeeColorP3] = useState("");
  const [hcpInput3, setHcpInput3] = useState('');
  const [courseHcpP3, setCourseHcpP3] = useState(null);

  // Spieler 4 (für Team)
  const [selectedGenderP4, setSelectedGenderP4] = useState(defaultGender);
  const [availableTeesP4, setAvailableTeesP4] = useState([]);
  const [selectedTeeColorP4, setSelectedTeeColorP4] = useState("");
  const [hcpInput4, setHcpInput4] = useState('');
  const [courseHcpP4, setCourseHcpP4] = useState(null);

  // --- Matchplay & Team States ---
  const [matchplayVorgabeSingle, setMatchplayVorgabeSingle] = useState('---');
  const [receivingPlayerSingle, setReceivingPlayerSingle] = useState('');
  const [diffSingle, setDiffSingle] = useState(null); 
  const [teamAHandicap, setTeamAHandicap] = useState(null);
  const [teamBHandicap, setTeamBHandicap] = useState(null);
  const [matchplayVorgabeTeam, setMatchplayVorgabeTeam] = useState('---');
  const [receivingTeam, setReceivingTeam] = useState('');
  const [teamDiff, setTeamDiff] = useState(null); 

  // Effekt zum Aktualisieren der verfügbaren Plätze bei Clubwechsel
  useEffect(() => {
    if (selectedClubName && golfData[selectedClubName]) {
      const courses = Object.keys(golfData[selectedClubName]);
      setAvailableCourses(courses);
      setSelectedCourseName(courses[0] || ""); 
    } else {
      setAvailableCourses([]);
      setSelectedCourseName("");
    }
  }, [selectedClubName]);

  // Funktion zum Aktualisieren der verfügbaren Abschläge und des ausgewählten Abschlags für einen Spieler
  const updateAvailableTeesForPlayer = (club, course, gender, setAvailableTeesFunc, setSelectedTeeColorFunc) => {
    if (club && course && gender && golfData[club]?.[course]?.[gender]) {
      const teeColors = Object.keys(golfData[club][course][gender]);
      setAvailableTeesFunc(teeColors);
      setSelectedTeeColorFunc(teeColors[0] || ""); // Ersten verfügbaren Abschlag auswählen
    } else {
      setAvailableTeesFunc([]);
      setSelectedTeeColorFunc("");
    }
  };

  // Effekte zum Aktualisieren der verfügbaren Abschläge für jeden Spieler
  useEffect(() => { updateAvailableTeesForPlayer(selectedClubName, selectedCourseName, selectedGenderP1, setAvailableTeesP1, setSelectedTeeColorP1); }, [selectedClubName, selectedCourseName, selectedGenderP1]);
  useEffect(() => { updateAvailableTeesForPlayer(selectedClubName, selectedCourseName, selectedGenderP2, setAvailableTeesP2, setSelectedTeeColorP2); }, [selectedClubName, selectedCourseName, selectedGenderP2]);
  useEffect(() => { updateAvailableTeesForPlayer(selectedClubName, selectedCourseName, selectedGenderP3, setAvailableTeesP3, setSelectedTeeColorP3); }, [selectedClubName, selectedCourseName, selectedGenderP3]);
  useEffect(() => { updateAvailableTeesForPlayer(selectedClubName, selectedCourseName, selectedGenderP4, setAvailableTeesP4, setSelectedTeeColorP4); }, [selectedClubName, selectedCourseName, selectedGenderP4]);
  
  // Effekt zum Setzen des Par-Wertes für die Anzeige im Platz-Label
  useEffect(() => {
      if (selectedClubName && selectedCourseName && availableTeesP1.length > 0 && selectedGenderP1) {
          // Nimmt den ersten verfügbaren Abschlag von Spieler 1, um ein Par anzuzeigen
          const firstTeeColor = availableTeesP1[0];
          const courseDetails = golfData[selectedClubName]?.[selectedCourseName]?.[selectedGenderP1]?.[firstTeeColor];
          if (courseDetails && typeof courseDetails.Par === 'number') {
              setSelectedCourseParForDisplay(courseDetails.Par);
          } else {
              setSelectedCourseParForDisplay(null);
          }
      } else {
          setSelectedCourseParForDisplay(null);
      }
  }, [selectedClubName, selectedCourseName, selectedGenderP1, availableTeesP1]);


  // Funktion zur Berechnung der Spielvorgabe für einen Spieler
  const calculatePlayerCourseHcpAndUpdateState = (
    hcpInputString, 
    gender, // NEU
    teeColor, // NEU
    currentClubName,
    currentCourseName, 
    setCourseHcpState 
  ) => {
    if (!gender || !teeColor || hcpInputString === '' || !currentClubName || !currentCourseName) {
      setCourseHcpState(null); 
      return;
    }
    const hcpi = parseFloat(hcpInputString.replace(',', '.'));
    if (isNaN(hcpi)) {
      setCourseHcpState(null); 
      return;
    }

    try {
      const courseSpecificData = golfData[currentClubName]?.[currentCourseName]?.[gender]?.[teeColor];
      if (courseSpecificData) {
        const { CR, SR, Par } = courseSpecificData;
        const ch = calculateCourseHcpByFormula(hcpi, CR, SR, Par);
        setCourseHcpState(ch);
      } else {
        setCourseHcpState(null); 
      }
    } catch (error) {
      console.error("Error calculating course HCP with formula:", error);
      setCourseHcpState(null); 
    }
  };

  // Effekte zur Berechnung der Spielvorgaben der Spieler
  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInput1, selectedGenderP1, selectedTeeColorP1, selectedClubName, selectedCourseName, setCourseHcpP1); }, [hcpInput1, selectedGenderP1, selectedTeeColorP1, selectedClubName, selectedCourseName]);
  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInput2, selectedGenderP2, selectedTeeColorP2, selectedClubName, selectedCourseName, setCourseHcpP2); }, [hcpInput2, selectedGenderP2, selectedTeeColorP2, selectedClubName, selectedCourseName]);
  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInput3, selectedGenderP3, selectedTeeColorP3, selectedClubName, selectedCourseName, setCourseHcpP3); }, [hcpInput3, selectedGenderP3, selectedTeeColorP3, selectedClubName, selectedCourseName]);
  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInput4, selectedGenderP4, selectedTeeColorP4, selectedClubName, selectedCourseName, setCourseHcpP4); }, [hcpInput4, selectedGenderP4, selectedTeeColorP4, selectedClubName, selectedCourseName]);

  // Effekt für Einzel-Matchplay
  useEffect(() => {
    if (courseHcpP1 !== null && courseHcpP2 !== null) {
      const diff = Math.abs(courseHcpP1 - courseHcpP2);
      setDiffSingle(diff); 
      const strokes = Math.round(diff * 0.75); 
      setMatchplayVorgabeSingle(strokes);
      if (courseHcpP1 > courseHcpP2) setReceivingPlayerSingle('Spieler 1 erhält');
      else if (courseHcpP2 > courseHcpP1) setReceivingPlayerSingle('Spieler 2 erhält');
      else setReceivingPlayerSingle('Kein Spieler erhält');
    } else {
      setMatchplayVorgabeSingle('---'); setReceivingPlayerSingle(''); setDiffSingle(null);
    }
  }, [courseHcpP1, courseHcpP2]);

  // Team Handicap Logik
  const calculateTeamHandicap = (hcpPlayerA, hcpPlayerB) => {
    if (hcpPlayerA === null || hcpPlayerB === null) return null;
    const lowerHcp = Math.min(hcpPlayerA, hcpPlayerB);
    const higherHcp = Math.max(hcpPlayerA, hcpPlayerB);
    const teamHcp = (lowerHcp * 0.6) + (higherHcp * 0.4);
    return Math.round(teamHcp * 10) / 10; 
  };
  useEffect(() => { setTeamAHandicap(calculateTeamHandicap(courseHcpP1, courseHcpP2)); }, [courseHcpP1, courseHcpP2]);
  useEffect(() => { setTeamBHandicap(calculateTeamHandicap(courseHcpP3, courseHcpP4)); }, [courseHcpP3, courseHcpP4]);

  // Team Matchplay Logik
  useEffect(() => {
    if (teamAHandicap !== null && teamBHandicap !== null) {
      const diff = Math.abs(teamAHandicap - teamBHandicap);
      setTeamDiff(diff); 
      const strokes = Math.round(diff); 
      setMatchplayVorgabeTeam(strokes);
      if (teamAHandicap > teamBHandicap) setReceivingTeam('Team A erhält');
      else if (teamBHandicap > teamAHandicap) setReceivingTeam('Team B erhält');
      else setReceivingTeam('Kein Team erhält');
    } else {
      setMatchplayVorgabeTeam('---'); setReceivingTeam(''); setTeamDiff(null);
    }
  }, [teamAHandicap, teamBHandicap]);

  // Hilfskomponente für die Spielvorgabenanzeige
  const PlayerHcpDisplay = ({ courseHcp, labelPrefix = "Spielvorgabe" }) => (
    <div className="player-course-hcp-display compact">
      <span>{labelPrefix} ({selectedCourseName || 'Platz wählen'}): <strong>{courseHcp !== null ? courseHcp : '-'}</strong></span>
    </div>
  );

  // Hilfskomponente für detaillierte Team-HCP-Anzeige
  const TeamHcpDetailDisplay = ({ 
    teamLabel, 
    player1_ID_Label, player1_HCPI, player1_CourseHCP,
    player2_ID_Label, player2_HCPI, player2_CourseHCP,
    teamHcpTotal
  }) => {
    if (player1_CourseHCP === null || player2_CourseHCP === null) {
      return (
        <div className="team-detail-box">
          <h4>{teamLabel} ({selectedCourseName || 'Platz wählen'})</h4>
          <p>Spielerdaten unvollständig.</p>
          <div className="team-total-hcp">
            <span>Team-Vorgabe: </span>
            <span className="result-value">---</span>
          </div>
        </div>
      );
    }
    const p1ActualHcpi = player1_HCPI || "N/A";
    const p2ActualHcpi = player2_HCPI || "N/A";
    const isP1CourseLower = player1_CourseHCP <= player2_CourseHCP;
    const playerLower = {
        idLabel: isP1CourseLower ? player1_ID_Label : player2_ID_Label,
        hcpi: isP1CourseLower ? p1ActualHcpi : p2ActualHcpi,
        courseHcp: isP1CourseLower ? player1_CourseHCP : player2_CourseHCP,
        percent: 60
    };
    const playerHigher = {
        idLabel: isP1CourseLower ? player2_ID_Label : player1_ID_Label,
        hcpi: isP1CourseLower ? p2ActualHcpi : p1ActualHcpi,
        courseHcp: isP1CourseLower ? player2_CourseHCP : player1_CourseHCP,
        percent: 40
    };
    const lowerContrib = playerLower.courseHcp * (playerLower.percent / 100);
    const higherContrib = playerHigher.courseHcp * (playerHigher.percent / 100);
    return (
      <div className="team-detail-box">
        <h4>{teamLabel} ({selectedCourseName || 'Platz wählen'})</h4>
        <div className="player-contribution">
          <span>{playerLower.idLabel} (HCPI: {playerLower.hcpi}): Spielvorgabe {playerLower.courseHcp} * {playerLower.percent}% = <strong>{lowerContrib.toFixed(1)}</strong></span>
        </div>
        <div className="player-contribution">
          <span>{playerHigher.idLabel} (HCPI: {playerHigher.hcpi}): Spielvorgabe {playerHigher.courseHcp} * {playerHigher.percent}% = <strong>{higherContrib.toFixed(1)}</strong></span>
        </div>
        <div className="team-total-hcp">
          <span>Team-Vorgabe: </span>
          <span className="result-value">{teamHcpTotal !== null ? teamHcpTotal.toFixed(1) : '---'}</span>
        </div>
      </div>
    );
  };

  // Helper-Komponente für Spieler-Inputs
  const PlayerInputSection = ({ playerNum, teamLabel = "" }) => {
    // Dynamischer Zugriff auf State und Setter basierend auf playerNum
    const selectedGender = eval(`selectedGenderP${playerNum}`);
    const setSelectedGender = eval(`setSelectedGenderP${playerNum}`);
    const availableTees = eval(`availableTeesP${playerNum}`);
    const selectedTeeColor = eval(`selectedTeeColorP${playerNum}`);
    const setSelectedTeeColor = eval(`setSelectedTeeColorP${playerNum}`);
    const hcpInput = eval(`hcpInput${playerNum}`);
    const setHcpInput = eval(`setHcpInput${playerNum}`);
    const courseHcp = eval(`courseHcpP${playerNum}`);

    return (
        <section className="player-section">
          <h2>Spieler {playerNum} {appMode === 'team' && `(${teamLabel})`}</h2>
          <div className="input-group">
            <label htmlFor={`gender-select-p${playerNum}`}>Geschlecht Spieler {playerNum}:</label>
            <select 
                id={`gender-select-p${playerNum}`} 
                value={selectedGender} 
                onChange={(e) => setSelectedGender(e.target.value)}
            >
              {genderOptions.map(option => (
                <option key={`p${playerNum}-gender-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor={`tee-select-p${playerNum}`}>Abschlag Spieler {playerNum}:</label>
            <select 
                id={`tee-select-p${playerNum}`} 
                value={selectedTeeColor} 
                onChange={(e) => setSelectedTeeColor(e.target.value)}
                disabled={availableTees.length === 0}
            >
              {availableTees.length === 0 && <option value="">- (Geschlecht wählen) -</option>}
              {availableTees.map(teeColor => (
                <option key={`p${playerNum}-tee-${teeColor}`} value={teeColor}>
                  {teeColor}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor={`hcp-input-p${playerNum}`}>HCPI Spieler {playerNum}:</label>
            <input 
              type="text" 
              inputMode="decimal"
              id={`hcp-input-p${playerNum}`} 
              value={hcpInput} 
              onChange={(e) => setHcpInput(e.target.value)} 
              placeholder="z.B. 18.4 oder -2,5"
            />
          </div>
          <PlayerHcpDisplay courseHcp={courseHcp} />
        </section>
    );
  };


  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <div className="global-controls">
            <div className="selectors-row"> 
                <div className="input-group club-selector-group">
                    <label htmlFor="club-select">Golfclub:</label>
                    <select 
                        id="club-select" 
                        value={selectedClubName} 
                        onChange={(e) => setSelectedClubName(e.target.value)}
                    >
                        {clubNames.map(club => (
                            <option key={club} value={club}>
                                {club}
                            </option>
                        ))}
                    </select>
                </div>
                
                {availableCourses.length > 0 && (
                    <div className="input-group course-selector-group">
                        <label htmlFor="course-select">Platz ({selectedCourseParForDisplay !== null ? `Par ${selectedCourseParForDisplay}` : 'Par ?'}):</label>
                        <select
                            id="course-select"
                            value={selectedCourseName}
                            onChange={(e) => setSelectedCourseName(e.target.value)}
                        >
                            {availableCourses.map(course => (
                                <option key={course} value={course}>
                                    {course}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div> 

            <div className="mode-selector modern-tabs">
            <button 
                className={`tab-button ${appMode === 'single' ? 'active' : ''}`}
                onClick={() => setAppMode('single')}
            >
                Einzel
            </button>
            <button 
                className={`tab-button ${appMode === 'team' ? 'active' : ''}`}
                onClick={() => setAppMode('team')}
            >
                Team
            </button>
            </div>
        </div>

        <PlayerInputSection playerNum={1} teamLabel="Team A" />
        <PlayerInputSection playerNum={2} teamLabel="Team A" />

        {appMode === 'single' && (
          <section className="results-container single-matchplay-results">
            <h3>Einzel-Matchplay Vorgabe ({selectedCourseName || 'Platz wählen'})</h3>
            {courseHcpP1 !== null && courseHcpP2 !== null && diffSingle !== null && (
              <div className="calculation-detail">
                <p>Berechnung ({selectedCourseName}):</p>
                <span>
                  {courseHcpP1 > courseHcpP2 ? 
                    `Spielvorgabe P1 (${courseHcpP1}) - Spielvorgabe P2 (${courseHcpP2})` : 
                    `Spielvorgabe P2 (${courseHcpP2}) - Spielvorgabe P1 (${courseHcpP1})`} = {diffSingle}
                </span>
                <span>
                  {diffSingle} * 75% = {(diffSingle * 0.75).toFixed(2)} ➔ Gerundet: <strong>{matchplayVorgabeSingle}</strong>
                </span>
              </div>
            )}
            <div className="result-box">
              <p>Vorgabe: {receivingPlayerSingle}</p>
              <p className="result-value">{matchplayVorgabeSingle} {matchplayVorgabeSingle !== '---' && matchplayVorgabeSingle !== 0 ? (matchplayVorgabeSingle === 1 ? "Schlag" : "Schläge") : ""}</p>
            </div>
          </section>
        )}
        
        {appMode === 'team' && (
          <>
            <hr className="section-divider" />
            <PlayerInputSection playerNum={3} teamLabel="Team B" />
            <PlayerInputSection playerNum={4} teamLabel="Team B" />
            
            <section className="results-container team-handicap-display">
                <h3>Team Spielvorgaben ({selectedCourseName || 'Platz wählen'})</h3>
                <TeamHcpDetailDisplay 
                    teamLabel="Team A"
                    player1_ID_Label="Spieler 1" player1_HCPI={hcpInput1} player1_CourseHCP={courseHcpP1}
                    player2_ID_Label="Spieler 2" player2_HCPI={hcpInput2} player2_CourseHCP={courseHcpP2}
                    teamHcpTotal={teamAHandicap} 
                />
                <hr className="team-divider" />
                <TeamHcpDetailDisplay 
                    teamLabel="Team B"
                    player1_ID_Label="Spieler 3" player1_HCPI={hcpInput3} player1_CourseHCP={courseHcpP3}
                    player2_ID_Label="Spieler 4" player2_HCPI={hcpInput4} player2_CourseHCP={courseHcpP4}
                    teamHcpTotal={teamBHandicap}
                />
            </section>

            <section className="results-container team-matchplay-results">
              <h3>Team-Matchplay Vorgabe ({selectedCourseName || 'Platz wählen'})</h3>
              {teamAHandicap !== null && teamBHandicap !== null && teamDiff !== null && (
                <div className="calculation-detail">
                  <p>Berechnung Team-Vorgabe ({selectedCourseName}):</p>
                  <span>
                    |{teamAHandicap.toFixed(1)} (Team A) - {teamBHandicap.toFixed(1)} (Team B)| = {teamDiff.toFixed(1)}
                  </span>
                </div>
              )}
              <div className="result-box">
                <p>Vorgabe: {receivingTeam}</p>
                <p className="result-value">{matchplayVorgabeTeam} {matchplayVorgabeTeam !== '---' && matchplayVorgabeTeam !== 0 ? (matchplayVorgabeTeam === 1 ? "Schlag" : "Schläge") : ""}</p>
              </div>
            </section>
          </>
        )}
      </main>
      <footer className="App-footer">
        <p>Alle Angaben ohne Gewähr. Offizielle DGV-Regeln und lokale Platzregeln beachten.</p>
        {process.env.REACT_APP_BUILD_TIME && 
            <p className="build-time">
                Letzte Aktualisierung: {new Date(process.env.REACT_APP_BUILD_TIME).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + " Uhr"}
            </p>
        }
      </footer>
    </div>
  );
}

export default App;
