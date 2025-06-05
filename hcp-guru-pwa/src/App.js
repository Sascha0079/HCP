// src/App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css'; 
import { golfData } from './golfData'; 

// Funktion zur Berechnung des Course Handicaps mit der Formel
function calculateCourseHcpByFormula(hcpi, cr, sr, par) {
    if (isNaN(hcpi) || cr === undefined || sr === undefined || par === undefined) {
        return null; 
    }
    let slopeDivider = 113;
    if (par < 60) { 
        slopeDivider = 113 * 2; 
    }
    const courseHandicapExact = hcpi * (sr / slopeDivider) + (cr - par);
    return Math.round(courseHandicapExact); 
}

const genderOptions = [
    { label: "Herren", value: "Herren", icon: "" }, // NEU: Icon hinzugefügt
    { label: "Damen", value: "Damen", icon: "" },   // NEU: Icon hinzugefügt
];
const defaultGender = "Herren";

// Für HCP Picker
const hcpiIntegerOptions = Array.from({ length: 54 - (-9) + 1 }, (_, i) => -9 + i); // Erzeugt Array von -9 bis 54
const hcpiDecimalOptions = Array.from({ length: 10 }, (_, i) => i); // Erzeugt Array von 0 bis 9


// Farb-Mapping für Tee-Anzeige
const teeColorVisuals = {
    "Rot": { emoji: "🟥", colorClass: "tee-color-red" },
    "Gelb": { emoji: "🟨", colorClass: "tee-color-yellow" },
    "Blau": { emoji: "🟦", colorClass: "tee-color-blue" },
    "Weiss": { emoji: "⬜", colorClass: "tee-color-white" },
    "Schwarz": { emoji: "⬛", colorClass: "tee-color-black" },
};

// --- NEUE WheelPicker Komponente ---
const WheelPicker = ({ options, value, onChange, itemHeight = 40, label, idPrefix }) => {
    const wheelRef = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);
    let scrollTimeout = useRef(null);

    // Scrollt zum initialen Wert oder wenn sich der Wert programmatisch ändert
    useEffect(() => {
        if (wheelRef.current && value !== undefined && options.length > 0 && !isScrolling) {
            const selectedIndex = options.indexOf(value);
            if (selectedIndex !== -1) {
                wheelRef.current.scrollTop = selectedIndex * itemHeight;
            } else {
                 // Fallback, falls der Wert nicht in den Optionen ist (z.B. initial)
                const firstValidIndex = options.indexOf(options.find(opt => opt !== undefined));
                if (firstValidIndex !== -1) {
                    wheelRef.current.scrollTop = firstValidIndex * itemHeight;
                }
            }
        }
    }, [value, options, itemHeight, isScrolling]);

    const handleScroll = useCallback(() => {
        setIsScrolling(true);
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }
        scrollTimeout.current = setTimeout(() => {
            if (wheelRef.current) {
                const scrollTop = wheelRef.current.scrollTop;
                const index = Math.round(scrollTop / itemHeight);
                const selectedOption = options[index];
                if (selectedOption !== undefined && selectedOption !== value) {
                    onChange(selectedOption);
                }
            }
            setIsScrolling(false);
        }, 150); // Kurze Verzögerung, um den Wert nach dem Scroll-Snap zu erhalten
    }, [itemHeight, options, onChange, value]);

    return (
        <div className="wheel-picker-wrapper">
            {label && <label htmlFor={`${idPrefix}-wheel`} className="wheel-label">{label}</label>}
            <div 
                id={`${idPrefix}-wheel`}
                className="wheel" 
                ref={wheelRef} 
                onScroll={handleScroll}
                style={{ height: `${itemHeight * 3}px` }} // Zeigt z.B. 3 Elemente sichtbar
            >
                {/* Leere Elemente für Padding, um das erste und letzte Element in die Mitte scrollen zu können */}
                <div className="wheel-item wheel-padding" style={{ height: `${itemHeight}px` }}></div>
                {options.map((option, index) => (
                    <div 
                        key={`${idPrefix}-${index}-${option}`} 
                        className={`wheel-item ${option === value ? 'selected' : ''}`}
                        style={{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }}
                    >
                        {option}
                    </div>
                ))}
                <div className="wheel-item wheel-padding" style={{ height: `${itemHeight}px` }}></div>
            </div>
        </div>
    );
};


