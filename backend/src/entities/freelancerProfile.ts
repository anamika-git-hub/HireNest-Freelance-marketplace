export interface IFreelancerProfile {
    freelancerId?: string; 
    fullName: string;
    phone: string;
    location: string;
    rolePosition: string; 
    categoryId: string; 
    hourlyRate: number; 
    experienceYears: number; 
    description: string; 
    skills: string[]; 
    portfolioId: string; 
}
