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

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  dateOfBirth: string; // ✅ تغییر از age به dateOfBirth (ISO date string)
  gender: string; // "Male" | "Female"
  phoneNumber?: string; // ✅ تغییر از phone به phoneNumber
  injuryType?: string;
  affectedSide?: string; // "Left" | "Right" | "Both"
  injuryDate: string; // ✅ اضافه شد (ISO date string)
  // notes حذف شد - در بک‌اند وجود ندارد
  createdAt: string;
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
export interface PatientWithNextSession {
  patientId: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber?: string;
  injuryType?: string;
  affectedSide?: string;
  injuryDate: string;
  nextSession?: Session;
}

