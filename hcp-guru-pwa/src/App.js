// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Dein bestehendes CSS
import { golfData } from './golfData'; 

// Funktion zur Berechnung des Course Handicaps mit der Formel
function calculateCourseHcpByFormula(hcpi, cr, sr, par) {
    if (isNaN(hcpi) || cr === undefined || sr === undefined || par === undefined) {
        return null; 
    }
    let slopeDivider = 113;
    if (par < 45) { // Schwelle für 9-Loch-Platz-Erkennung 
        slopeDivider = 113 / 2; 
    }
    const courseHandicapExact = hcpi * (sr / slopeDivider) + (cr - par);
    return Math.round(courseHandicapExact); 
}

const teeOptions = [
    { label: "Bitte wählen...", value: "", gender: null, color: null },
    { label: "Damen (rot)", value: "Damen_Rot", gender: "Damen", color: "Rot" },
    { label: "Herren (gelb)", value: "Herren_Gelb", gender: "Herren", color: "Gelb" },
    { label: "Damen (gelb)", value: "Damen_Gelb", gender: "Damen", color: "Gelb" },
    { label: "Herren (rot)", value: "Herren_Rot", gender: "Herren", color: "Rot" },
];

const defaultTeeValue = "Herren_Gelb"; 

function App() {
  const clubNames = Object.keys(golfData);
  const [selectedClubName, setSelectedClubName] = useState(clubNames[0] || "");
  
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedCoursePar, setSelectedCoursePar] = useState(null);

  const [appMode, setAppMode] = useState('single'); 

  const [selectedTee1, setSelectedTee1] = useState(defaultTeeValue);
  const [hcpInput1, setHcpInput1] = useState('');
  const [courseHcpP1, setCourseHcpP1] = useState(null);

  const [selectedTee2, setSelectedTee2] = useState(defaultTeeValue);
  const [hcpInput2, setHcpInput2] = useState('');
  const [courseHcpP2, setCourseHcpP2] = useState(null);

  const [selectedTee3, setSelectedTee3] = useState(defaultTeeValue);
  const [hcpInput3, setHcpInput3] = useState('');
  const [courseHcpP3, setCourseHcpP3] = useState(null);

  const [selectedTee4, setSelectedTee4] = useState(defaultTeeValue);
  const [hcpInput4, setHcpInput4] = useState('');
  const [courseHcpP4, setCourseHcpP4] = useState(null);

  const [matchplayVorgabeSingle, setMatchplayVorgabeSingle] = useState('---');
  const [receivingPlayerSingle, setReceivingPlayerSingle] = useState('');
  const [diffSingle, setDiffSingle] = useState(null); 

  const [teamAHandicap, setTeamAHandicap] = useState(null);
  const [teamBHandicap, setTeamBHandicap] = useState(null);

  const [matchplayVorgabeTeam, setMatchplayVorgabeTeam] = useState('---');
  const [receivingTeam, setReceivingTeam] = useState('');
  const [teamDiff, setTeamDiff] = useState(null); 

  const [buildTime, setBuildTime] = useState(''); // NEU: State für Build-Zeitstempel

  // NEU: Effekt zum Formatieren und Setzen des Build-Zeitstempels
  useEffect(() => {
    const buildTimestamp = process.env.REACT_APP_BUILD_TIME;
    if (buildTimestamp) {
      try {
        const date = new Date(buildTimestamp);
        // Formatieren des Datums, z.B. TT.MM.JJJJ HH:MM
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        setBuildTime(date.toLocaleString('de-DE', options) + " Uhr");
      } catch (e) {
        console.error("Error parsing build timestamp:", e);
        setBuildTime("N/A");
      }
    } else {
        setBuildTime("N/A");
    }
  }, []); // Leeres Abhängigkeitsarray, damit dies nur einmal beim Mounten ausgeführt wird


  useEffect(() => {
    if (selectedClubName && golfData[selectedClubName]) {
      const courses = Object.keys(golfData[selectedClubName]);
      setAvailableCourses(courses);
      if (courses.length > 0) {
        setSelectedCourseName(courses[0]);
      } else {
        setSelectedCourseName("");
      }
    } else {
      setAvailableCourses([]);
      setSelectedCourseName("");
    }
  }, [selectedClubName]);

  useEffect(() => {
    if (selectedClubName && selectedCourseName && selectedTee1) {
        const teeInfo = teeOptions.find(t => t.value === selectedTee1);
        if (teeInfo && teeInfo.gender && teeInfo.color) {
            const courseDetails = golfData[selectedClubName]?.[selectedCourseName]?.[teeInfo.gender]?.[teeInfo.color];
            if (courseDetails && typeof courseDetails.Par === 'number') {
                setSelectedCoursePar(courseDetails.Par);
            } else {
                setSelectedCoursePar(null);
            }
        } else {
            setSelectedCoursePar(null);
        }
    } else {
        setSelectedCoursePar(null);
    }
  }, [selectedClubName, selectedCourseName, selectedTee1]);

  const calculatePlayerCourseHcpAndUpdateState = (
    hcpInputString, 
    selectedTeeValue, 
    currentClubName,
    currentCourseName, 
    setCourseHcpState 
  ) => {
    if (!selectedTeeValue || hcpInputString === '' || !currentClubName || !currentCourseName) {
      setCourseHcpState(null); 
      return;
    }
    const hcpi = parseFloat(hcpInputString.replace(',', '.'));
    if (isNaN(hcpi)) {
      setCourseHcpState(null); 
      return;
    }

    const selectedOption = teeOptions.find(option => option.value === selectedTeeValue);
    if (!selectedOption || !selectedOption.gender || !selectedOption.color) {
      setCourseHcpState(null); 
      return;
    }
    const { gender, color } = selectedOption;

    try {
      const courseSpecificData = golfData[currentClubName]?.[currentCourseName]?.[gender]?.[color];
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

  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInput1, selectedTee1, selectedClubName, selectedCourseName, setCourseHcpP1); }, [hcpInput1, selectedTee1, selectedClubName, selectedCourseName]);
  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInput2, selectedTee2, selectedClubName, selectedCourseName, setCourseHcpP2); }, [hcpInput2, selectedTee2, selectedClubName, selectedCourseName]);
  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInput3, selectedTee3, selectedClubName, selectedCourseName, setCourseHcpP3); }, [hcpInput3, selectedTee3, selectedClubName, selectedCourseName]);
  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInput4, selectedTee4, selectedClubName, selectedCourseName, setCourseHcpP4); }, [hcpInput4, selectedTee4, selectedClubName, selectedCourseName]);

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

  const calculateTeamHandicap = (hcpPlayerA, hcpPlayerB) => {
    if (hcpPlayerA === null || hcpPlayerB === null) return null;
    const lowerHcp = Math.min(hcpPlayerA, hcpPlayerB);
    const higherHcp = Math.max(hcpPlayerA, hcpPlayerB);
    const teamHcp = (lowerHcp * 0.6) + (higherHcp * 0.4);
    return Math.round(teamHcp * 10) / 10; 
  };

  useEffect(() => {
    setTeamAHandicap(calculateTeamHandicap(courseHcpP1, courseHcpP2));
  }, [courseHcpP1, courseHcpP2]);

  useEffect(() => {
    setTeamBHandicap(calculateTeamHandicap(courseHcpP3, courseHcpP4));
  }, [courseHcpP3, courseHcpP4]);

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

  const PlayerHcpDisplay = ({ courseHcp, labelPrefix = "Spielvorgabe" }) => (
    <div className="player-course-hcp-display compact">
      <span>{labelPrefix} ({selectedCourseName || 'Platz wählen'}): <strong>{courseHcp !== null ? courseHcp : '-'}</strong></span>
    </div>
  );

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
                        <label htmlFor="course-select">Platz ({selectedCoursePar !== null ? `Par ${selectedCoursePar}` : 'Par ?'}):</label>
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

        <section className="player-section">
          <h2>Spieler 1 {appMode === 'team' && '(Team A)'}</h2>
          <div className="input-group">
            <label htmlFor="tee-select-p1">Abschlag Spieler 1:</label>
            <select id="tee-select-p1" value={selectedTee1} onChange={(e) => setSelectedTee1(e.target.value)}>
              {teeOptions.map(option => (<option key={`p1-${option.value || 'default'}`} value={option.value} disabled={option.value === ""}>{option.label}</option>))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="hcp-input-p1">HCPI Spieler 1:</label>
            <input 
              type="text" 
              inputMode="decimal"
              id="hcp-input-p1" 
              value={hcpInput1} 
              onChange={(e) => setHcpInput1(e.target.value)} 
              placeholder="z.B. 18.4 oder -2,5"
            />
          </div>
          <PlayerHcpDisplay courseHcp={courseHcpP1} />
        </section>

        <section className="player-section">
          <h2>Spieler 2 {appMode === 'team' && '(Team A)'}</h2>
          <div className="input-group">
            <label htmlFor="tee-select-p2">Abschlag Spieler 2:</label>
            <select id="tee-select-p2" value={selectedTee2} onChange={(e) => setSelectedTee2(e.target.value)}>
              {teeOptions.map(option => (<option key={`p2-${option.value || 'default'}`} value={option.value} disabled={option.value === ""}>{option.label}</option>))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="hcp-input-p2">HCPI Spieler 2:</label>
            <input 
              type="text" 
              inputMode="decimal"
              id="hcp-input-p2" 
              value={hcpInput2} 
              onChange={(e) => setHcpInput2(e.target.value)} 
              placeholder="z.B. 22.1 oder 5,0"
            />
          </div>
          <PlayerHcpDisplay courseHcp={courseHcpP2} />
        </section>

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
            <section className="player-section">
              <h2>Spieler 3 (Team B)</h2>
              <div className="input-group">
                <label htmlFor="tee-select-p3">Abschlag Spieler 3:</label>
                <select id="tee-select-p3" value={selectedTee3} onChange={(e) => setSelectedTee3(e.target.value)}>
                  {teeOptions.map(option => (<option key={`p3-${option.value || 'default'}`} value={option.value} disabled={option.value === ""}>{option.label}</option>))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="hcp-input-p3">HCPI Spieler 3:</label>
                <input 
                  type="text" 
                  inputMode="decimal"
                  id="hcp-input-p3" 
                  value={hcpInput3} 
                  onChange={(e) => setHcpInput3(e.target.value)} 
                  placeholder="z.B. 10.5 oder -1,0"
                />
              </div>
              <PlayerHcpDisplay courseHcp={courseHcpP3} />
            </section>

            <section className="player-section">
              <h2>Spieler 4 (Team B)</h2>
              <div className="input-group">
                <label htmlFor="tee-select-p4">Abschlag Spieler 4:</label>
                <select id="tee-select-p4" value={selectedTee4} onChange={(e) => setSelectedTee4(e.target.value)}>
                  {teeOptions.map(option => (<option key={`p4-${option.value || 'default'}`} value={option.value} disabled={option.value === ""}>{option.label}</option>))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="hcp-input-p4">HCPI Spieler 4:</label>
                <input 
                  type="text" 
                  inputMode="decimal"
                  id="hcp-input-p4" 
                  value={hcpInput4} 
                  onChange={(e) => setHcpInput4(e.target.value)} 
                  placeholder="z.B. 15.0 oder 3,2"
                />
              </div>
              <PlayerHcpDisplay courseHcp={courseHcpP4} />
            </section>

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
        <p>Alle Angaben ohne Gewähr.</p>
        {buildTime && <p className="build-time">Letzte Aktualisierung: {buildTime}</p>} {/* NEU */}
      </footer>
    </div>
  );
}

export default App;