function App() {
  const clubNames = Object.keys(golfData);
  const [selectedClubName, setSelectedClubName] = useState(clubNames[0] || "");
  
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedCourseParForDisplay, setSelectedCourseParForDisplay] = useState(null);

  const [appMode, setAppMode] = useState('single'); 

  // Spieler States (HCP-Teile für WheelPicker)
  const [selectedGenderP1, setSelectedGenderP1] = useState(defaultGender);
  const [availableTeesP1, setAvailableTeesP1] = useState([]);
  const [selectedTeeColorP1, setSelectedTeeColorP1] = useState("");
  const [hcpInputWholeP1, setHcpInputWholeP1] = useState(18); 
  const [hcpInputDecimalP1, setHcpInputDecimalP1] = useState(0); 
  const [hcpInputStringP1, setHcpInputStringP1] = useState("18.0"); 
  const [courseHcpP1, setCourseHcpP1] = useState(null);

  const [selectedGenderP2, setSelectedGenderP2] = useState(defaultGender);
  const [availableTeesP2, setAvailableTeesP2] = useState([]);
  const [selectedTeeColorP2, setSelectedTeeColorP2] = useState("");
  const [hcpInputWholeP2, setHcpInputWholeP2] = useState(24);
  const [hcpInputDecimalP2, setHcpInputDecimalP2] = useState(0);
  const [hcpInputStringP2, setHcpInputStringP2] = useState("24.0");
  const [courseHcpP2, setCourseHcpP2] = useState(null);

  const [selectedGenderP3, setSelectedGenderP3] = useState(defaultGender);
  const [availableTeesP3, setAvailableTeesP3] = useState([]);
  const [selectedTeeColorP3, setSelectedTeeColorP3] = useState("");
  const [hcpInputWholeP3, setHcpInputWholeP3] = useState(10);
  const [hcpInputDecimalP3, setHcpInputDecimalP3] = useState(0);
  const [hcpInputStringP3, setHcpInputStringP3] = useState("10.0");
  const [courseHcpP3, setCourseHcpP3] = useState(null);

  const [selectedGenderP4, setSelectedGenderP4] = useState(defaultGender);
  const [availableTeesP4, setAvailableTeesP4] = useState([]);
  const [selectedTeeColorP4, setSelectedTeeColorP4] = useState("");
  const [hcpInputWholeP4, setHcpInputWholeP4] = useState(15);
  const [hcpInputDecimalP4, setHcpInputDecimalP4] = useState(0);
  const [hcpInputStringP4, setHcpInputStringP4] = useState("15.0");
  const [courseHcpP4, setCourseHcpP4] = useState(null);

  const [matchplayVorgabeSingle, setMatchplayVorgabeSingle] = useState('---');
  const [receivingPlayerSingle, setReceivingPlayerSingle] = useState('');
  const [diffSingle, setDiffSingle] = useState(null); 
  const [teamAHandicap, setTeamAHandicap] = useState(null);
  const [teamBHandicap, setTeamBHandicap] = useState(null);
  const [matchplayVorgabeTeam, setMatchplayVorgabeTeam] = useState('---');
  const [receivingTeam, setReceivingTeam] = useState('');
  const [teamDiff, setTeamDiff] = useState(null); 

  useEffect(() => { setHcpInputStringP1(`${hcpInputWholeP1}.${hcpInputDecimalP1}`); }, [hcpInputWholeP1, hcpInputDecimalP1]);
  useEffect(() => { setHcpInputStringP2(`${hcpInputWholeP2}.${hcpInputDecimalP2}`); }, [hcpInputWholeP2, hcpInputDecimalP2]);
  useEffect(() => { setHcpInputStringP3(`${hcpInputWholeP3}.${hcpInputDecimalP3}`); }, [hcpInputWholeP3, hcpInputDecimalP3]);
  useEffect(() => { setHcpInputStringP4(`${hcpInputWholeP4}.${hcpInputDecimalP4}`); }, [hcpInputWholeP4, hcpInputDecimalP4]);

  useEffect(() => {
    if (selectedClubName && golfData[selectedClubName]) {
      const courses = Object.keys(golfData[selectedClubName]);
      setAvailableCourses(courses);
      if (courses.length > 0) {setSelectedCourseName(courses[0]);} else {setSelectedCourseName("");}
    } else {setAvailableCourses([]); setSelectedCourseName("");}
  }, [selectedClubName]);

  const updateAvailableTeesForPlayer = (club, course, gender, setAvailableTeesFunc, setSelectedTeeColorFunc) => {
    if (club && course && gender && golfData[club]?.[course]?.[gender]) {
      const teeColors = Object.keys(golfData[club][course][gender]);
      setAvailableTeesFunc(teeColors);
      setSelectedTeeColorFunc(teeColors[0] || ""); 
    } else {setAvailableTeesFunc([]); setSelectedTeeColorFunc("");}
  };

  useEffect(() => { updateAvailableTeesForPlayer(selectedClubName, selectedCourseName, selectedGenderP1, setAvailableTeesP1, setSelectedTeeColorP1); }, [selectedClubName, selectedCourseName, selectedGenderP1]);
  useEffect(() => { updateAvailableTeesForPlayer(selectedClubName, selectedCourseName, selectedGenderP2, setAvailableTeesP2, setSelectedTeeColorP2); }, [selectedClubName, selectedCourseName, selectedGenderP2]);
  useEffect(() => { updateAvailableTeesForPlayer(selectedClubName, selectedCourseName, selectedGenderP3, setAvailableTeesP3, setSelectedTeeColorP3); }, [selectedClubName, selectedCourseName, selectedGenderP3]);
  useEffect(() => { updateAvailableTeesForPlayer(selectedClubName, selectedCourseName, selectedGenderP4, setAvailableTeesP4, setSelectedTeeColorP4); }, [selectedClubName, selectedCourseName, selectedGenderP4]);
  
  useEffect(() => {
      if (selectedClubName && selectedCourseName && availableTeesP1.length > 0 && selectedGenderP1) {
          let firstTeeColorToUse = selectedTeeColorP1;
          if (!availableTeesP1.includes(selectedTeeColorP1) && availableTeesP1.length > 0) {firstTeeColorToUse = availableTeesP1[0];}
          const courseDetails = golfData[selectedClubName]?.[selectedCourseName]?.[selectedGenderP1]?.[firstTeeColorToUse];
          if (courseDetails && typeof courseDetails.Par === 'number') {setSelectedCourseParForDisplay(courseDetails.Par);} else {setSelectedCourseParForDisplay(null);}
      } else {setSelectedCourseParForDisplay(null);}
  }, [selectedClubName, selectedCourseName, selectedGenderP1, selectedTeeColorP1, availableTeesP1]);

  const calculatePlayerCourseHcpAndUpdateState = (hcpInputStr, gender, teeColor, currentClubName, currentCourseName, setCourseHcpState ) => {
    if (!gender || !teeColor || hcpInputStr === '' || !currentClubName || !currentCourseName) {setCourseHcpState(null); return;}
    const hcpi = parseFloat(hcpInputStr.replace(',', '.'));
    if (isNaN(hcpi)) {setCourseHcpState(null); return;}
    try {
      const courseSpecificData = golfData[currentClubName]?.[currentCourseName]?.[gender]?.[teeColor];
      if (courseSpecificData) {
        const { CR, SR, Par } = courseSpecificData;
        const ch = calculateCourseHcpByFormula(hcpi, CR, SR, Par);
        setCourseHcpState(ch);
      } else {setCourseHcpState(null); }
    } catch (error) {console.error("Error calculating course HCP with formula:", error);setCourseHcpState(null); }
  };

  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInputStringP1, selectedGenderP1, selectedTeeColorP1, selectedClubName, selectedCourseName, setCourseHcpP1); }, [hcpInputStringP1, selectedGenderP1, selectedTeeColorP1, selectedClubName, selectedCourseName]);
  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInputStringP2, selectedGenderP2, selectedTeeColorP2, selectedClubName, selectedCourseName, setCourseHcpP2); }, [hcpInputStringP2, selectedGenderP2, selectedTeeColorP2, selectedClubName, selectedCourseName]);
  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInputStringP3, selectedGenderP3, selectedTeeColorP3, selectedClubName, selectedCourseName, setCourseHcpP3); }, [hcpInputStringP3, selectedGenderP3, selectedTeeColorP3, selectedClubName, selectedCourseName]);
  useEffect(() => { calculatePlayerCourseHcpAndUpdateState(hcpInputStringP4, selectedGenderP4, selectedTeeColorP4, selectedClubName, selectedCourseName, setCourseHcpP4); }, [hcpInputStringP4, selectedGenderP4, selectedTeeColorP4, selectedClubName, selectedCourseName]);

  useEffect(() => {
    if (courseHcpP1 !== null && courseHcpP2 !== null) {
      const diff = Math.abs(courseHcpP1 - courseHcpP2); setDiffSingle(diff); 
      const strokes = Math.round(diff * 0.75); setMatchplayVorgabeSingle(strokes);
      if (courseHcpP1 > courseHcpP2) setReceivingPlayerSingle('Spieler 1 erhält');
      else if (courseHcpP2 > courseHcpP1) setReceivingPlayerSingle('Spieler 2 erhält');
      else setReceivingPlayerSingle('Kein Spieler erhält');
    } else {setMatchplayVorgabeSingle('---'); setReceivingPlayerSingle(''); setDiffSingle(null);}
  }, [courseHcpP1, courseHcpP2]);

  const calculateTeamHandicap = (hcpPlayerA, hcpPlayerB) => {
    if (hcpPlayerA === null || hcpPlayerB === null) return null;
    const lowerHcp = Math.min(hcpPlayerA, hcpPlayerB); const higherHcp = Math.max(hcpPlayerA, hcpPlayerB);
    const teamHcp = (lowerHcp * 0.6) + (higherHcp * 0.4); return Math.round(teamHcp * 10) / 10; 
  };
  useEffect(() => { setTeamAHandicap(calculateTeamHandicap(courseHcpP1, courseHcpP2)); }, [courseHcpP1, courseHcpP2]);
  useEffect(() => { setTeamBHandicap(calculateTeamHandicap(courseHcpP3, courseHcpP4)); }, [courseHcpP3, courseHcpP4]);

  useEffect(() => {
    if (teamAHandicap !== null && teamBHandicap !== null) {
      const diff = Math.abs(teamAHandicap - teamBHandicap);setTeamDiff(diff); 
      const strokes = Math.round(diff); setMatchplayVorgabeTeam(strokes);
      if (teamAHandicap > teamBHandicap) setReceivingTeam('Team A erhält');
      else if (teamBHandicap > teamAHandicap) setReceivingTeam('Team B erhält');
      else setReceivingTeam('Kein Team erhält');
    } else {setMatchplayVorgabeTeam('---'); setReceivingTeam(''); setTeamDiff(null);}
  }, [teamAHandicap, teamBHandicap]);

  const PlayerHcpDisplay = ({ courseHcp, labelPrefix = "Spielvorgabe" }) => (
    <div className="player-course-hcp-display compact">
      <span>{labelPrefix} ({selectedCourseName || 'Platz wählen'}): <strong>{courseHcp !== null ? courseHcp : '-'}</strong></span>
    </div>
  );

  const TeamHcpDetailDisplay = ({ teamLabel, player1_ID_Label, player1_HCP_String, player1_CourseHCP, player2_ID_Label, player2_HCP_String, player2_CourseHCP, teamHcpTotal}) => {
    if (player1_CourseHCP === null || player2_CourseHCP === null) {return ( <div className="team-detail-box"><h4>{teamLabel} ({selectedCourseName || 'Platz wählen'})</h4><p>Spielerdaten unvollständig.</p><div className="team-total-hcp"><span>Team-Vorgabe: </span><span className="result-value">---</span></div></div>); }
    const p1ActualHcpString = player1_HCP_String || "N/A"; const p2ActualHcpString = player2_HCP_String || "N/A";
    const isP1CourseLower = player1_CourseHCP <= player2_CourseHCP;
    const playerLower = {idLabel: isP1CourseLower ? player1_ID_Label : player2_ID_Label, hcp: isP1CourseLower ? p1ActualHcpString : p2ActualHcpString, courseHcp: isP1CourseLower ? player1_CourseHCP : player2_CourseHCP, percent: 60};
    const playerHigher = {idLabel: isP1CourseLower ? player2_ID_Label : player1_ID_Label, hcp: isP1CourseLower ? p2ActualHcpString : p1ActualHcpString, courseHcp: isP1CourseLower ? player2_CourseHCP : player1_CourseHCP, percent: 40};
    const lowerContrib = playerLower.courseHcp * (playerLower.percent / 100); const higherContrib = playerHigher.courseHcp * (playerHigher.percent / 100);
    return (<div className="team-detail-box"><h4>{teamLabel} ({selectedCourseName || 'Platz wählen'})</h4><div className="player-contribution"><span>{playerLower.idLabel} ({playerLower.hcp}): Vorgabe {playerLower.courseHcp} * {playerLower.percent}% = <strong>{lowerContrib.toFixed(1)}</strong></span></div><div className="player-contribution"><span>{playerHigher.idLabel} ({playerHigher.hcp}): Vorgabe {playerHigher.courseHcp} * {playerHigher.percent}% = <strong>{higherContrib.toFixed(1)}</strong></span></div><div className="team-total-hcp"><span>Team-Vorgabe: </span><span className="result-value">{teamHcpTotal !== null ? teamHcpTotal.toFixed(1) : '---'}</span></div></div>);
  };

  const PlayerInputSection = ({ playerNum, teamLabel = "", selectedGender, setSelectedGender, availableTees, selectedTeeColor, setSelectedTeeColor, hcpInputWhole, setHcpInputWhole, hcpInputDecimal, setHcpInputDecimal, courseHcp }) => {
    return (
        <section className="player-section">
          <h2>Spieler {playerNum} {appMode === 'team' && `(${teamLabel})`}</h2>
          <div className="player-input-grid"> {/* NEUER Grid-Container */}
                  
                  {/* Zeile 1: Geschlecht */}
                  <label className="input-label">Geschlecht:</label>
                  <div className="input-control"> {/* Container für die Controls in der rechten Spalte */}
                    <div className="gender-radio-group"> {/* Behält die Radio-Gruppierung */}
                      <div className="radio-options">
                          {genderOptions.map(option => (
                          <label key={`p${playerNum}-gender-${option.value}`} className="radio-label">
                            <input 
                              type="radio" 
                              name={`gender-p${playerNum}`} 
                              value={option.value}
                              checked={selectedGender === option.value}
                              onChange={(e) => setSelectedGender(e.target.value)}
                            />
                            <span className="gender-icon">{option.icon}</span>
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
              

                  <label htmlFor={`tee-select-p${playerNum}`} className="input-label">Abschlag:</label>
                  <div className="input-control">
                    <div className="tee-color-select-group"> 
                        <select id={`tee-select-p${playerNum}`} value={selectedTeeColor} onChange={(e) => setSelectedTeeColor(e.target.value)} disabled={availableTees.length === 0}>
                          {availableTees.length === 0 && <option value="">- Geschlecht wählen -</option>}
                          {availableTees.map(teeColor => (<option key={`p${playerNum}-tee-${teeColor}`} value={teeColor}><span className={`tee-color-indicator ${teeColorVisuals[teeColor]?.colorClass || ''}`}>{teeColorVisuals[teeColor]?.emoji || " "}</span> {teeColor}</option>))}
                        </select>
                    </div>
                </div>        

                <label className="input-label">HCP:</label>
                  <div className="input-control">
                    <div className="hcp-pickers"> {/* Behält die Picker-Gruppierung */}
                      <WheelPicker 
                          options={hcpiIntegerOptions}
                          value={hcpInputWhole}
                          onChange={setHcpInputWhole}
                          itemHeight={30} // Höhe pro Item im Wheel
                          idPrefix={`p${playerNum}-hcp-whole`}
                      />
                      <span className="hcp-decimal-separator">.</span>
                      <WheelPicker 
                          options={hcpiDecimalOptions}
                          value={hcpInputDecimal}
                          onChange={setHcpInputDecimal}
                          itemHeight={30}
                          idPrefix={`p${playerNum}-hcp-decimal`}
                      />
                    </div>
                  </div>
                
          </div>
          <PlayerHcpDisplay courseHcp={courseHcp} />
        </section>
    );

    
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <div className="global-controls">
            <div className="selectors-row"> 
                <div className="input-group club-selector-group"><label htmlFor="club-select">Golfclub:</label><select id="club-select" value={selectedClubName} onChange={(e) => setSelectedClubName(e.target.value)}>{clubNames.map(club => (<option key={club} value={club}>{club}</option>))}</select></div>
                {availableCourses.length > 0 && (<div className="input-group course-selector-group"><label htmlFor="course-select">Platz ({selectedCourseParForDisplay !== null ? `Par ${selectedCourseParForDisplay}` : 'Par ?'}):</label><select id="course-select" value={selectedCourseName} onChange={(e) => setSelectedCourseName(e.target.value)}>{availableCourses.map(course => (<option key={course} value={course}>{course}</option>))}</select></div>)}
            </div> 
            <div className="mode-selector modern-tabs"><button className={`tab-button ${appMode === 'single' ? 'active' : ''}`} onClick={() => setAppMode('single')}>Einzel</button><button className={`tab-button ${appMode === 'team' ? 'active' : ''}`} onClick={() => setAppMode('team')}>Team</button></div>
        </div>
        <PlayerInputSection playerNum={1} teamLabel="Team A" selectedGender={selectedGenderP1} setSelectedGender={setSelectedGenderP1} availableTees={availableTeesP1} selectedTeeColor={selectedTeeColorP1} setSelectedTeeColor={setSelectedTeeColorP1} hcpInputWhole={hcpInputWholeP1} setHcpInputWhole={setHcpInputWholeP1} hcpInputDecimal={hcpInputDecimalP1} setHcpInputDecimal={setHcpInputDecimalP1} courseHcp={courseHcpP1}/>
        <PlayerInputSection playerNum={2} teamLabel="Team A" selectedGender={selectedGenderP2} setSelectedGender={setSelectedGenderP2} availableTees={availableTeesP2} selectedTeeColor={selectedTeeColorP2} setSelectedTeeColor={setSelectedTeeColorP2} hcpInputWhole={hcpInputWholeP2} setHcpInputWhole={setHcpInputWholeP2} hcpInputDecimal={hcpInputDecimalP2} setHcpInputDecimal={setHcpInputDecimalP2} courseHcp={courseHcpP2}/>
        {appMode === 'single' && (
          <section className="results-container single-matchplay-results">
            <h3>Einzel-Matchplay Vorgabe ({selectedCourseName || 'Platz wählen'})</h3>
            {courseHcpP1 !== null && courseHcpP2 !== null && diffSingle !== null && (<div className="calculation-detail"><p>Berechnung ({selectedCourseName}):</p><span>{courseHcpP1 > courseHcpP2 ? `Spieler 1 (${courseHcpP1}) - Spieler 2 (${courseHcpP2})` : `Spieler 2 (${courseHcpP2}) - Spieler 1 (${courseHcpP1})`} = {diffSingle}</span><span>{diffSingle} * 75% = {(diffSingle * 0.75).toFixed(2)} ➔ Gerundet: <strong>{matchplayVorgabeSingle}</strong></span></div>)}
            <div className="result-box"><p>Vorgabe: {receivingPlayerSingle}</p><p className="result-value">{matchplayVorgabeSingle} {matchplayVorgabeSingle !== '---' && matchplayVorgabeSingle !== 0 ? (matchplayVorgabeSingle === 1 ? "Schlag" : "Schläge") : ""}</p></div>
          </section>
        )}
        {appMode === 'team' && (
          <><hr className="section-divider" />
            <PlayerInputSection playerNum={3} teamLabel="Team B" selectedGender={selectedGenderP3} setSelectedGender={setSelectedGenderP3} availableTees={availableTeesP3} selectedTeeColor={selectedTeeColorP3} setSelectedTeeColor={setSelectedTeeColorP3} hcpInputWhole={hcpInputWholeP3} setHcpInputWhole={setHcpInputWholeP3} hcpInputDecimal={hcpInputDecimalP3} setHcpInputDecimal={setHcpInputDecimalP3} courseHcp={courseHcpP3}/>
            <PlayerInputSection playerNum={4} teamLabel="Team B" selectedGender={selectedGenderP4} setSelectedGender={setSelectedGenderP4} availableTees={availableTeesP4} selectedTeeColor={selectedTeeColorP4} setSelectedTeeColor={setSelectedTeeColorP4} hcpInputWhole={hcpInputWholeP4} setHcpInputWhole={setHcpInputWholeP4} hcpInputDecimal={hcpInputDecimalP4} setHcpInputDecimal={setHcpInputDecimalP4} courseHcp={courseHcpP4}/>
            <section className="results-container team-handicap-display">
                <h3>Team Vorgaben ({selectedCourseName || 'Platz wählen'})</h3>
                <TeamHcpDetailDisplay teamLabel="Team A" player1_ID_Label="Spieler 1" player1_HCP_String={hcpInputStringP1} player1_CourseHCP={courseHcpP1} player2_ID_Label="Spieler 2" player2_HCP_String={hcpInputStringP2} player2_CourseHCP={courseHcpP2} teamHcpTotal={teamAHandicap} />
                <hr className="team-divider" />
                <TeamHcpDetailDisplay teamLabel="Team B" player1_ID_Label="Spieler 3" player1_HCP_String={hcpInputStringP3} player1_CourseHCP={courseHcpP3} player2_ID_Label="Spieler 4" player2_HCP_String={hcpInputStringP4} player2_CourseHCP={courseHcpP4} teamHcpTotal={teamBHandicap}/>
            </section>
            <section className="results-container team-matchplay-results">
              <h3>Matchplay Vorgabe</h3>
              {teamAHandicap !== null && teamBHandicap !== null && teamDiff !== null && (<div className="calculation-detail"><p>Berechnung</p><span>|{teamAHandicap.toFixed(1)} (Team A) - {teamBHandicap.toFixed(1)} (Team B)| = {teamDiff.toFixed(1)}</span></div>)}
              <div className="result-box"><p>Vorgabe: {receivingTeam}</p><p className="result-value">{matchplayVorgabeTeam} {matchplayVorgabeTeam !== '---' && matchplayVorgabeTeam !== 0 ? (matchplayVorgabeTeam === 1 ? "Schlag" : "Schläge") : ""}</p></div>
            </section>
          </>
        )}
      </main>
      <footer className="App-footer">
        <p>Alle Angaben ohne Gewähr. Offizielle DGV-Regeln, lokale Vorgaben beachten.</p>
        {process.env.REACT_APP_BUILD_TIME && <p className="build-time">Letzte Aktualisierung: {new Date(process.env.REACT_APP_BUILD_TIME).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + " Uhr"}</p>}
      </footer>
    </div>
  );
}
export default App;
