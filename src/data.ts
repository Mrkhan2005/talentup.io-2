import { Job, Company, Candidate } from './types';

const companyNames = [
  'Veridian Dynamics', 'Aether Corp', 'Hyperion Tech', 'Stripe', 'Linear', 
  'Deel', 'Remote.com', 'NeuraLink', 'Apex Finance', 'Pulse Health', 
  'Vanguard Engineering', 'BlueHorizon Markets', 'Spectra Systems', 'Zenith Labs', 
  'CloudScale AI', 'Synthetix', 'Quantum Leap', 'AeroSpace Global', 'Helix Genomics',
  'Omega Capital'
];

const locations = [
  'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote (Global)',
  'Remote (US/Canada)', 'London, UK', 'Berlin, Germany', 'Chicago, IL', 'Boston, MA',
  'Singapore', 'Tokyo, Japan', 'Toronto, ON'
];

const techTitles = [
  'Lead AI Research Engineer', 'Senior Frontend Engineer (React/Vite)', 'Full Stack Developer',
  'DevOps Architect', 'Machine Learning Infrastructure Engineer', 'Staff Product Designer',
  'Security Operations Engineer', 'Data Engineer', 'Solidity Developer',
  'Android Platform Engineer', 'iOS Engineer', 'Technical Product Manager', 'Developer Advocate'
];

const healthcareTitles = [
  'Clinical Data Director', 'Healthtech Product Manager', 'Medical Device Software Engineer',
  'Bioinformatics Researcher', 'Telehealth Systems Administrator', 'Healthcare Security Compliance Officer',
  'Clinical Trial Analyst', 'EHR Integration Specialist', 'Nurse Informatics Consultant'
];

const financeTitles = [
  'Quantitative Research Analyst', 'Fintech Platform Architect', 'Senior Blockchain Architect',
  'Financial Risk Modeler', 'Algorithmic Trading Systems Developer', 'Portfolio Analytics Engineer',
  'Crypto Compliance Analyst', 'SaaS Pricing Strategist', 'Venture Capital Associate'
];

const marketingTitles = [
  'Growth Marketing Director', 'AI Content Strategist', 'SEO Product Lead',
  'Brand Operations Specialist', 'Creator Partnerships Lead', 'Performance Marketing Specialist',
  'Analytics Manager', 'Product Marketing Manager', 'Customer Acquisition Lead'
];

const engineeringTitles = [
  'Robotics Systems Engineer', 'Autonomous Vehicles Simulation Lead', 'Senior Structural Analyst',
  'Battery Technology Research Engineer', 'Hardware Prototyping Specialist', 'IoT Application Engineer',
  'Embedded Systems Firmware Developer', 'Mechanical Design Architect (SolidWorks)'
];

const remoteTitles = [
  'Head of Distributed Work Culture', 'Remote IT Infrastructure Lead', 'Global Operations Coordinator',
  'Remote Recruiting Specialist', 'Distributed Community Evangelist'
];

const skillsPool = {
  Technology: ['React', 'TypeScript', 'Node.js', 'Python', 'TailwindCSS', 'AWS', 'Docker', 'Kubernetes', 'Gemini SDK', 'Next.js', 'PostgreSQL', 'GraphQL', 'Machine Learning', 'PyTorch'],
  Healthcare: ['HIPAA Compliance', 'HL7', 'FHIR', 'Python', 'R Language', 'Data Analysis', 'EHR Connect', 'SQL', 'Bio-Informatics', 'Clinical Trials'],
  Finance: ['Quantitative Modeling', 'Python', 'Solidity', 'SQL', 'Fintech', 'Financial Analysis', 'Risk Management', 'Excel', 'C++', 'Rust', 'Blockchain'],
  Marketing: ['Growth Hacking', 'SEO', 'Google Analytics', 'Copywriting', 'Product Marketing', 'SaaS Marketing', 'A/B Testing', 'Content Strategy', 'Social CRM'],
  Engineering: ['CAD', 'Matlab', 'C/C++', 'Embedded Systems', 'IoT', 'SolidWorks', 'PLC Programming', 'Hardware Testing', 'Robotics', 'System Engineering'],
  Remote: ['Asynchronous Operations', 'Slack API', 'Notion Workspace', 'Project Management', 'Agile Scrum', 'Intercultural Communication']
};

const jobDescriptions = [
  'Join our fast-growing elite product team to revolutionize the industry. You will write state-of-the-art software, coordinate across globally distributed squads, and build real user value.',
  'We are seeking an ambitious builder who loves tackling tough challenges. You will get deep autonomy, beautiful toolsets, and the resources of a highly funded unicorn startup.',
  'Help us construct the underlying networks of the future workspace. Expect competitive base salary, double-digit equity percentages, premium executive medical benefits, and continuous professional growth pathways.'
];

const generatedJobs: Job[] = [];
let jobIdCounter = 1;

const categories: Array<'Technology' | 'Healthcare' | 'Finance' | 'Marketing' | 'Engineering' | 'Remote'> = [
  'Technology', 'Healthcare', 'Finance', 'Marketing', 'Engineering', 'Remote'
];

