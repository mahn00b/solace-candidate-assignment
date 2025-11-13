import type {
  Refinement,
  SeedingUtils,
} from '.';

const specialties = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

const degrees = [
  "MD",
  "PhD",
  "MSW"
]


export const getAdvocateRefinements = (func: SeedingUtils): Refinement => {
  return {
    count: 300000,
    columns: {
      firstName: func.firstName(),
      lastName: func.lastName(),
      city: func.city(),
      degree: func.valuesFromArray({ values: degrees }),
      specialties: func.default({
        defaultValue: () => {
          const numSpecialties = Math.floor(Math.random() * 24) + 1; // 1 to 3 specialties
          const selectedSpecialties = new Set<string>();
          while (selectedSpecialties.size < numSpecialties) {
            const randomIndex = Math.floor(Math.random() * specialties.length);
            selectedSpecialties.add(specialties[randomIndex]);
          }
          return Array.from(selectedSpecialties);
        }
      }),
      yearsOfExperience: func.number({ minValue: 1, maxValue: 30, precision: 1 }),
      phoneNumber: func.number({ minValue: 1000000000, maxValue: 9999999999, precision: 1 }),
    }
  }

}
