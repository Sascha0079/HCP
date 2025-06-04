// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Dein bestehendes CSS
import { golfData } from './golfData';

// Hilfsfunktion zum Finden des Course Handicaps (bleibt gleich)
function findCourseHcp(hcpi, handicapEntries) {
    if (isNaN(hcpi) || !handicapEntries || handicapEntries.length === 0) {
        return "N/A";
    }
    for (const entry of handicapEntries) {
        const rangeParts = entry.hcpi_range.split("–").map(s => s.trim());
        const minHcpi = parseFloat(rangeParts[0].replace(",", "."));
        const maxHcpi = rangeParts.length > 1 ? parseFloat(rangeParts[1].replace(",", ".")) : minHcpi;
        if (hcpi >= minHcpi && hcpi <= maxHcpi) {
            return entry.course_hcp;
        }
    }
    const firstEntry = handicapEntries[0];
    const lastEntry = handicapEntries[handicapEntries.length - 1];
    const firstRangeParts = firstEntry.hcpi_range.split("–").map(s => s.trim());
    const minPossible = parseFloat(firstRangeParts[0].replace(",","."));
    const lastRangeParts = lastEntry.hcpi_range.split("–").map(s => s.trim());
    const maxPossible = parseFloat(lastRangeParts[lastRangeParts.length -1].replace(",","."));
    if (hcpi < minPossible) return firstEntry.course_hcp;
    if (hcpi > maxPossible) return lastEntry.course_hcp;
    return "Außerh. Bereich";
}

const teeOptions = [
    { label: "Bitte wählen...", value: "", gender: null, color: null },
    { label: "Damen (rot)", value: "Damen_Rot", gender: "Damen", color: "Rot" },
    { label: "Herren (gelb)", value: "Herren_Gelb", gender: "Herren", color: "Gelb" },
    { label: "Damen (gelb)", value: "Damen_Gelb", gender: "Damen", color: "Gelb" },
    { label: "Herren (rot)", value: "Herren_Rot", gender: "Herren", color: "Rot" },
];

const CLUB_NAME = "Golfclub Schloß Horst (4533)";
const COURSE_18_HOLE = "Platz 1-18 AB";
const COURSE_9_HOLE = "Platz A 1-9";

