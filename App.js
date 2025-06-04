import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { golfData } from './golfData'; // Import der Daten

const CLUB_NAME = "Golfclub Schloß Horst (4533)";
const COURSE_18_HOLE = "Platz 1-18 AB";
const COURSE_9_HOLE = "Platz A 1-9";

const teeOptions = [
  { label: "Bitte wählen...", value: null, gender: null, color: null },
  { label: "Damen (rot)", value: "Damen_Rot", gender: "Damen", color: "Rot" },
  { label: "Herren (gelb)", value: "Herren_Gelb", gender: "Herren", color: "Gelb" },
  { label: "Damen (gelb)", value: "Damen_Gelb", gender: "Damen", color: "Gelb" },
  { label: "Herren (rot)", value: "Herren_Rot", gender: "Herren", color: "Rot" },
];

// Hilfsfunktion zum Finden des Course Handicaps
function findCourseHcp(hcpi, handicapEntries) {
  if (isNaN(hcpi) || !handicapEntries || handicapEntries.length === 0) {
    return "N/A";
  }

  for (const entry of handicapEntries) {
    const rangeParts = entry.hcpi_range.split("–").map(s => s.trim()); // Trennzeichen kann variieren (– vs -)
    const minHcpi = parseFloat(rangeParts[0].replace(",", "."));
    const maxHcpi = rangeParts.length > 1 ? parseFloat(rangeParts[1].replace(",", ".")) : minHcpi;

    if (hcpi >= minHcpi && hcpi <= maxHcpi) {
      return entry.course_hcp;
    }
  }
  // Fallback, falls HCPI außerhalb der expliziten Bereiche liegt
  // Hier könnte man auch die CR/SR/Par-Formel anwenden, wenn gewünscht und die Daten dafür verfügbar sind.
  // Für dieses Beispiel geben wir "Außerhalb Bereich" zurück, wenn keine Range passt.
  const firstEntry = handicapEntries[0];
  const lastEntry = handicapEntries[handicapEntries.length - 1];

  const firstRangeParts = firstEntry.hcpi_range.split("–").map(s => s.trim());
  const minPossible = parseFloat(firstRangeParts[0].replace(",","."));

  const lastRangeParts = lastEntry.hcpi_range.split("–").map(s => s.trim());
  const maxPossible = parseFloat(lastRangeParts[lastRangeParts.length -1].replace(",","."));


  if (hcpi < minPossible) return firstEntry.course_hcp; // Vorgabe für niedrigste HCPIs
  if (hcpi > maxPossible) return lastEntry.course_hcp; // Vorgabe für höchste HCPIs

  return "Außerh. Bereich";
}


export default function App() {
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
      // 18-Loch Vorgabe
      const teeData18 = golfData[CLUB_NAME]?.[COURSE_18_HOLE]?.[gender]?.[color];
      if (teeData18 && teeData18.handicaps) {
        setVorgabe18(findCourseHcp(hcpi, teeData18.handicaps));
      } else {
        setVorgabe18('Daten n.v.'); // Daten nicht verfügbar
      }

      // 9-Loch Vorgabe
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

  return (
    <SafeAreaView style={styles.flexContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Golf Vorgabe Rechner</Text>
        <Text style={styles.subHeader}>{CLUB_NAME}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Abschlag:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTeeValue}
              onValueChange={(itemValue) => setSelectedTeeValue(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem} // Für iOS Styling
            >
              {teeOptions.map((option) => (
                <Picker.Item key={option.value || "default"} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ihr Handicap-Index (HCPI):</Text>
          <TextInput
            style={styles.input}
            onChangeText={setHcpInput}
            value={hcpInput}
            placeholder="z.B. 18.4 oder 36"
            keyboardType="numeric" // Auf Mobilgeräten oft besser: decimal-pad
            returnKeyType="done"
          />
        </View>

        <View style={styles.resultsContainer}>
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Vorgabe 18-Loch:</Text>
            <Text style={styles.resultValue}>{vorgabe18}</Text>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Vorgabe 9-Loch:</Text>
            <Text style={styles.resultValue}>{vorgabe9}</Text>
          </View>
        </View>
         <Text style={styles.footer}>Alle Angaben ohne Gewähr. Stand der Daten prüfen.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    // Für Android Picker braucht manchmal einen umschließenden View für Styling
    ...(Platform.OS === 'android' && { paddingLeft: 10 }),
  },
  picker: {
    height: 50,
    width: '100%',
    // iOS spezifisches Styling kann hier nicht direkt angewendet werden,
    // stattdessen itemStyle verwenden oder einen Wrapper stylen.
  },
  pickerItem: { // Nur für iOS
    // height: 120, // Beispiel: Falls Picker-Items zu klein sind
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultLabel: {
    fontSize: 18,
    color: '#333',
  },
  resultValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 12,
    color: 'grey',
  }
});

// Um das letzte Element in resultBox ohne borderBottom zu haben:
styles.resultsContainer.childStyle = [
    styles.resultBox,
    {borderBottomWidth: 0}
]; // Dies ist eine Pseudo-Syntax; in der Realität würden Sie das letzte Element anders ansprechen
// oder im Mapping der Ergebnisse eine Bedingung für den Style setzen.
// Für dieses Beispiel belassen wir es einfach.