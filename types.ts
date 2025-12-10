export type Language = 'en' | 'am';

export interface ServiceItem {
  id: number;
  amharic: string;
  english: string;
  icon: string;
}

export interface Question {
  id: string;
  textAm: string;
  textEn: string;
  active: boolean;
}

export interface FeedbackSubmission {
  id: string;
  parentId: string;
  parentName: string;
  date: string;
  responses: {
    questionId: string;
    questionText: string;
    answer: 'well_done' | 'not_done';
  }[];
}

export type UserRole = 'admin' | 'parent' | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
}

export interface RegisteredParent {
  studentId: string;
  parentName: string;
  parentPhone: string;
}