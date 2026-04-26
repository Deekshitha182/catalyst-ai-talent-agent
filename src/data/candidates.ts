export interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: number;
  skills: string[];
  currentCompany: string;
  location: string;
  bio: string;
  simulatedTraits: {
    openToNewOpportunities: boolean;
    desiredSalaryRange: [number, number];
    preferredTechStack: string[];
    responsePersonality: 'enthusiastic' | 'neutral' | 'reluctant' | 'unresponsive';
  };
}

export const mockCandidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Emily Chen',
    role: 'Senior Full Stack Engineer',
    experience: 7,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'System Design'],
    currentCompany: 'TechFlow',
    location: 'San Francisco, CA',
    bio: 'Passionate about building scalable web applications. Strong focus on backend architecture.',
    simulatedTraits: {
      openToNewOpportunities: true,
      desiredSalaryRange: [160000, 200000],
      preferredTechStack: ['React', 'TypeScript', 'Node.js'],
      responsePersonality: 'enthusiastic',
    },
  },
  {
    id: 'c2',
    name: 'Marcus Johnson',
    role: 'Frontend Developer',
    experience: 3,
    skills: ['Vue', 'JavaScript', 'CSS', 'Figma'],
    currentCompany: 'DesignStudio',
    location: 'Austin, TX',
    bio: 'Creative frontend developer with a keen eye for UI/UX. Loves animating things.',
    simulatedTraits: {
      openToNewOpportunities: false,
      desiredSalaryRange: [90000, 120000],
      preferredTechStack: ['Vue', 'Tailwind'],
      responsePersonality: 'reluctant',
    },
  },
  {
    id: 'c3',
    name: 'Sarah Rahman',
    role: 'Data Scientist',
    experience: 5,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    currentCompany: 'DataCorp',
    location: 'Remote',
    bio: 'Focused on NLP and generative AI models. Published 2 papers on transformer optimization.',
    simulatedTraits: {
      openToNewOpportunities: true,
      desiredSalaryRange: [140000, 180000],
      preferredTechStack: ['Python', 'PyTorch'],
      responsePersonality: 'neutral',
    },
  },
  {
    id: 'c4',
    name: 'Alexei Volkov',
    role: 'Backend SDE',
    experience: 8,
    skills: ['Go', 'Kubernetes', 'PostgreSQL', 'Redis'],
    currentCompany: 'CloudNet',
    location: 'Seattle, WA',
    bio: 'Distributed systems expert. Contributor to Go open-source compiler.',
    simulatedTraits: {
      openToNewOpportunities: true,
      desiredSalaryRange: [180000, 240000],
      preferredTechStack: ['Go', 'Rust'],
      responsePersonality: 'enthusiastic',
    },
  },
  {
    id: 'c5',
    name: 'Priya Sharma',
    role: 'Product Manager',
    experience: 6,
    skills: ['Product Strategy', 'Agile', 'Scrum', 'Data Analysis', 'SQL'],
    currentCompany: 'Innovents',
    location: 'New York, NY',
    bio: 'Data-driven PM with a background in software engineering.',
    simulatedTraits: {
      openToNewOpportunities: true,
      desiredSalaryRange: [150000, 190000],
      preferredTechStack: [],
      responsePersonality: 'neutral',
    },
  },
  {
    id: 'c6',
    name: 'David Kim',
    role: 'Software Engineer',
    experience: 4,
    skills: ['TypeScript', 'React', 'GraphQL', 'Next.js'],
    currentCompany: 'StartupX',
    location: 'San Francisco, CA',
    bio: 'Building fast and interactive user interfaces.',
    simulatedTraits: {
      openToNewOpportunities: false,
      desiredSalaryRange: [130000, 160000],
      preferredTechStack: ['React', 'Next.js'],
      responsePersonality: 'unresponsive',
    },
  },
  {
    id: 'c7',
    name: 'Omar Farooq',
    role: 'DevOps Engineer',
    experience: 9,
    skills: ['AWS', 'Terraform', 'CI/CD', 'Docker', 'Linux'],
    currentCompany: 'InfraScale',
    location: 'Remote',
    bio: 'Automating everything. Zero downtime enthusiast.',
    simulatedTraits: {
      openToNewOpportunities: true,
      desiredSalaryRange: [170000, 210000],
      preferredTechStack: ['AWS', 'Kubernetes'],
      responsePersonality: 'enthusiastic',
    },
  },
  {
    id: 'c8',
    name: 'Rachel Davis',
    role: 'Full Stack Engineer',
    experience: 5,
    skills: ['Python', 'Django', 'React', 'PostgreSQL'],
    currentCompany: 'WebSolutions',
    location: 'Chicago, IL',
    bio: 'End-to-end builder. Loves clean code and mentorship.',
    simulatedTraits: {
      openToNewOpportunities: true,
      desiredSalaryRange: [140000, 170000],
      preferredTechStack: ['Python', 'React'],
      responsePersonality: 'neutral',
    },
  }
];
