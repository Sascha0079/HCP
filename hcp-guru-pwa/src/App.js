// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Standard-CSS-Datei von create-react-app für Styling
import { golfData } from './golfData'; // Stelle sicher, dass der Pfad stimmt

// Deine findCourseHcp Funktion (entweder hier oder importiert)
// Beispiel:
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
    // Fallback-Logik (optional, wie zuvor besprochen)
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

// Definiere deine teeOptions hier (angepasst für Web)
const teeOptions = [
    { label: "Bitte wählen...", value: "", gender: null, color: null }, // value als String für <select>
    { label: "Damen (rot)", value: "Damen_Rot", gender: "Damen", color: "Rot" },
    { label: "Herren (gelb)", value: "Herren_Gelb", gender: "Herren", color: "Gelb" },
    { label: "Damen (gelb)", value: "Damen_Gelb", gender: "Damen", color: "Gelb" },
    { label: "Herren (rot)", value: "Herren_Rot", gender: "Herren", color: "Rot" },
];

// Konstanten für den Zugriff auf golfData
const CLUB_NAME = "Golfclub Schloß Horst (4533)";
const COURSE_18_HOLE = "Platz 1-18 AB";
const COURSE_9_HOLE = "Platz A 1-9";


function App() {
  const [selectedTeeValue, setSelectedTeeValue] = useState(teeOptions[0].value);
  const [hcpInput, setHcpInput] = useState('');
  const [vorgabe18, setVorgabe18] = useState('---');
  const [vorgabe9, setVorgabe9] = useState('---');

  useEffect(() => {
    if (!selectedTeeValue || hcpInput === '') {
      setVorgabe18('---');
      setVorgabe9('---');
      return;
    }

    const hcpi = parseFloat(hcpInput.replace(',', '.'));
    if (isNaN(hcpi)) {
      setVorgabe18('Ungült. HCP');
      setVorgabe9('Ungült. HCP');
      return;
    }

    const selectedOption = teeOptions.find(option => option.value === selectedTeeValue);
    if (!selectedOption || !selectedOption.gender || !selectedOption.color) {
        setVorgabe18('Fehler');
        setVorgabe9('Fehler');
        return;
    }

    const { gender, color } = selectedOption;

    try {
      const teeData18 = golfData[CLUB_NAME]?.[COURSE_18_HOLE]?.[gender]?.[color];
      if (teeData18 && teeData18.handicaps) {
        setVorgabe18(findCourseHcp(hcpi, teeData18.handicaps));
      } else {
        setVorgabe18('Daten n.v.');
      }

      const teeData9 = golfData[CLUB_NAME]?.[COURSE_9_HOLE]?.[gender]?.[color];
      if (teeData9 && teeData9.handicaps) {
        setVorgabe9(findCourseHcp(hcpi, teeData9.handicaps));
      } else {
        setVorgabe9('Daten n.v.');
      }
    } catch (error) {
      console.error("Error accessing data:", error);
      setVorgabe18('Fehler');
      setVorgabe9('Fehler');
    }
  }, [selectedTeeValue, hcpInput]);

  const handleTeeChange = (event) => {
    setSelectedTeeValue(event.target.value);
  };

  const handleHcpChange = (event) => {
    setHcpInput(event.target.value);
  };

  return (
    <div className="App"> {/* className statt style für CSS-Klassen */}
      <header className="App-header">
        <h1>Golf Vorgabe Rechner (PWA)</h1>
      </header>
      <main>
        <div className="input-group">
          <label htmlFor="tee-select">Abschlag:</label>
          <select id="tee-select" value={selectedTeeValue} onChange={handleTeeChange}>
            {teeOptions.map(option => (
              <option key={option.value || 'default'} value={option.value} disabled={option.value === ""}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="hcp-input">Ihr Handicap-Index (HCPI):</label>
          <input
            type="text" // type="number" wäre auch möglich, text ist flexibler für Eingabe mit Komma
            id="hcp-input"
            value={hcpInput}
            onChange={handleHcpChange}
            placeholder="z.B. 18.4 oder 36"
          />
        </div>

        <div className="results-container">
          <div className="result-box">
            <p>Vorgabe 18-Loch:</p>
            <p className="result-value">{vorgabe18}</p>
          </div>
          <div className="result-box">
            <p>Vorgabe 9-Loch:</p>
            <p className="result-value">{vorgabe9}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;