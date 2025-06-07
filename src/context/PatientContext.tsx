import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Patient, Visit, SearchFilters, VisitSearchFilters } from "@/types";
import {
  loadPatients,
  savePatients,
  loadVisits,
  saveVisits,
} from "@/lib/storage";

interface PatientContextType {
  patients: Patient[];
  visits: Visit[];
  filteredPatients: Patient[];
  searchFilters: SearchFilters;
  addPatient: (
    patient: Omit<Patient, "id" | "createdAt" | "updatedAt">,
  ) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
  addVisit: (visit: Omit<Visit, "id" | "createdAt" | "updatedAt">) => Visit;
  updateVisit: (id: string, updates: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;
  getVisit: (id: string) => Visit | undefined;
  getPatientVisits: (
    patientId: string,
    filters?: VisitSearchFilters,
  ) => Visit[];
  setSearchFilters: (filters: SearchFilters) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  useEffect(() => {
    setPatients(loadPatients());
    setVisits(loadVisits());
  }, []);

  useEffect(() => {
    savePatients(patients);
  }, [patients]);

  useEffect(() => {
    saveVisits(visits);
  }, [visits]);

  const addPatient = (
    patientData: Omit<Patient, "id" | "createdAt" | "updatedAt">,
  ): Patient => {
    const newPatient: Patient = {
      ...patientData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPatients((prev) => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id
          ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
          : patient,
      ),
    );
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
    setVisits((prev) => prev.filter((visit) => visit.patientId !== id));
  };

  const getPatient = (id: string): Patient | undefined => {
    return patients.find((patient) => patient.id === id);
  };

  const addVisit = (
    visitData: Omit<Visit, "id" | "createdAt" | "updatedAt">,
  ): Visit => {
    const newVisit: Visit = {
      ...visitData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setVisits((prev) => [...prev, newVisit]);
    return newVisit;
  };

  const updateVisit = (id: string, updates: Partial<Visit>) => {
    setVisits((prev) =>
      prev.map((visit) =>
        visit.id === id
          ? { ...visit, ...updates, updatedAt: new Date().toISOString() }
          : visit,
      ),
    );
  };

  const deleteVisit = (id: string) => {
    setVisits((prev) => prev.filter((visit) => visit.id !== id));
  };

  const getVisit = (id: string): Visit | undefined => {
    return visits.find((visit) => visit.id === id);
  };

  const getPatientVisits = (
    patientId: string,
    filters?: VisitSearchFilters,
  ): Visit[] => {
    let patientVisits = visits.filter((visit) => visit.patientId === patientId);

    if (filters?.date) {
      const filterDate = new Date(filters.date).toDateString();
      patientVisits = patientVisits.filter(
        (visit) => new Date(visit.date).toDateString() === filterDate,
      );
    }

    return patientVisits.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  };

  const filteredPatients = patients.filter((patient) => {
    if (
      searchFilters.name &&
      !patient.name?.toLowerCase().includes(searchFilters.name.toLowerCase())
    ) {
      return false;
    }
    if (
      searchFilters.surname &&
      !patient.surname
        ?.toLowerCase()
        .includes(searchFilters.surname.toLowerCase())
    ) {
      return false;
    }
    if (
      searchFilters.email &&
      !patient.email?.toLowerCase().includes(searchFilters.email.toLowerCase())
    ) {
      return false;
    }
    if (searchFilters.phone && !patient.phone?.includes(searchFilters.phone)) {
      return false;
    }
    if (searchFilters.visitDate) {
      const hasVisitOnDate = visits.some(
        (visit) =>
          visit.patientId === patient.id &&
          new Date(visit.date).toDateString() ===
            new Date(searchFilters.visitDate!).toDateString(),
      );
      if (!hasVisitOnDate) return false;
    }
    return true;
  });

  return (
    <PatientContext.Provider
      value={{
        patients,
        visits,
        filteredPatients,
        searchFilters,
        addPatient,
        updatePatient,
        deletePatient,
        getPatient,
        addVisit,
        updateVisit,
        deleteVisit,
        getVisit,
        getPatientVisits,
        setSearchFilters,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientProvider");
  }
  return context;
}