function App() {
  const [appMode, setAppMode] = useState('single'); // 'single' oder 'team'

  // Spieler 1
  const [selectedTee1, setSelectedTee1] = useState(teeOptions[0].value);
  const [hcpInput1, setHcpInput1] = useState('');
  const [courseHcp18P1, setCourseHcp18P1] = useState(null);
  const [courseHcp9P1, setCourseHcp9P1] = useState(null);

  // Spieler 2
  const [selectedTee2, setSelectedTee2] = useState(teeOptions[0].value);
  const [hcpInput2, setHcpInput2] = useState('');
  const [courseHcp18P2, setCourseHcp18P2] = useState(null);
  const [courseHcp9P2, setCourseHcp9P2] = useState(null);

  // Spieler 3 (für Team)
  const [selectedTee3, setSelectedTee3] = useState(teeOptions[0].value);
  const [hcpInput3, setHcpInput3] = useState('');
  const [courseHcp18P3, setCourseHcp18P3] = useState(null);
  const [courseHcp9P3, setCourseHcp9P3] = useState(null);

  // Spieler 4 (für Team)
  const [selectedTee4, setSelectedTee4] = useState(teeOptions[0].value);
  const [hcpInput4, setHcpInput4] = useState('');
  const [courseHcp18P4, setCourseHcp18P4] = useState(null);
  const [courseHcp9P4, setCourseHcp9P4] = useState(null);

  // Einzel Matchplay Vorgabe
  const [matchplayVorgabe18Single, setMatchplayVorgabe18Single] = useState('---');
  const [matchplayVorgabe9Single, setMatchplayVorgabe9Single] = useState('---');
  const [receivingPlayer18Single, setReceivingPlayer18Single] = useState('');
  const [receivingPlayer9Single, setReceivingPlayer9Single] = useState('');
  const [diff18Single, setDiff18Single] = useState(null); 
  const [diff9Single, setDiff9Single] = useState(null);   


  // Team Handicaps
  const [teamAHandicap18, setTeamAHandicap18] = useState(null);
  const [teamAHandicap9, setTeamAHandicap9] = useState(null);
  const [teamBHandicap18, setTeamBHandicap18] = useState(null);
  const [teamBHandicap9, setTeamBHandicap9] = useState(null);

  // Team Matchplay Vorgabe
  const [matchplayVorgabe18Team, setMatchplayVorgabe18Team] = useState('---');
  const [matchplayVorgabe9Team, setMatchplayVorgabe9Team] = useState('---');
  const [receivingTeam18, setReceivingTeam18] = useState('');
  const [receivingTeam9, setReceivingTeam9] = useState('');
  const [teamDiff18, setTeamDiff18] = useState(null); // Für Detailanzeige Team-Matchplay
  const [teamDiff9, setTeamDiff9] = useState(null);   // Für Detailanzeige Team-Matchplay


  const calculatePlayerCourseHcp = (hcpInput, selectedTeeValue, setCourseHcp18, setCourseHcp9) => {
    if (!selectedTeeValue || hcpInput === '') {
      setCourseHcp18(null); setCourseHcp9(null); return;
    }
    const hcpi = parseFloat(hcpInput.replace(',', '.'));
    if (isNaN(hcpi)) {
      setCourseHcp18(null); setCourseHcp9(null); return;
    }
    const selectedOption = teeOptions.find(option => option.value === selectedTeeValue);
    if (!selectedOption || !selectedOption.gender || !selectedOption.color) {
      setCourseHcp18(null); setCourseHcp9(null); return;
    }
    const { gender, color } = selectedOption;
    try {
      const teeData18 = golfData[CLUB_NAME]?.[COURSE_18_HOLE]?.[gender]?.[color];
      const hcp18Val = teeData18?.handicaps ? findCourseHcp(hcpi, teeData18.handicaps) : null;
      setCourseHcp18(typeof hcp18Val === 'number' ? hcp18Val : null);

      const teeData9 = golfData[CLUB_NAME]?.[COURSE_9_HOLE]?.[gender]?.[color];
      const hcp9Val = teeData9?.handicaps ? findCourseHcp(hcpi, teeData9.handicaps) : null;
      setCourseHcp9(typeof hcp9Val === 'number' ? hcp9Val : null);
    } catch (error) {
      console.error("Error calculating course HCP:", error);
      setCourseHcp18(null); setCourseHcp9(null);
    }
  };

  useEffect(() => { calculatePlayerCourseHcp(hcpInput1, selectedTee1, setCourseHcp18P1, setCourseHcp9P1); }, [hcpInput1, selectedTee1]);
  useEffect(() => { calculatePlayerCourseHcp(hcpInput2, selectedTee2, setCourseHcp18P2, setCourseHcp9P2); }, [hcpInput2, selectedTee2]);
  useEffect(() => { calculatePlayerCourseHcp(hcpInput3, selectedTee3, setCourseHcp18P3, setCourseHcp9P3); }, [hcpInput3, selectedTee3]);
  useEffect(() => { calculatePlayerCourseHcp(hcpInput4, selectedTee4, setCourseHcp18P4, setCourseHcp9P4); }, [hcpInput4, selectedTee4]);

  // Effekt für Einzel-Matchplay-Vorgabe
  useEffect(() => {
    if (courseHcp18P1 !== null && courseHcp18P2 !== null) {
      const diff = Math.abs(courseHcp18P1 - courseHcp18P2);
      setDiff18Single(diff); 
      const strokes = Math.round(diff * 0.75); // Korrigierte Rundung: kaufmännisch
      setMatchplayVorgabe18Single(strokes);
      if (courseHcp18P1 > courseHcp18P2) setReceivingPlayer18Single('Spieler 1 erhält');
      else if (courseHcp18P2 > courseHcp18P1) setReceivingPlayer18Single('Spieler 2 erhält');
      else setReceivingPlayer18Single('Kein Spieler erhält');
    } else {
      setMatchplayVorgabe18Single('---'); setReceivingPlayer18Single(''); setDiff18Single(null);
    }

    if (courseHcp9P1 !== null && courseHcp9P2 !== null) {
      const diff = Math.abs(courseHcp9P1 - courseHcp9P2);
      setDiff9Single(diff); 
      const strokes = Math.round(diff * 0.75); // Korrigierte Rundung: kaufmännisch
      setMatchplayVorgabe9Single(strokes);
      if (courseHcp9P1 > courseHcp9P2) setReceivingPlayer9Single('Spieler 1 erhält');
      else if (courseHcp9P2 > courseHcp9P1) setReceivingPlayer9Single('Spieler 2 erhält');
      else setReceivingPlayer9Single('Kein Spieler erhält');
    } else {
      setMatchplayVorgabe9Single('---'); setReceivingPlayer9Single(''); setDiff9Single(null);
    }
  }, [courseHcp18P1, courseHcp18P2, courseHcp9P1, courseHcp9P2]);


  // Funktion zur Berechnung eines Team-Handicaps
  const calculateTeamHandicap = (hcpPlayerA, hcpPlayerB) => {
    if (hcpPlayerA === null || hcpPlayerB === null) return null;
    const lowerHcp = Math.min(hcpPlayerA, hcpPlayerB);
    const higherHcp = Math.max(hcpPlayerA, hcpPlayerB);
    const teamHcp = (lowerHcp * 0.6) + (higherHcp * 0.4);
    return Math.round(teamHcp * 10) / 10; 
  };

  // Effekt für Team A Handicap
  useEffect(() => {
    setTeamAHandicap18(calculateTeamHandicap(courseHcp18P1, courseHcp18P2));
    setTeamAHandicap9(calculateTeamHandicap(courseHcp9P1, courseHcp9P2));
  }, [courseHcp18P1, courseHcp18P2, courseHcp9P1, courseHcp9P2]);

  // Effekt für Team B Handicap
  useEffect(() => {
    setTeamBHandicap18(calculateTeamHandicap(courseHcp18P3, courseHcp18P4));
    setTeamBHandicap9(calculateTeamHandicap(courseHcp9P3, courseHcp9P4));
  }, [courseHcp18P3, courseHcp18P4, courseHcp9P3, courseHcp9P4]);

  // Effekt für Team-Matchplay-Vorgabe
  useEffect(() => {
    if (teamAHandicap18 !== null && teamBHandicap18 !== null) {
      const diff = Math.abs(teamAHandicap18 - teamBHandicap18);
      setTeamDiff18(diff); 
      const strokes = Math.round(diff); 
      setMatchplayVorgabe18Team(strokes);
      if (teamAHandicap18 > teamBHandicap18) setReceivingTeam18('Team A erhält');
      else if (teamBHandicap18 > teamAHandicap18) setReceivingTeam18('Team B erhält');
      else setReceivingTeam18('Kein Team erhält');
    } else {
      setMatchplayVorgabe18Team('---'); setReceivingTeam18(''); setTeamDiff18(null);
    }

    if (teamAHandicap9 !== null && teamBHandicap9 !== null) {
      const diff = Math.abs(teamAHandicap9 - teamBHandicap9);
      setTeamDiff9(diff); 
      const strokes = Math.round(diff); 
      setMatchplayVorgabe9Team(strokes);
      if (teamAHandicap9 > teamBHandicap9) setReceivingTeam9('Team A erhält');
      else if (teamBHandicap9 > teamAHandicap9) setReceivingTeam9('Team B erhält');
      else setReceivingTeam9('Kein Team erhält');
    } else {
      setMatchplayVorgabe9Team('---'); setReceivingTeam9(''); setTeamDiff9(null);
    }
  }, [teamAHandicap18, teamBHandicap18, teamAHandicap9, teamBHandicap9]);

  // Hilfskomponente für die kompakte Spielvorgabenanzeige
  const PlayerHcpDisplay = ({ hcp18, hcp9, labelPrefix = "Spielvorgabe" }) => (
    <div className="player-course-hcp-display compact">
      <span>{labelPrefix}: </span>
      <span className="hcp-value">18 Loch: <strong>{hcp18 !== null ? hcp18 : '-'}</strong></span>
      <span className="hcp-separator">|</span>
      <span className="hcp-value">9 Loch: <strong>{hcp9 !== null ? hcp9 : '-'}</strong></span>
    </div>
  );

  // Hilfskomponente für detaillierte Team-HCP-Anzeige
  const TeamHcpDetailDisplay = ({ 
    teamLabel, 
    player1_ID_Label, player1_HCPI, player1_CourseHCP,
    player2_ID_Label, player2_HCPI, player2_CourseHCP,
    teamHcpTotal, lochAnzahl 
  }) => {
    if (player1_CourseHCP === null || player2_CourseHCP === null) {
      return (
        <div className="team-detail-box">
          <h4>{teamLabel} ({lochAnzahl} Loch)</h4>
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
        <h4>{teamLabel} ({lochAnzahl} Loch)</h4>
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
        <h1>HCP Guru</h1>
      </header>
      <main>
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
            <input type="text" id="hcp-input-p1" value={hcpInput1} onChange={(e) => setHcpInput1(e.target.value)} placeholder="z.B. 18.4"/>
          </div>
          <PlayerHcpDisplay hcp18={courseHcp18P1} hcp9={courseHcp9P1} />
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
            <input type="text" id="hcp-input-p2" value={hcpInput2} onChange={(e) => setHcpInput2(e.target.value)} placeholder="z.B. 22.1"/>
          </div>
          <PlayerHcpDisplay hcp18={courseHcp18P2} hcp9={courseHcp9P2} />
        </section>

        {appMode === 'single' && (
          <section className="results-container single-matchplay-results">
            <h3>Einzel-Matchplay Vorgabe <br></br> (Spieler 1 vs Spieler 2)</h3>
            {courseHcp18P1 !== null && courseHcp18P2 !== null && diff18Single !== null && (
              <div className="calculation-detail">
                <p>Berechnung 18 Loch:</p>
                <span>
                  {courseHcp18P1 > courseHcp18P2 ? 
                    `Spielvorgabe P1 (${courseHcp18P1}) - Spielvorgabe P2 (${courseHcp18P2})` : 
                    `Spielvorgabe P2 (${courseHcp18P2}) - Spielvorgabe P1 (${courseHcp18P1})`} = {diff18Single}
                </span>
                <span>
                  {diff18Single} * 75% = {(diff18Single * 0.75).toFixed(2)} ➔ Gerundet: <strong>{matchplayVorgabe18Single}</strong>
                </span>
              </div>
            )}
            <div className="result-box">
              <p>18 Loch: {receivingPlayer18Single}</p>
              <p className="result-value">{matchplayVorgabe18Single} {matchplayVorgabe18Single !== '---' && matchplayVorgabe18Single !== 0 ? (matchplayVorgabe18Single === 1 ? "Schlag" : "Schläge") : ""}</p>
            </div>

            {courseHcp9P1 !== null && courseHcp9P2 !== null && diff9Single !== null && (
              <div className="calculation-detail">
                <p>Berechnung 9 Loch:</p>
                <span>
                  {courseHcp9P1 > courseHcp9P2 ? 
                    `Spielvorgabe P1 (${courseHcp9P1}) - Spielvorgabe P2 (${courseHcp9P2})` : 
                    `Spielvorgabe P2 (${courseHcp9P2}) - Spielvorgabe P1 (${courseHcp9P1})`} = {diff9Single}
                </span>
                <span>
                  {diff9Single} * 75% = {(diff9Single * 0.75).toFixed(2)} ➔ Gerundet: <strong>{matchplayVorgabe9Single}</strong>
                </span>
              </div>
            )}
            <div className="result-box">
              <p>9 Loch: {receivingPlayer9Single}</p>
              <p className="result-value">{matchplayVorgabe9Single} {matchplayVorgabe9Single !== '---' && matchplayVorgabe9Single !== 0 ? (matchplayVorgabe9Single === 1 ? "Schlag" : "Schläge") : ""}</p>
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
                <input type="text" id="hcp-input-p3" value={hcpInput3} onChange={(e) => setHcpInput3(e.target.value)} placeholder="z.B. 10.5"/>
              </div>
              <PlayerHcpDisplay hcp18={courseHcp18P3} hcp9={courseHcp9P3} />
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
                <input type="text" id="hcp-input-p4" value={hcpInput4} onChange={(e) => setHcpInput4(e.target.value)} placeholder="z.B. 15.0"/>
              </div>
              <PlayerHcpDisplay hcp18={courseHcp18P4} hcp9={courseHcp9P4} />
            </section>

            <section className="results-container team-handicap-display">
                <h3>Team Spielvorgaben</h3>
                <TeamHcpDetailDisplay 
                    teamLabel="Team A"
                    player1_ID_Label="Spieler 1" player1_HCPI={hcpInput1} player1_CourseHCP={courseHcp18P1}
                    player2_ID_Label="Spieler 2" player2_HCPI={hcpInput2} player2_CourseHCP={courseHcp18P2}
                    teamHcpTotal={teamAHandicap18} lochAnzahl={18}
                />
                <TeamHcpDetailDisplay 
                    teamLabel="Team A"
                    player1_ID_Label="Spieler 1" player1_HCPI={hcpInput1} player1_CourseHCP={courseHcp9P1}
                    player2_ID_Label="Spieler 2" player2_HCPI={hcpInput2} player2_CourseHCP={courseHcp9P2}
                    teamHcpTotal={teamAHandicap9} lochAnzahl={9}
                />
                <hr className="team-divider" />
                <TeamHcpDetailDisplay 
                    teamLabel="Team B"
                    player1_ID_Label="Spieler 3" player1_HCPI={hcpInput3} player1_CourseHCP={courseHcp18P3}
                    player2_ID_Label="Spieler 4" player2_HCPI={hcpInput4} player2_CourseHCP={courseHcp18P4}
                    teamHcpTotal={teamBHandicap18} lochAnzahl={18}
                />
                <TeamHcpDetailDisplay 
                    teamLabel="Team B"
                    player1_ID_Label="Spieler 3" player1_HCPI={hcpInput3} player1_CourseHCP={courseHcp9P3}
                    player2_ID_Label="Spieler 4" player2_HCPI={hcpInput4} player2_CourseHCP={courseHcp9P4}
                    teamHcpTotal={teamBHandicap9} lochAnzahl={9}
                />
            </section>

            <section className="results-container team-matchplay-results">
              <h3>Team-Matchplay Vorgabe <br></br> (Team A vs Team B)</h3>
              {teamAHandicap18 !== null && teamBHandicap18 !== null && teamDiff18 !== null && (
                <div className="calculation-detail">
                  <p>Berechnung 18 Loch Team-Vorgabe:</p>
                  <span>
                    |{teamAHandicap18.toFixed(1)} (Team A) - {teamBHandicap18.toFixed(1)} (Team B)| = {teamDiff18.toFixed(1)}
                  </span>
                </div>
              )}
              <div className="result-box">
                <p>18 Loch: {receivingTeam18}</p>
                <p className="result-value">{matchplayVorgabe18Team} {matchplayVorgabe18Team !== '---' && matchplayVorgabe18Team !== 0 ? (matchplayVorgabe18Team === 1 ? "Schlag" : "Schläge") : ""}</p>
              </div>

              {teamAHandicap9 !== null && teamBHandicap9 !== null && teamDiff9 !== null && (
                <div className="calculation-detail">
                  <p>Berechnung 9 Loch Team-Vorgabe:</p>
                  <span>
                    |{teamAHandicap9.toFixed(1)} (Team A) - {teamBHandicap9.toFixed(1)} (Team B)| = {teamDiff9.toFixed(1)}
                  </span>
                </div>
              )}
              <div className="result-box">
                <p>9 Loch: {receivingTeam9}</p>
                <p className="result-value">{matchplayVorgabe9Team} {matchplayVorgabe9Team !== '---' && matchplayVorgabe9Team !== 0 ? (matchplayVorgabe9Team === 1 ? "Schlag" : "Schläge") : ""}</p>
              </div>
            </section>
          </>
        )}
      </main>
      <footer className="App-footer">
        <p>Alle Angaben ohne Gewähr.</p>
      </footer>
    </div>
  );
}

export default App;
