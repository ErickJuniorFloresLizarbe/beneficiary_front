// family.dto.ts
export interface FamilyDTO {
  id: number;
  direction: string;
  reasibAdmission: string;
  status: string;
  basicService: BasicService;
  communityEnvironment: CommunityEnvironment;
  familyComposition: FamilyComposition;
  familyFeeding: FamilyFeeding;
  familyHealth: FamilyHealth;
  housingDistribution: HousingDistribution;
  housingEnvironment: HousingEnvironment;
  laborAutonomy: LaborAutonomy;
  socialLife: SocialLife;
}

export interface BasicService {
  waterService: string;
  servDrain: string;
  servLight: string;
  servCable: string;
  servGas: string;
}

export interface CommunityEnvironment {
  area: string;
  referenceLocation: string;
  residue: string;
  publicLighting: string;
  security: string;
}

export interface FamilyComposition {
  numberMembers: number;
  numberChildren: number;
  familyType: string;
  socialProblems: string;
}

export interface FamilyFeeding {
  frecuenciaSemanal: string;
  tipoAlimentacion: string;
}

export interface FamilyHealth {
  safeType: string;
  familyDisease: string;
  treatment: string;
  antecedentesEnfermedad: string;
  examenMedico: string;
}

export interface HousingDistribution {
  ambienteHogar: number;
  numeroDormitorio: number;
  habitabilidad: string;
}

export interface HousingEnvironment {
  tenure: string;
  typeOfHousing: string;
  housingMaterial: string;
  housingSecurity: string;
}

export interface LaborAutonomy {
  numberRooms: number;
  numberOfBedrooms: number;
  habitabilityBuilding: string;
}

export interface SocialLife {
  material: string;
  feeding: string;
  economic: string;
  spiritual: string;
  socialCompany: string;
  guideTip: string;
}