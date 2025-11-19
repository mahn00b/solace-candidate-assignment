export interface AdvocateResult {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  email: string;
  yearsOfExperience: number;
  phoneNumber: number;
  background: string;
  specialties: string[];
}

export interface HealthConcern {
  id: string;
  name: string;
}