// DTO Types from Backend
export interface StartSessionRequest {
  patientId: number;
  gameType: string;
  difficultyLevel: number;
}

export interface AddMetricRequest {
  rangeOfMotion: number;
  reactionTime: number;
  accuracy: number;
  repetitionCount: number;
  score: number;
}

export interface SessionReport {
  sessionId: number;
  patientName: string;
  startTime: string;
  endTime: string | null;
  totalMetrics: number;
  averageAccuracy: number;
  averageReactionTime: number;
  totalRepetitions: number;
  totalScore: number;
}

export interface SessionMetric {
  id: number;
  sessionId: number;
  rangeOfMotion: number;
  reactionTime: number;
  accuracy: number;
  repetitionCount: number;
  score: number;
  recordedAt: string;
}
// Patient Entity
export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string; // ✅ تغییر از nationalId
  age: number; // ✅ تغییر از dateOfBirth
  gender: string; // "Male" | "Female"
  phone?: string; // ✅ تغییر از phoneNumber
  injuryType?: string; // ✅ جدید
  affectedSide?: string; // ✅ جدید - "Left" | "Right" | "Both"
  notes?: string; // ✅ جدید
  createdAt: string; // ISO date string
}

// Session Entity
export interface Session {
  id: number;
  patientId: number;
  startTime: string;
  endTime?: string;
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Patient with next session info
export interface PatientWithNextSession extends Patient {
  nextSession?: Session;
}
