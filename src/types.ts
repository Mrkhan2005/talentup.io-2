export interface User {
  id: string;
  email: string;
  name: string;
  role: 'seeker' | 'employer';
  companyName?: string;
  avatarUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  category: 'Technology' | 'Healthcare' | 'Finance' | 'Marketing' | 'Engineering' | 'Remote';
  location: string;
  salaryMin: number;
  salaryMax: number;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  skillsRequired: string[];
  description: string;
  postedAt: string;
  rating?: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  rating: number;
  openPositions: number;
  employees: string;
  description: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  industry: string;
  skills: string[];
  experienceYears: number;
  availability: 'Immediate' | '1 Month' | 'Passive';
  desiredSalary: string;
  score: number;
  avatarUrl?: string;
  resumeUrl?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  candidateTitle: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  resumeScore?: number;
}

export interface ChatMessage {
  sender: 'user' | 'coach';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'match' | 'viewer' | 'invite' | 'resume';
  read: boolean;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  atsScore: number;
  formattingScore: number;
  keywordMatchScore: number;
  readabilityScore: number;
  professionalImpactScore: number;
  feedback: string;
  missingSkills: string[];
  strengths: string[];
  recommendations: string[];
}