categories.forEach((category) => {
  let titlesList: string[] = [];
  if (category === 'Technology') titlesList = techTitles;
  else if (category === 'Healthcare') titlesList = healthcareTitles;
  else if (category === 'Finance') titlesList = financeTitles;
  else if (category === 'Marketing') titlesList = marketingTitles;
  else if (category === 'Engineering') titlesList = engineeringTitles;
  else titlesList = remoteTitles;

  for (let idx = 0; idx < 18; idx++) {
    const title = titlesList[idx % titlesList.length] + (idx >= titlesList.length ? ' II' : '');
    const company = companyNames[(idx + category.length) % companyNames.length];
    const location = locations[(idx * 7 + title.length) % locations.length];
    const categorySkills = skillsPool[category];
    
    const numSkills = 3 + (idx % 3);
    const skills: string[] = [];
    for (let sIdx = 0; sIdx < numSkills; sIdx++) {
      const skill = categorySkills[(idx + sIdx * 2) % categorySkills.length];
      if (!skills.includes(skill)) {
        skills.push(skill);
      }
    }

    const baseMin = 85 + (idx % 10) * 12;
    const baseMax = baseMin + 30 + (idx % 5) * 15;
    
    generatedJobs.push({
      id: `job-${jobIdCounter++}`,
      title,
      company,
      companyLogo: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100&h=100`,
      category,
      location,
      salaryMin: baseMin * 1000,
      salaryMax: baseMax * 1000,
      type: idx % 4 === 0 ? 'Remote' : idx % 4 === 1 ? 'Hybrid' : idx % 4 === 2 ? 'Full-time' : 'Contract',
      skillsRequired: skills,
      description: jobDescriptions[idx % jobDescriptions.length],
      postedAt: new Date(Date.now() - (idx % 7) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      rating: 4.0 + (idx % 11) * 0.1
    });
  }
});

export const sampleJobs = generatedJobs;

export const sampleCompanies: Company[] = companyNames.map((name, idx) => {
  return {
    id: `co-${idx + 1}`,
    name,
    logo: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100&h=100`,
    industry: idx % 3 === 0 ? 'Enterprise AI' : idx % 3 === 1 ? 'Global Fintech' : 'Healthcare Security',
    location: locations[idx % locations.length],
    rating: Number((4.2 + (idx % 9) * 0.1).toFixed(1)),
    openPositions: 3 + (idx % 5) * 4,
    employees: idx % 3 === 0 ? '500-1000' : idx % 3 === 1 ? '100-250' : '50-100',
    description: `Leading innovator in ${idx % 3 === 0 ? 'automation and predictive systems' : 'remotely distributed teams and frictionless payouts'}. Shaping the next decade with robust engineering and gorgeous, human-computer experiences.`
  };
});

export const sampleCandidates: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Sarah Jenkins',
    title: 'Lead Frontend Architect',
    location: 'San Francisco, CA',
    industry: 'Technology',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'Framer Motion'],
    experienceYears: 8,
    availability: 'Immediate',
    desiredSalary: '$165,000 - $185,000',
    score: 96,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'cand-2',
    name: 'Marcus Chen',
    title: 'Senior DevOps & Cloud Engineer',
    location: 'Seattle, WA',
    industry: 'Technology',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD Pipelines'],
    experienceYears: 6,
    availability: '1 Month',
    desiredSalary: '$150,000 - $170,000',
    score: 92,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'cand-3',
    name: 'Dr. Evelyn Martinez',
    title: 'Bioinformatics Research Director',
    location: 'Boston, MA',
    industry: 'Healthcare',
    skills: ['Python', 'FHIR', 'Biostatistics', 'EHR Connect', 'R Language'],
    experienceYears: 11,
    availability: 'Passive',
    desiredSalary: '$190,000 - $220,000',
    score: 98,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'cand-4',
    name: 'David Rosenberg',
    title: 'Quantitative Risk Modeler',
    location: 'New York, NY',
    industry: 'Finance',
    skills: ['Quantitative Modeling', 'Python', 'C++', 'Risk Management', 'Rust'],
    experienceYears: 7,
    availability: 'Immediate',
    desiredSalary: '$180,000 - $210,000',
    score: 95,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'cand-5',
    name: 'Samantha Grey',
    title: 'Director of SaaS Growth & AI Operations',
    location: 'Austin, TX',
    industry: 'Marketing',
    skills: ['Growth Hacking', 'A/B Testing', 'SaaS Marketing', 'Content Strategy'],
    experienceYears: 9,
    availability: 'Passive',
    desiredSalary: '$140,000 - $160,000',
    score: 89,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'cand-6',
    name: 'Liam Peterson',
    title: 'Embedded Robotics Engineer',
    location: 'Chicago, IL',
    industry: 'Engineering',
    skills: ['Robotics', 'C/C++', 'SolidWorks', 'CAD', 'Embedded Systems'],
    experienceYears: 5,
    availability: 'Immediate',
    desiredSalary: '$120,000 - $140,000',
    score: 91,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150'
  }
];

export const defaultResumeTemplate = `
SARAH JENKINS
Full Stack Engineer | React & TypeScript Specialist
Email: sarah@jenkins.dev | Web: github.com/sjenkins
Location: San Francisco, CA

SUMMARY
Highly accomplished Software Design Professional with 8 years of production experience scaling web applications. Driven to implement state-of-the-art experiences with extreme attention to visual details and UX typography.

EXPERIENCE
Lead Frontend Architect
Aether Corp — San Francisco, CA | 2022 - Present
* Spearheaded conversion from multi-page web applications to lightning-fast React + Vite SPA.
* Scaled rendering speeds by 40% through strict lazy-load bundle splitting and custom hooks.
* Orchestrated team of 7 and designed our proprietary design library.

Senior Software Builder
Vanguard Engineering — Seattle, WA | 2019 - 2022
* Built modular cloud-native APIs using Node.js and AWS lambdas, routing 1k concurrent connections.
* Integrated modern analytical dashboards reporting live metrics.

EDUCATION
B.S. in Computer Science
Stanford University | 2015 - 2019
`;
