// models/beneficiarioDTO.ts
export interface BeneficiarioDTO {
  idPerson: number;
  name: string;
  surname: string;
  age: number;
  birthdate: string;
  typeDocument: string;
  documentNumber: string;
  typeKinship: string;
  sponsored: string;
  state: string;
  familyId: number;
  education: EducationDTO[];
  health: HealthDTO[];
}

export interface EducationDTO {
  idEducation: number;
  degreeStudy: string;
  gradeBook: string;
  gradeAverage: number;
  fullNotebook: string;
  assistance: string;
  schollName: string;
  entryDate: Date;
  tutorials: string;
  personId: number;
}

export interface HealthDTO {
  idHealth: number;
  vaccine: string;
  vph: string;
  influenza: string;
  deworming: string;
  hemoglobin: string;
  applicationDate: Date;
  condicionBeneficiary: string;
  personId: number;
}
