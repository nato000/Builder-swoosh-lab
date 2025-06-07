import { Patient, Visit } from "@/types";

const PATIENTS_KEY = "patients";
const VISITS_KEY = "visits";

export function loadPatients(): Patient[] {
  try {
    const stored = localStorage.getItem(PATIENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading patients from localStorage:", error);
    return [];
  }
}

export function savePatients(patients: Patient[]): void {
  try {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  } catch (error) {
    console.error("Error saving patients to localStorage:", error);
  }
}

export function loadVisits(): Visit[] {
  try {
    const stored = localStorage.getItem(VISITS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading visits from localStorage:", error);
    return [];
  }
}

export function saveVisits(visits: Visit[]): void {
  try {
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  } catch (error) {
    console.error("Error saving visits to localStorage:", error);
  }
}

export function exportData(): { patients: Patient[]; visits: Visit[] } {
  return {
    patients: loadPatients(),
    visits: loadVisits(),
  };
}

export function importData(data: {
  patients: Patient[];
  visits: Visit[];
}): void {
  savePatients(data.patients);
  saveVisits(data.visits);
}

export function clearAllData(): void {
  localStorage.removeItem(PATIENTS_KEY);
  localStorage.removeItem(VISITS_KEY);
}
