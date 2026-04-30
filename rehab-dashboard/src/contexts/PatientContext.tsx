import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { PatientWithNextSession } from '../types/api';

interface PatientContextType {
  selectedPatient: PatientWithNextSession | null;
  setSelectedPatient: (patient: PatientWithNextSession | null) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPatient, setSelectedPatient] = useState<PatientWithNextSession | null>(null);

  return (
    <PatientContext.Provider value={{ selectedPatient, setSelectedPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
