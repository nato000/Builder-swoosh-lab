export interface Patient {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  questionnaire?: QuestionnaireAnswer[];
  notes?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionnaireAnswer {
  id: string;
  questionNumber: number;
  questionText: string;
  answer?: string;
}

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  procedures: Procedure[];
  products: Product[];
  soldProducts: SoldProduct[];
  notes?: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Procedure {
  id: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  createdAt: string;
}

export interface SoldProduct {
  id: string;
  name: string;
  createdAt: string;
}

export interface SearchFilters {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  visitDate?: string;
}

export interface VisitSearchFilters {
  date?: string;
}
