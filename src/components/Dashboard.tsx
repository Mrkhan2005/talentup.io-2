import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, Clock, FileText, Sparkles, TrendingUp, Users, Award, Eye, Calendar, User, ArrowRight, X, UserCheck, Sliders, Trophy, Zap, Globe, Lightbulb, DollarSign, MapPin, HelpCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Job, Candidate, Application, ResumeAnalysisResult } from '../types';
import { sampleCandidates } from '../data';
import CareerPathSimulator from './CareerPathSimulator';

interface DashboardProps {
  role: 'seeker' | 'employer';
  appliedJobs: Job[];
  applications: Application[];
  invitedCandidates: Candidate[];
  onUpdateAppStatus: (appId: string, nextStatus: Application['status']) => void;
  onPostNewJob: (job: Omit<Job, 'id' | 'postedAt'>) => void;
  resumeAnalysis?: ResumeAnalysisResult | null;
  onNavigateToTab?: (tab: 'home' | 'analyzer' | 'jobs' | 'dashboard' | 'contact') => void;
}

export default function Dashboard({
  role,
  appliedJobs,
  applications,
  invitedCandidates,
  onUpdateAppStatus,
  onPostNewJob,
  resumeAnalysis,
  onNavigateToTab
}: DashboardProps) {
  
  // Job Posting Modal State
  const [showPostModal, setShowPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('My Enterprise Inc.');
  const [newCategory, setNewCategory] = useState<'Technology' | 'Healthcare' | 'Finance' | 'Marketing' | 'Engineering' | 'Remote'>('Technology');
  const [newLocation, setNewLocation] = useState('Remote (US/Canada)');
  const [newMinSalary, setNewMinSalary] = useState(110000);
  const [newMaxSalary, setNewMaxSalary] = useState(150000);
  const [newType, setNewType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid'>('Remote');
  const [newSkills, setNewSkills] = useState('React, TypeScript, AWS');
  const [newDesc, setNewDesc] = useState('');

  // Seeker Editable Profile State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [activeSeekerTab, setActiveSeekerTab] = useState<'overview' | 'settings' | 'salary' | 'simulator'>('overview');
  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    title: 'Lead Frontend Architect',
    email: 'sarah@jenkins.dev',
    location: 'San Francisco, CA',
    skills: 'React, TypeScript, TailwindCSS, Next.js, Framer Motion',
    experienceYears: 8,
    desiredSalary: '$165,000 - $185,000',
    bio: 'Highly accomplished Software Design Professional with 8 years of production experience scaling web applications.',
    education: 'B.S. in Computer Science - Stanford University',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    socialLinks: 'github.com/sarahjenkins, linkedin.com/in/sarahjenkins'
  });

  // Salary Benchmark Tool State
  const [benchRole, setBenchRole] = useState('Lead Frontend Architect');
  const [benchLocation, setBenchLocation] = useState('San Francisco, CA');
  const [benchTargetSalary, setBenchTargetSalary] = useState(175000);
  const [benchExp, setBenchExp] = useState(8);

  // Sync benchmark parameters with active profile updates
  useEffect(() => {
    if (profile) {
      if (profile.title) setBenchRole(profile.title);
      if (profile.location) setBenchLocation(profile.location);
      if (profile.experienceYears) setBenchExp(profile.experienceYears);
      
      if (profile.desiredSalary) {
        const matches = profile.desiredSalary.match(/\d+[\d,.]*/g);
        if (matches && matches.length > 0) {
          // Take the average if a range is specified, or direct value
          const values = matches.map(m => parseInt(m.replace(/,/g, ''), 10)).filter(num => !isNaN(num) && num > 5000);
          if (values.length > 0) {
            const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
            setBenchTargetSalary(avg);
          }
        }
      }
    }
  }, [profile.title, profile.location, profile.experienceYears, profile.desiredSalary]);

  const profileFields = [
    { key: 'name', label: 'Full Name', check: (v: any) => !!v && v.trim().length > 0 },
    { key: 'title', label: 'Professional Headline', check: (v: any) => !!v && v.trim().length > 0 },
    { key: 'email', label: 'Contact Email', check: (v: any) => !!v && v.trim().length > 0 && v.includes('@') },
    { key: 'location', label: 'Geographic Location', check: (v: any) => !!v && v.trim().length > 0 },
    { key: 'skills', label: 'Technical/Core Skills', check: (v: any) => !!v && v.trim().length > 0 },
    { key: 'experienceYears', label: 'Years of Experience', check: (v: any) => typeof v === 'number' && v > 0 },
    { key: 'desiredSalary', label: 'Expected Salary Target', check: (v: any) => !!v && v.trim().length > 0 },
    { key: 'bio', label: 'Short Career Biography', check: (v: any) => !!v && v.trim().length > 0 },
    { key: 'education', label: 'Academic Background', check: (v: any) => !!v && v.trim().length > 0 },
    { key: 'avatarUrl', label: 'Profile Avatar Image', check: (v: any) => !!v && v.trim().length > 0 && v.startsWith('http') },
    { key: 'socialLinks', label: 'Social Professional Links', check: (v: any) => !!v && v.trim().length > 0 }
  ];

  const completedFields = profileFields.filter(field => field.check((profile as any)[field.key]));
  const completionPercentage = Math.round((completedFields.length / profileFields.length) * 100);

  // Dynamic Achievements calculation
  const achievementsList = [
    {
      id: 'pioneer',
      title: 'Sector Pioneer',
      iconName: 'Briefcase',
      gradient: 'from-emerald-500 to-teal-500',
      description: 'Initiated active progress pipelines by applying to candidate roles.',
      unlocked: appliedJobs.length > 0,
      progressText: `${appliedJobs.length > 0 ? 1 : 0} / 1 applied`,
      tip: 'Go to the Job Matcher board and click "Apply with 1-Click" to unlock this milestone.'
    },
    {
      id: 'rising_star',
      title: 'Rising Star',
      iconName: 'Sparkles',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Progressed past 50% candidate profile blueprint completion status.',
      unlocked: completionPercentage >= 50,
      progressText: `${completionPercentage}% / 50%`,
      tip: 'Open the Profile Settings tab and fill optional info like salary, bio or geographic location.'
    },
    {
      id: 'ats_pro',
      title: 'ATS Elite',
      iconName: 'Award',
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Exceeded 80% candidate completeness rating to unlock high recruiter matching priority.',
      unlocked: completionPercentage >= 80,
      progressText: `${completionPercentage}% / 80%`,
      tip: 'Perfect your candidate footprint! Enter technical tools, years of expertise, or other fields.'
    },
    {
      id: 'ats_legend',
      title: 'ATS Legend',
      iconName: 'Trophy',
      gradient: 'from-amber-400 to-orange-500',
      description: 'Achieved complete 100% profile state synchronization.',
      unlocked: completionPercentage === 100,
      progressText: `${completionPercentage}% / 100%`,
      tip: 'Go to Profile Settings and verify that every single attribute field is completed.'
    },
    {
      id: 'scale_architect',
      title: 'Scale Architect',
      iconName: 'Zap',
      gradient: 'from-rose-500 to-pink-600',
      description: 'Enterprised 8 or more years of developer category experience.',
      unlocked: profile.experienceYears >= 8,
      progressText: `${profile.experienceYears} / 8+ Years`,
      tip: 'Optimize your senior placement weight by adjusting Experience Years to 8 or greater.'
    },
    {
      id: 'connected_pro',
      title: 'Connected Pro',
      iconName: 'Globe',
      gradient: 'from-cyan-400 to-teal-500',
      description: 'Integrated live external handles or portfolio coordinates.',
      unlocked: !!profile.socialLinks && profile.socialLinks.trim().length > 0,
      progressText: profile.socialLinks ? 'Synced' : 'Missing',
      tip: 'Navigate to Profile Settings and add your GitHub or LinkedIn profile paths.'
    }
  ];

  const renderAchievementIcon = (iconName: string, className?: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Globe': return <Globe className={className} />;
      default: return <Award className={className} />;
    }
  };

  // Selected achievement for the interactive badge inspector
  const [selectedAchievementId, setSelectedAchievementId] = useState<string>('rising_star');
  const selectedAchievement = achievementsList.find(a => a.id === selectedAchievementId) || achievementsList[1];

  // Toast announcement system for newly unlocked achievements
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; icon: string; gradient: string } | null>(null);

  const currentUnlockedIds = achievementsList.filter(a => a.unlocked).map(a => a.id);
  const currentUnlockedIdsStr = currentUnlockedIds.join(',');

  useEffect(() => {
    // Only announce achievements unlocked on dynamic changes, avoid immediate spamming on initial mount
    if (unlockedAchievements.length > 0) {
      const newlyAdded = currentUnlockedIds.filter(id => !unlockedAchievements.includes(id));
      if (newlyAdded.length > 0) {
        const matchingBadge = achievementsList.find(a => a.id === newlyAdded[0]);
        if (matchingBadge) {
          setToastMessage({
            title: `Milestone Acquired: ${matchingBadge.title}!`,
            desc: matchingBadge.description,
            icon: matchingBadge.iconName,
            gradient: matchingBadge.gradient
          });
          // Auto-clear toast alert after 5.5s
          const timer = setTimeout(() => setToastMessage(null), 5500);
          return () => {
            clearTimeout(timer);
          };
        }
      }
    }
    setUnlockedAchievements(currentUnlockedIds);
  }, [currentUnlockedIdsStr]);

  // Local handler for job submission
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    onPostNewJob({
      title: newTitle,
      company: newCompany,
      companyLogo: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100&h=100`,
      category: newCategory,
      location: newLocation,
      salaryMin: newMinSalary,
      salaryMax: newMaxSalary,
      type: newType,
      skillsRequired: newSkills.split(',').map(s => s.trim()),
      description: newDesc
    });
    setShowPostModal(false);
    // Clear forms
    setNewTitle('');
    setNewDesc('');
  };

  // Helper to calculate dynamic salary benchmarks based on role, location, expectations and experience
  const calculateSalaryBenchmarkDetails = () => {
    const titleLower = (benchRole || '').toLowerCase();
    const locLower = (benchLocation || '').toLowerCase();

    // 1. Determine base pay scale based on title keyword
    let baseMin = 100000;
    let baseMax = 150000;
    let roleCategory = 'General Technology';

    if (titleLower.includes('architect') || titleLower.includes('principal') || titleLower.includes('staff')) {
      baseMin = 155000;
      baseMax = 230000;
      roleCategory = 'Architecture & Systems';
    } else if (titleLower.includes('director') || titleLower.includes('vp') || titleLower.includes('head of')) {
      baseMin = 175000;
      baseMax = 250000;
      roleCategory = 'Executive Leadership';
    } else if (titleLower.includes('lead') || titleLower.includes('manager')) {
      baseMin = 135000;
      baseMax = 190000;
      roleCategory = 'Management & Technical Teams';
    } else if (titleLower.includes('senior') || titleLower.includes('sr')) {
      baseMin = 120000;
      baseMax = 170000;
      roleCategory = 'Senior Technical Contributor';
    } else if (titleLower.includes('junior') || titleLower.includes('jr') || titleLower.includes('associate') || titleLower.includes('entry')) {
      baseMin = 65000;
      baseMax = 95000;
      roleCategory = 'Junior/Associate Contributor';
    } else if (titleLower.includes('intern')) {
      baseMin = 40000;
      baseMax = 70000;
      roleCategory = 'Intern Placement';
    } else {
      // Default intermediate tech developer
      baseMin = 95000;
      baseMax = 145000;
      roleCategory = 'Professional Contributor';
    }

    // 2. Adjust for category specific modifiers
    let categoryModifier = 1.0;
    let multiplierLabel = 'Standard Tech Base';
    if (titleLower.includes('ai') || titleLower.includes('machine learning') || titleLower.includes('dataset') || titleLower.includes('llm') || titleLower.includes('data scientist')) {
      categoryModifier = 1.25;
      multiplierLabel = 'AI / Intelligent Systems Premium (+25%)';
    } else if (titleLower.includes('cloud') || titleLower.includes('devops') || titleLower.includes('security') || titleLower.includes('rust')) {
      categoryModifier = 1.15;
      multiplierLabel = 'Infrastructure & Systems Premium (+15%)';
    }

    // 3. Adjust for location modifiers
    let locMultiplier = 1.0;
    let locationLabel = 'Standard National Average';

    if (locLower.includes('san francisco') || locLower.includes('sf') || locLower.includes('bay area') || locLower.includes('silicon valley')) {
      locMultiplier = 1.24;
      locationLabel = 'Bay Area Metro Cost of Living (+24%)';
    } else if (locLower.includes('new york') || locLower.includes('ny') || locLower.includes('nyc') || locLower.includes('manhattan')) {
      locMultiplier = 1.20;
      locationLabel = 'NYC Metro Cost of Living (+20%)';
    } else if (locLower.includes('seattle') || locLower.includes('wa')) {
      locMultiplier = 1.15;
      locationLabel = 'Seattle Tech Hub (+15%)';
    } else if (locLower.includes('austin') || locLower.includes('tx') || locLower.includes('boston') || locLower.includes('london')) {
      locMultiplier = 1.10;
      locationLabel = 'High Activity Tech Cluster (+10%)';
    } else if (locLower.includes('remote') || locLower.includes('distributed')) {
      locMultiplier = 1.05;
      locationLabel = 'Remote Global Alignment (+5%)';
    }

    // 4. Years of experience multiplier
    const expValue = Math.min(Math.max(benchExp || 0, 0), 25);
    const experienceBonus = expValue * 4500;

    // Percentile calculations
    const p10 = Math.round((baseMin * categoryModifier * locMultiplier) + (experienceBonus * 0.7));
    const p50 = Math.round((((baseMin + baseMax) / 2) * categoryModifier * locMultiplier) + experienceBonus);
    const p90 = Math.round((baseMax * 1.18 * categoryModifier * locMultiplier) + (experienceBonus * 1.3));

    // Calculate user target percentile standing
    const target = benchTargetSalary || 120000;
    let percentile = 10;
    let status = 'Below Market Base';
    let statusColor = 'text-brand-muted border-white/10';

    if (target < p10) {
      percentile = Math.max(5, Math.round((target / p10) * 10));
      status = 'Below Standard Minimum';
      statusColor = 'text-rose-400 border-rose-500/20 bg-rose-500/5';
    } else if (target === p10) {
      percentile = 10;
      status = 'Market Standard Base (10th Percentile)';
      statusColor = 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    } else if (target < p50) {
      const fraction = (target - p10) / (p50 - p10);
      percentile = Math.round(10 + fraction * 40);
      status = 'Below Market Average';
      statusColor = 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    } else if (target === p50) {
      percentile = 50;
      status = 'Market Median (50th Percentile)';
      statusColor = 'text-brand-primary border-brand-primary/20 bg-brand-primary/5';
    } else if (target < p90) {
      const fraction = (target - p50) / (p90 - p50);
      percentile = Math.round(50 + fraction * 40);
      status = 'Highly Competitive Premium';
      statusColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    } else {
      const excess = (target - p90) / p90;
      percentile = Math.min(99, Math.round(90 + excess * 10));
      status = 'Elite Top-Tier Compensation (90th+ Percentile)';
      statusColor = 'text-amber-400 border-amber-400/20 bg-amber-400/5';
    }

    const differenceFromMedianPct = Math.round(((target - p50) / p50) * 100);

    // Associated skills and negotiation templates
    let skillsList: string[] = [];
    if (titleLower.includes('frontend') || titleLower.includes('react') || titleLower.includes('ui') || titleLower.includes('design')) {
      skillsList = ['Tailwind v4 / Theme Optimization', 'Web Vital Rendering Optimizations', 'Next.js 15 Server Components'];
    } else if (titleLower.includes('backend') || titleLower.includes('architect') || titleLower.includes('systems') || titleLower.includes('rust')) {
      skillsList = ['Distributed Consensus (Raft/Paxos)', 'High-Concurrency Rust/Go Pipelines', 'Zero-Downtime Migration Architecture'];
    } else if (titleLower.includes('ai') || titleLower.includes('machine') || titleLower.includes('data')) {
      skillsList = ['RAG Optimization & Vectors (Pinecone)', 'Fine-tuning (Deepspeed/PyTorch)', 'Gemini Developer Custom Integrations'];
    } else {
      skillsList = ['Infrastructure Scaling & Kubernetes', 'System Design & Tradeoffs Documentation', 'Vulnerability & Security Standards'];
    }

    return {
      p10,
      p50,
      p90,
      percentile,
      status,
      statusColor,
      differenceFromMedianPct,
      roleCategory,
      multiplierLabel,
      locationLabel,
      skillsList
    };
  };

  return (
    <div className="space-y-10 pb-16">
      
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className="bg-[#0c1322]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-start gap-3.5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent pointer-events-none" />
              {/* Glowing animated bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-success animate-pulse" />
              
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${toastMessage.gradient} text-white flex-shrink-0 shadow-lg shadow-black/40`}>
                {renderAchievementIcon(toastMessage.icon, "w-5 h-5")}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-brand-success uppercase font-mono tracking-wider font-semibold block">Milestone Complete!</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{toastMessage.title}</h4>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">{toastMessage.desc}</p>
              </div>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-brand-muted hover:text-white transition-colors"
                aria-label="Dismiss Notification"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. SEEKER REGENCY PORTAL */}
      {role === 'seeker' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main LHS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Seeker Tab Switcher */}
            <div className="flex p-1 bg-white/[0.02] border border-white/5 rounded-2xl max-w-2xl mb-6">
              <button
                type="button"
                onClick={() => setActiveSeekerTab('overview')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                  activeSeekerTab === 'overview'
                    ? 'bg-gradient-to-r from-brand-primary/30 to-brand-secondary/30 text-white border border-brand-secondary/30 shadow-lg shadow-brand-primary/10' 
                    : 'text-brand-muted hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>Overview Pipeline</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSeekerTab('settings')}
                className={`flex-1 py-1.5 px-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeSeekerTab === 'settings'
                    ? 'bg-gradient-to-r from-brand-primary/30 to-brand-secondary/30 text-white border border-brand-secondary/30 shadow-lg shadow-brand-primary/10' 
                    : 'text-brand-muted hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Profile Settings</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSeekerTab('salary')}
                className={`flex-1 py-1.5 px-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeSeekerTab === 'salary'
                    ? 'bg-gradient-to-r from-brand-primary/30 to-brand-secondary/30 text-white border border-brand-secondary/30 shadow-lg shadow-brand-primary/10' 
                    : 'text-brand-muted hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Salary Benchmark</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSeekerTab('simulator')}
                className={`flex-1 py-1.5 px-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeSeekerTab === 'simulator'
                    ? 'bg-gradient-to-r from-brand-primary/30 to-brand-secondary/30 text-white border border-brand-secondary/30 shadow-lg shadow-brand-primary/10' 
                    : 'text-brand-muted hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>Career Simulator</span>
              </button>
            </div>

            {activeSeekerTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Overview Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-brand-card p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/5 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-brand-muted uppercase font-mono tracking-widest">Active Applications</span>
                      <Briefcase className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-white">{appliedJobs.length + 2}</div>
                    <div className="text-[10px] text-brand-success flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +2 updated today
                    </div>
                  </div>

                  <div className="bg-brand-card p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-secondary/5 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-brand-muted uppercase font-mono tracking-widest">Profile Views</span>
                      <Users className="w-4 h-4 text-brand-secondary" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-white">1,240</div>
                    <div className="text-[10px] text-brand-primary">Upper 12% in Sector</div>
                  </div>

                  <div className="bg-brand-card p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-success/5 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-brand-muted uppercase font-mono tracking-widest">Viability Rating</span>
                      <Award className="w-4 h-4 text-brand-success" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-white">96%</div>
                    <div className="text-[10px] text-brand-success">Perfect ATS configuration</div>
                  </div>
                </div>

                {/* Current Application Tracking Matrix */}
                <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
                  <h3 className="font-bold text-white text-md">Job Seeker Progress Pipelines</h3>
                  
                  <div className="space-y-4">
                    {appliedJobs.length === 0 ? (
                      <div className="text-center p-8 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-xs text-brand-muted block">No active applications currently in progress. Apply to sample jobs to see real-time updates here.</span>
                      </div>
                    ) : (
                      appliedJobs.map((job, idx) => {
                        const statusCycle: Application['status'][] = ['applied', 'screening', 'interview', 'offer'];
                        const currentStatus = statusCycle[idx % statusCycle.length];

                        return (
                          <div key={job.id} className="p-4 bg-brand-elevated/40 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-white">{job.title}</h4>
                              <span className="text-[10px] text-brand-muted uppercase block font-mono">{job.company} — {job.location}</span>
                            </div>

                            {/* Pipeline Status indicators */}
                            <div className="flex items-center gap-1.5 sm:gap-3">
                              {statusCycle.map((st, sIdx) => {
                                const isPastOrCurrent = statusCycle.indexOf(st) <= statusCycle.indexOf(currentStatus);
                                const isActive = st === currentStatus;

                                return (
                                  <div key={st} className="flex items-center">
                                    <div className={`px-2 py-1 rounded text-[9px] font-mono capitalize border ${
                                      isActive 
                                        ? 'bg-brand-primary/20 text-brand-primary border-brand-primary font-mono'
                                        : isPastOrCurrent
                                          ? 'bg-brand-success/10 text-brand-success border-brand-success/20 font-mono'
                                          : 'bg-white/5 text-brand-muted border-white/5 font-mono'
                                    }`}>
                                      {st}
                                    </div>
                                    {sIdx < 3 && <span className="text-xs text-brand-muted px-1">→</span>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Career Development Milestone tracker */}
                <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
                  <h3 className="font-bold text-white text-sm">Professional Blueprint Timeline</h3>
                  <div className="space-y-4 relative pl-3 border-l border-white/10 ml-1">
                    <div className="relative">
                      <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-brand-primary"></div>
                      <span className="text-[10px] text-brand-primary font-mono block">STAGE 3 — CURRENT</span>
                      <span className="text-xs font-bold text-white block mt-0.5">Mock Executive Interview Alignment</span>
                      <p className="text-[11px] text-brand-muted mt-0.5">Use our AI Career Coach and prep modules to finalize negotiation talking points.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-brand-success"></div>
                      <span className="text-[10px] text-brand-success font-mono block">STAGE 2 — SUCCESS</span>
                      <span className="text-xs font-bold text-white block mt-0.5">ATS Blueprint Optimization</span>
                      <p className="text-[11px] text-brand-muted mt-0.5">Achieved a top 96% resume score using the parsing optimizer algorithms.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-brand-success"></div>
                      <span className="text-[10px] text-brand-success font-mono block">STAGE 1 — COMPLETED</span>
                      <span className="text-xs font-bold text-white block mt-0.5">Platform Credential Setup </span>
                      <p className="text-[11px] text-brand-muted mt-0.5">Verified candidate metrics, validated location standards, and initialized core profile parameters.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSeekerTab === 'settings' && (
              <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
                <div>
                  <h3 className="text-md font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-brand-primary" />
                    Interactive Profile Blueprint Settings
                  </h3>
                  <p className="text-xs text-brand-muted mt-1">
                    Directly modify your profile details below to optimize your candidate placement. State changes recalculate your score dynamically.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Essential Profile Data */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">Full Name</label>
                      <input
                        type="text"
                        className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white transition-all font-sans"
                        placeholder="Sarah Jenkins"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">Professional Job Title</label>
                      <input
                        type="text"
                        className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white transition-all font-sans"
                        placeholder="Lead Frontend Architect"
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">Geographic Location</label>
                      <input
                        type="text"
                        className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white transition-all font-sans"
                        placeholder="San Francisco, CA"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">Social & Professional Links</label>
                      <input
                        type="text"
                        className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white font-mono transition-all"
                        placeholder="github.com/username, linkedin.com/in/username"
                        value={profile.socialLinks}
                        onChange={(e) => setProfile({ ...profile, socialLinks: e.target.value })}
                      />
                      <span className="text-[9px] text-brand-muted mt-1 block">Comma-separated URLs or handles</span>
                    </div>

                    <div>
                      <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">Contact Email Address</label>
                      <input
                        type="email"
                        className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white transition-all font-sans"
                        placeholder="email@address.com"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Right Column: Narrative Biography & Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">Short Career Biography</label>
                      <textarea
                        className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white h-[98px] transition-all custom-scrollbar font-sans"
                        placeholder="Highly accomplished developer..."
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">Technical Skills Suite</label>
                      <input
                        type="text"
                        className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white transition-all font-sans"
                        placeholder="React, TypeScript, TailwindCSS"
                        value={profile.skills}
                        onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 font-sans">
                      <div>
                        <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">Experience Years</label>
                        <input
                          type="number"
                          className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white transition-all font-sans"
                          value={profile.experienceYears}
                          onChange={(e) => setProfile({ ...profile, experienceYears: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">Target Salary</label>
                        <input
                          type="text"
                          className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white transition-all font-sans"
                          placeholder="$165,000"
                          value={profile.desiredSalary}
                          onChange={(e) => setProfile({ ...profile, desiredSalary: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1 font-semibold">Profile Avatar URL</label>
                      <input
                        type="text"
                        className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white transition-all font-mono"
                        value={profile.avatarUrl}
                        onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-between items-center bg-brand-elevated/20 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-[9px] text-brand-muted font-mono uppercase tracking-wider">State Synchronized Instantly</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSeekerTab('overview')}
                    className="px-4 py-2 bg-brand-primary hover:bg-opacity-90 active:scale-[0.98] transition-all text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10"
                  >
                    View Pipeline Overview
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeSeekerTab === 'salary' && (() => {
              const {
                p10,
                p50,
                p90,
                percentile,
                status,
                statusColor,
                differenceFromMedianPct,
                roleCategory,
                multiplierLabel,
                locationLabel,
                skillsList
              } = calculateSalaryBenchmarkDetails();

              const handleCopyPitch = () => {
                const pitch = `In entering this compensation discussion, I have aligned my baseline rate of $${benchTargetSalary.toLocaleString()} annually against competitive real-time intelligence for standard ${benchRole} positions in ${benchLocation} with ${benchExp} years of domain experience. Given my specific focus in technical paradigms like ${skillsList.join(', ')}, this represents a target grounded securely in top-tier industry value brackets.`;
                navigator.clipboard.writeText(pitch);
                setToastMessage({
                  title: "Strategic Script Copied!",
                  desc: "The customized compensation pitch script has been successfully copied to your clipboard. Use it to align negotiations.",
                  icon: "Award",
                  gradient: "from-emerald-500 to-teal-500"
                });
              };

              return (
                <div className="space-y-6">
                  {/* Top Header Card */}
                  <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-brand-success/5 rounded-full blur-3xl" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-md font-bold text-white flex items-center gap-2 font-display">
                          <DollarSign className="w-5 h-5 text-emerald-400" />
                          Premium Compensation Intelligence Node
                        </h3>
                        <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                          Define your professional parameters to run automated real-world benchmark mappings.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-md bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 self-start md:self-center">
                        Active Database Tier
                      </span>
                    </div>

                    {/* Inputs Subsection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1.5 font-semibold">Target Job Role</label>
                          <input
                            type="text"
                            className="w-full bg-brand-bg/90 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white transition-all font-sans"
                            value={benchRole}
                            onChange={(e) => setBenchRole(e.target.value)}
                            placeholder="e.g. Lead Frontend Architect"
                          />
                        </div>

                        <div>
                          <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider mb-1.5 font-semibold">Geographic Region</label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full bg-brand-bg/90 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-brand-primary text-white transition-all font-sans"
                              value={benchLocation}
                              onChange={(e) => setBenchLocation(e.target.value)}
                              placeholder="e.g. San Francisco, CA"
                            />
                            <MapPin className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider font-semibold">Years of Core Experience</label>
                            <span className="text-xs font-mono font-bold text-white">{benchExp} Years</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="25"
                              step="1"
                              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                              value={benchExp}
                              onChange={(e) => setBenchExp(Number(e.target.value))}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-brand-muted text-[10px] uppercase font-mono tracking-wider font-semibold">Desired Target Salary</label>
                            <span className="text-xs font-mono font-bold text-emerald-400">${benchTargetSalary.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setBenchTargetSalary(prev => Math.max(50000, prev - 5000))}
                              className="w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg border border-white/5 text-white hover:bg-white/10 text-xs active:scale-95 font-bold"
                            >
                              -
                            </button>
                            <input
                              type="range"
                              min="50000"
                              max="350000"
                              step="5000"
                              className="flex-1 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                              value={benchTargetSalary}
                              onChange={(e) => setBenchTargetSalary(Number(e.target.value))}
                            />
                            <button
                              type="button"
                              onClick={() => setBenchTargetSalary(prev => Math.min(350000, prev + 5000))}
                              className="w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg border border-white/5 text-white hover:bg-white/10 text-xs active:scale-95 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/5 pt-3 text-[10px] font-mono text-brand-muted">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        Role Category: <strong className="text-white">{roleCategory}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                        Adjusters: <strong className="text-white">{multiplierLabel}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Geo weighting: <strong className="text-white">{locationLabel}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Primary Analytics metrics cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-brand-card p-5 rounded-2xl border border-white/5 space-y-1.5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/5 rounded-full blur-2xl" />
                      <span className="text-[10px] text-brand-muted uppercase font-mono tracking-wider block">Target Selection</span>
                      <div className="text-2xl font-bold font-mono text-white">${benchTargetSalary.toLocaleString()}</div>
                      <span className="text-[9px] text-brand-muted block font-sans">Desired compensation level</span>
                    </div>

                    <div className="bg-brand-card p-5 rounded-2xl border border-white/5 space-y-1.5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-secondary/5 rounded-full blur-2xl" />
                      <span className="text-[10px] text-brand-muted uppercase font-mono tracking-wider block">Market Median (50th)</span>
                      <div className="text-2xl font-bold font-mono text-white">${p50.toLocaleString()}</div>
                      <span className="text-[9px] text-brand-muted block font-sans">Matching local baseline index</span>
                    </div>

                    <div className="bg-brand-card p-5 rounded-2xl border border-white/5 space-y-1.5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl" />
                      <span className="text-[10px] text-brand-muted uppercase font-mono tracking-wider block">Market Delta Variance</span>
                      <div className={`text-2xl font-bold font-mono flex items-center gap-1 ${
                        differenceFromMedianPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {differenceFromMedianPct >= 0 ? '+' : ''}{differenceFromMedianPct}%
                      </div>
                      <span className="text-[9px] text-brand-muted block font-sans">Relative to local role baseline</span>
                    </div>
                  </div>

                  {/* Detailed Distribution Curve Graphic */}
                  <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
                        <TrendingUp className="w-4 h-4 text-brand-primary" />
                        System Market Distribution Mapping
                      </h4>
                      <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed">
                        Visualizing user's expected target against calculated sector percentiles.
                      </p>
                    </div>

                    <div className="pt-4 pb-2 space-y-5">
                      {/* Interactive Visual Gauge Slider Bar */}
                      <div className="relative pt-6">
                        {/* 10th-50th-90th track */}
                        <div className="h-3.5 bg-[#030712] rounded-full relative border border-white/5 overflow-hidden flex">
                          <div className="h-full w-[25%] bg-brand-primary/10 border-r border-dashed border-white/10 flex items-center justify-center text-[8px] font-mono text-brand-muted">
                            Lower Range
                          </div>
                          <div className="h-full w-[50%] bg-gradient-to-r from-brand-primary/15 to-emerald-400/15 border-r border-dashed border-white/10 flex items-center justify-center text-[8px] font-mono text-brand-muted">
                            Median Bracket
                          </div>
                          <div className="h-full w-[25%] bg-amber-400/5 flex items-center justify-center text-[8px] font-mono text-brand-muted">
                            Upper Premium
                          </div>
                        </div>

                        {/* Benchmark Pins (Labels on top of the bar) */}
                        <div className="absolute top-0 left-0 right-0 flex justify-between px-2 text-[9px] font-mono text-brand-muted">
                          <span className="flex flex-col items-center">
                            <span>10th Percentile</span>
                            <strong className="text-white mt-0.5">${p10.toLocaleString()}</strong>
                          </span>
                          <span className="flex flex-col items-center">
                            <span>50th (Median)</span>
                            <strong className="text-white mt-0.5">${p50.toLocaleString()}</strong>
                          </span>
                          <span className="flex flex-col items-center">
                            <span>90th Percentile</span>
                            <strong className="text-white mt-0.5">${p90.toLocaleString()}</strong>
                          </span>
                        </div>

                        {/* Needle/Pin for User target position */}
                        {(() => {
                          // Math percentage representation on bar (cap between 4% and 96%)
                          let offset = 50;
                          if (benchTargetSalary <= p10) {
                            offset = Math.max(5, (benchTargetSalary / p10) * 25);
                          } else if (benchTargetSalary <= p50) {
                            const frac = (benchTargetSalary - p10) / (p50 - p10);
                            offset = 25 + (frac * 50);
                          } else {
                            const frac = Math.min(1, (benchTargetSalary - p50) / (p90 - p50));
                            offset = 75 + (frac * 21);
                          }

                          return (
                            <motion.div
                              className="absolute -top-1 flex flex-col items-center"
                              style={{ left: `${offset}%` }}
                              animate={{ left: `${offset}%` }}
                              transition={{ type: 'spring', stiffness: 50 }}
                            >
                              <div className="px-2 py-0.5 bg-brand-secondary text-white font-mono text-[9px] rounded-md font-bold shadow-lg flex items-center gap-1 transform -translate-x-1/2 select-none border border-brand-secondary/30">
                                <span>Target PIN</span>
                                <span>${Math.round(benchTargetSalary / 1000)}k</span>
                              </div>
                              <div className="w-1.5 h-6 bg-brand-secondary rounded-full shadow shadow-black mt-1 transform -translate-x-1/2 border border-white/20 animate-pulse" />
                            </motion.div>
                          );
                        })()}
                      </div>

                      {/* Diagnostic positioning details feedback */}
                      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${statusColor} text-xs leading-relaxed`}>
                        <div className="space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-brand-secondary" />
                            Percentile Ranking Assessment: <span className="underline decoration-indigo-500 font-mono">{percentile}th Percentile</span>
                          </div>
                          <p className="text-[11px] text-brand-muted font-sans">
                            Based on local factors of <strong className="text-white font-mono">{benchLocation}</strong> and role category weighting. Matches candidate placement parameters.
                          </p>
                        </div>
                        <div className="px-3.5 py-1.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-center self-start md:self-auto font-bold">
                          Positioning: <strong className="text-white uppercase tracking-wider block mt-0.5">{status}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Alignment & Copilot Phrasing panels */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                    {/* Premium Skills Accelerator Panel */}
                    <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
                      <div className="flex items-center gap-1.5 text-white text-xs font-bold font-sans uppercase tracking-wider pb-1.5 border-b border-white/5">
                        <Lightbulb className="w-4 h-4 text-emerald-400" />
                        <span>High-Leverage Skill Premiums</span>
                      </div>
                      <p className="text-[11px] text-brand-muted leading-relaxed">
                        Industry research indicates that candidates with proven expertise in these capabilities qualify directly for premium, upper-quadrant compensation:
                      </p>
                      
                      <div className="space-y-2.5 pt-1">
                        {skillsList.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2.5 p-2 bg-white/[0.02] border border-white/5 hover:border-brand-primary/20 hover:bg-brand-primary/[0.01] rounded-xl transition-all">
                            <span className="w-5 h-5 flex-shrink-0 bg-brand-primary/10 text-brand-primary text-[10px] font-mono font-bold flex items-center justify-center rounded-lg border border-brand-primary/20">
                              +{index * 3 + 4}%
                            </span>
                            <span className="text-xs text-white font-medium">{skill}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-brand-primary/5 p-2.5 rounded-lg border border-brand-primary/10 text-[10px] text-[#93C5FD] leading-relaxed flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>ATS Implementation Tip:</strong> Incorporate these critical systems keywords inside your <strong>Profile Settings / Skills Suite</strong> to notify match tracking.
                        </span>
                      </div>
                    </div>

                    {/* AI Copy-Pasteable Pitch Phrasing */}
                    <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-secondary/5 rounded-full blur-2xl font-mono text-[9px] text-transparent" />
                      <div className="flex items-center justify-between text-white text-xs font-bold font-sans uppercase tracking-wider pb-1.5 border-b border-white/5">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-brand-secondary" />
                          <span>AI Negotiation Script Copilot</span>
                        </div>
                        <span className="text-[9px] font-mono text-brand-muted">Strategic Phrasing</span>
                      </div>

                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <h5 className="text-[10px] font-bold uppercase font-mono text-brand-secondary">Core Value Anchor Statement</h5>
                          <div className="p-3 bg-black/40 border border-white/5 rounded-xl font-sans text-[11px] text-brand-muted leading-relaxed relative italic select-all cursor-context-menu">
                            "In entering this compensation discussion, I have aligned my baseline rate of <strong className="text-white font-sans">${benchTargetSalary.toLocaleString()}</strong> annually against competitive real-time intelligence for standard <strong className="text-white font-sans">{benchRole}</strong> positions in <strong className="text-white font-sans">{benchLocation}</strong>. Given my focus in technical paradigms like <strong className="text-white font-sans">{skillsList.join(', ')}</strong>, this represents a target grounded securely in top-tier value brackets."
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="text-[9px] font-mono text-brand-muted flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
                            Optimized for executive delivery
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyPitch}
                            className="px-3.5 py-1.5 bg-brand-secondary hover:bg-[#7c3aed] active:scale-95 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-brand-secondary/15"
                          >
                            Copy Strategic Pitch
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeSeekerTab === 'simulator' && (
              <CareerPathSimulator 
                resumeAnalysis={resumeAnalysis} 
                profile={profile} 
              />
            )}
          </div>

          {/* RHS Panels for seek progress indicators */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* NEW VISUAL RESUME HEALTH GAUGE */}
            {(() => {
              const score = resumeAnalysis ? resumeAnalysis.overallScore : 92;
              return (
                <div className="bg-[#0b1220]/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl"></div>
                  
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="text-xs text-brand-muted uppercase font-mono tracking-wider">AI Resume Health Index</span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                      score >= 90
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : score >= 80
                          ? 'bg-indigo-500/10 text-brand-primary border border-indigo-500/20'
                          : 'bg-amber-500/10 text-brand-warning border border-amber-500/20'
                    }`}>
                      {score >= 90 ? 'ATS Compatible: Elite' : score >= 80 ? 'Compatible: Highly Competent' : 'Action Draft Required'}
                    </span>
                  </div>

                  <div className="relative pt-2">
                    <div className="h-32 flex items-center justify-center relative overflow-hidden">
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                          <defs>
                            <linearGradient id="resumeGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8B5CF6" /> {/* purple-500 */}
                              <stop offset="50%" stopColor="#3B82F6" /> {/* blue-500 */}
                              <stop offset="100%" stopColor="#10B981" /> {/* emerald-500 */}
                            </linearGradient>
                          </defs>
                          <Pie
                            data={[
                              { value: score, fill: 'url(#resumeGaugeGradient)' },
                              { value: 100 - score, fill: 'rgba(255, 255, 255, 0.05)' }
                            ]}
                            cx="50%"
                            cy={110}
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            dataKey="value"
                            stroke="none"
                          >
                            <Cell key="cell-0" fill="url(#resumeGaugeGradient)" />
                            <Cell key="cell-1" fill="rgba(255, 255, 255, 0.05)" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Absolute Center Text */}
                      <div className="absolute top-[48px] left-0 right-0 text-center flex flex-col items-center">
                        <span className="text-3xl font-extrabold font-mono text-white tracking-tight leading-none">
                          {score > 0 ? `${score}` : 'N/A'}
                        </span>
                        <span className="text-[9px] text-brand-muted uppercase tracking-wider font-mono mt-1">
                          ATS Quality Rating
                        </span>
                      </div>
                    </div>

                    {/* Gauge Status Limits */}
                    <div className="flex justify-between text-[9px] font-mono text-brand-muted px-2 -mt-4 pb-2 border-b border-white/5">
                      <span>ATS Floor (60)</span>
                      <span>Perfect Match (100)</span>
                    </div>
                  </div>

                  {/* Status Brief Summary */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                      {score >= 90 ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : score >= 80 ? (
                        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-brand-warning shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5">
                        <h5 className="text-[11px] font-bold text-white leading-snug">
                          {score >= 90 ? 'Executive Standard Approved' : score >= 80 ? 'Minor Enhancements Pending' : 'Substandard Keyword Weights'}
                        </h5>
                        <p className="text-[10px] text-brand-muted leading-relaxed">
                          {resumeAnalysis?.feedback || 'Please run a file upload analysis in career operations for real-time compliance results.'}
                        </p>
                      </div>
                    </div>

                    {/* Tactical actions suggestion */}
                    {resumeAnalysis && resumeAnalysis.missingSkills.length > 0 && (
                      <div className="text-[10px] text-brand-muted space-y-1 bg-white/[0.01] p-2.5 rounded-xl border border-white/5">
                        <span className="text-[8px] uppercase tracking-wider font-mono font-bold text-brand-secondary block">
                          Priority Target Keywords to Inject:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resumeAnalysis.missingSkills.map((sk, idx) => (
                            <span key={idx} className="text-[9px] font-mono px-2 py-0.5 bg-brand-secondary/10 border border-brand-secondary/25 text-brand-secondary rounded">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Navigation Button */}
                    <button
                      type="button"
                      onClick={() => onNavigateToTab?.('analyzer')}
                      className="w-full py-2 bg-gradient-to-r from-brand-primary/25 to-brand-secondary/25 hover:from-brand-primary/35 hover:to-brand-secondary/35 border border-brand-secondary/35 hover:border-brand-secondary/50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Open Full AI Analyzer Studio
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* PROFILE COMPLETION BLUEPRINT CARD */}
            <div className="bg-[#0b1220]/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl"></div>
              
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-xs text-brand-muted uppercase font-mono tracking-wider">AI Profile Readiness</span>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                  completionPercentage === 100 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-brand-primary/15 text-brand-primary border border-brand-primary/20'
                }`}>
                  {completionPercentage === 100 ? 'Audit Level: Perfect' : 'Enhancements Ready'}
                </span>
              </div>

              <div className="flex items-center gap-5">
                {/* SVG Circular Progress Indicator */}
                <div className="relative flex-shrink-0">
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="profileProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22D3EE" /> {/* cyan-400 */}
                        <stop offset="50%" stopColor="#3B82F6" /> {/* blue-500 */}
                        <stop offset="100%" stopColor="#8B5CF6" /> {/* purple-500 */}
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.06)"
                      strokeWidth="7"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="url(#profileProgressGradient)"
                      strokeWidth="7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: completionPercentage / 100 }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base font-bold font-mono text-white leading-none">{completionPercentage}%</span>
                    <span className="text-[8px] text-brand-muted uppercase font-mono mt-0.5">Ready</span>
                  </div>
                </div>

                {/* Completion Status Information */}
                <div className="space-y-1 min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white">Talent Ecosystem Score</h4>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    Filled <span className="text-white font-mono font-bold">{completedFields.length}</span> out of <span className="text-white font-mono">{profileFields.length}</span> core blueprint attributes.
                  </p>
                  
                  {completionPercentage < 100 ? (
                    <div className="text-[10px] text-brand-primary font-medium flex items-center gap-1 mt-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      Ready to boost ATS weight!
                    </div>
                  ) : (
                    <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3" />
                      All profile checkpoints complete
                    </div>
                  )}
                </div>
              </div>

              {/* Outstanding actions helper list */}
              {completionPercentage < 100 && (
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl space-y-2 text-[10px] font-sans">
                  <span className="text-brand-muted block uppercase font-mono tracking-wider font-semibold text-[8px]">Unlocks Higher ATS Matching Rank:</span>
                  <div className="space-y-1.5 max-h-[100px] overflow-y-auto custom-scrollbar">
                    {profileFields.filter(f => !f.check((profile as any)[f.key])).slice(0, 3).map(field => (
                      <div key={field.key} className="flex items-center gap-1.5 text-brand-muted">
                        <span className="w-1 h-1 rounded-full bg-brand-primary/70"></span>
                        <span>Add <strong className="text-brand-primary font-medium">{field.label}</strong> to gain <strong className="text-emerald-400 font-mono">+10%</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowEditProfileModal(true)}
                className="w-full py-2 bg-brand-primary hover:bg-opacity-90 active:scale-[0.98] transition-all text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10"
              >
                <Sliders className="w-3.5 h-3.5" />
                Refine Candidate Blueprint
              </button>
            </div>

            {/* ECOSYSTEM CREDENTIALS & ACHIEVEMENTS */}
            <div className="bg-[#0b1220]/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 rounded-full blur-2xl"></div>
              
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-1.5 text-white text-xs font-bold font-sans uppercase tracking-wider">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Ecosystem Badges</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                  {achievementsList.filter(a => a.unlocked).length} / {achievementsList.length} Unlocked
                </span>
              </div>

              {/* Mini linear achievements progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-brand-muted">
                  <span>Milestone Completion</span>
                  <span>{Math.round((achievementsList.filter(a => a.unlocked).length / achievementsList.length) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-amber-400 via-brand-primary to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievementsList.filter(a => a.unlocked).length / achievementsList.length) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-3 gap-3">
                {achievementsList.map((badge) => {
                  const isSelected = selectedAchievementId === badge.id;
                  
                  return (
                    <motion.button
                      key={badge.id}
                      type="button"
                      onClick={() => setSelectedAchievementId(badge.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative aspect-square rounded-xl p-2.5 border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        badge.unlocked
                          ? isSelected
                            ? 'bg-[#1e1b4b]/40 border-brand-secondary shadow-lg shadow-brand-secondary/15 text-white'
                            : 'bg-brand-elevated/40 border-white/10 hover:border-white/20 text-white'
                          : isSelected
                            ? 'bg-white/[0.02] border-brand-primary/50 text-brand-muted'
                            : 'bg-white/[0.02] border-white/5 opacity-50 hover:opacity-75 text-brand-muted'
                      }`}
                    >
                      {/* Active glowing indicator */}
                      {badge.unlocked && (
                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}

                      <div className={`p-1.5 rounded-lg ${
                        badge.unlocked 
                          ? `bg-gradient-to-br ${badge.gradient} text-white shadow-md shadow-black/30` 
                          : 'bg-white/5 text-[#4B5563]'
                      }`}>
                        {renderAchievementIcon(badge.iconName, "w-4 h-4")}
                      </div>

                      <span className="text-[9px] font-bold mt-2 text-center truncate w-full text-white" title={badge.title}>
                        {badge.title}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Achievement Inspector */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-sans flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-brand-primary" />
                    Badge Inspector
                  </h4>
                  <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                    selectedAchievement.unlocked 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-white/5 text-brand-muted border border-white/5'
                  }`}>
                    {selectedAchievement.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-baseline gap-1">
                    <span className="text-xs font-bold text-white">{selectedAchievement.title}</span>
                    <span className="text-[9px] font-mono text-brand-muted flex-shrink-0">
                      Progress: {selectedAchievement.progressText}
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-muted leading-relaxed">
                    {selectedAchievement.description}
                  </p>
                </div>

                {!selectedAchievement.unlocked && (
                  <div className="bg-brand-primary/5 p-2 rounded-lg border border-brand-primary/10 text-[9px] text-[#93C5FD] leading-relaxed">
                    <strong className="font-semibold block text-[10px] text-brand-primary mb-0.5">How to acquire:</strong>
                    {selectedAchievement.tip}
                  </div>
                )}
              </div>
            </div>

            {/* YOUR PREMIUM CARD */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 text-center">
              <span className="text-xs text-brand-muted uppercase font-mono tracking-wider block">Your Premium Card</span>
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-brand-primary/30 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary mx-auto flex items-center justify-center font-bold text-white text-lg shadow-lg">
                  {profile.name.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
              )}
              <div>
                <span className="font-bold text-white text-sm block">{profile.name}</span>
                <span className="text-xs text-brand-primary font-medium block">{profile.title}</span>
                {profile.socialLinks && (
                  <div className="flex justify-center flex-wrap gap-1.5 mt-2">
                    {profile.socialLinks.split(',').map((link, idx) => {
                      const cleanLink = link.trim().replace(/^https?:\/\//, '');
                      if (!cleanLink) return null;
                      return (
                        <span key={idx} className="px-1.5 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded text-[9px] text-[#93C5FD] font-mono max-w-[130px] truncate" title={cleanLink}>
                          {cleanLink}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="border-t border-white/5 pt-3 text-xs text-brand-muted text-left space-y-1.5 font-sans">
                <div className="flex justify-between">
                  <span>ATS Level</span>
                  <span className={`font-bold font-mono ${
                    completionPercentage >= 90 ? 'text-emerald-400' : completionPercentage >= 50 ? 'text-brand-primary' : 'text-amber-500'
                  }`}>
                    {completionPercentage >= 90 ? 'Expert' : completionPercentage >= 50 ? 'Intermediate' : 'Novice'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Registered:</span>
                  <span className="text-white font-mono">June 2026</span>
                </div>
                <div className="flex justify-between">
                  <span>Sector target:</span>
                  <span className="text-white font-mono">{completionPercentage > 0 ? 'Technology' : 'Incomplete'}</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Interview Schedule calendar */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-white">Upcoming Calls</span>
                <span className="text-[9px] text-brand-success px-2 py-0.5 bg-brand-success/15 rounded flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" /> Live Event
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-brand-primary uppercase font-mono tracking-widest block">Veridian Dynamics</span>
                  <span className="text-xs text-white font-bold block">Round 1 Architecture Prep</span>
                  <span className="text-[9px] text-brand-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Tomorrow at 14:00 UTC
                  </span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-brand-secondary uppercase font-mono tracking-widest block">NeuraLink</span>
                  <span className="text-xs text-white font-bold block">Technical Coding Evaluation</span>
                  <span className="text-[9px] text-brand-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Monday at 10:30 UTC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        
        // 2. EMPLOYER PORTAL / ATS PIPELINE TRACKING
        <div className="space-y-8">
          
          {/* Top employer stats block */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 text-center sm:text-left space-y-1">
              <span className="text-xs text-brand-muted uppercase font-mono block">Registered Candidates</span>
              <span className="text-4xl font-extrabold text-white font-mono">284</span>
            </div>
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 text-center sm:text-left space-y-1">
              <span className="text-xs text-brand-muted uppercase font-mono block">Screening Complete</span>
              <span className="text-4xl font-extrabold text-brand-primary font-mono">{applications.length}</span>
            </div>
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 text-center sm:text-left space-y-1">
              <span className="text-xs text-brand-muted uppercase font-mono block">Interview Rounds scheduled</span>
              <span className="text-4xl font-extrabold text-brand-secondary font-mono">{invitedCandidates.length}</span>
            </div>
            <div className="bg-[#0B1220]/80 p-5 rounded-2xl border border-white/10 flex items-center justify-center">
              <button
                onClick={() => setShowPostModal(true)}
                className="w-full h-full py-3 px-4 bg-brand-primary hover:bg-opacity-90 text-white font-bold rounded-xl text-sm transition-all"
              >
                + Post Enterprise Job
              </button>
            </div>
          </div>

          {/* ACTIVE APPLICATIONS CRM PIPELINE */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-white text-md">Recruitment CRM & Candidate Pipeline</h3>
                <p className="text-xs text-brand-muted mt-1">Simulate visual progression steps of candidates in your active queue.</p>
              </div>
              <span className="text-[10px] text-brand-success bg-brand-success/15 px-3 py-1 rounded font-mono uppercase tracking-widest font-bold">Systems Operational</span>
            </div>

            {/* STAGE DRAG COLUMN PIPELINE MOCK */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              
              {/* Pipeline Columns: applied | screening | interview | offer | rejected */}
              {(['applied', 'screening', 'interview', 'offer', 'rejected'] as Application['status'][]).map((category) => {
                const columnApps = applications.filter(a => a.status === category);

                return (
                  <div key={category} className="bg-brand-bg p-4 rounded-xl border border-white/10 space-y-3 min-h-[350px] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
                        <span className="text-xs font-bold text-white capitalize">{category}</span>
                        <span className="text-[10px] font-mono font-bold bg-white/5 px-1.5 py-0.5 rounded text-[#A5B4C7]">
                          {columnApps.length}
                        </span>
                      </div>

                      {/* Applicants cards */}
                      <div className="space-y-3">
                        {columnApps.map((app) => (
                          <div key={app.id} className="bg-brand-card p-3 rounded-lg border border-white/5 hover:border-brand-primary/20 transition-all space-y-2">
                            <div>
                              <span className="text-xs font-semibold text-white block mt-0.5">{app.candidateName}</span>
                              <span className="text-[9px] text-[#A5B4C7] block">{app.candidateTitle}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] pt-1">
                              <span className="text-[9px] text-brand-muted italic font-mono uppercase">ATS: {app.resumeScore ?? 92}%</span>
                              <span className="text-brand-primary text-[8px] uppercase tracking-widest">Active</span>
                            </div>

                            {/* Control triggers to shift candidate */}
                            <div className="grid grid-cols-2 gap-1 border-t border-white/5 pt-2 mt-1">
                              {category === 'applied' && (
                                <button
                                  onClick={() => onUpdateAppStatus(app.id, 'screening')}
                                  className="col-span-2 text-[9px] bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white rounded py-1 transition-all"
                                >
                                  Screen Candidate
                                </button>
                              )}
                              {category === 'screening' && (
                                <>
                                  <button
                                    onClick={() => onUpdateAppStatus(app.id, 'interview')}
                                    className="text-[9px] bg-brand-secondary/15 text-brand-secondary hover:bg-brand-secondary hover:text-white rounded py-1 transition-all"
                                  >
                                    Interview Call
                                  </button>
                                  <button
                                    onClick={() => onUpdateAppStatus(app.id, 'rejected')}
                                    className="text-[9px] bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded py-1"
                                  >
                                    Decline
                                  </button>
                                </>
                              )}
                              {category === 'interview' && (
                                <>
                                  <button
                                    onClick={() => onUpdateAppStatus(app.id, 'offer')}
                                    className="text-[9px] bg-brand-success/15 text-brand-success hover:bg-brand-success hover:text-white rounded py-1"
                                  >
                                    Extend Offer
                                  </button>
                                  <button
                                    onClick={() => onUpdateAppStatus(app.id, 'rejected')}
                                    className="text-[9px] bg-red-500/10 text-red-500 hover:bg-red-500 rounded py-1"
                                  >
                                    Decline
                                  </button>
                                </>
                              )}
                              {category === 'offer' && (
                                <div className="col-span-2 text-center text-[9px] bg-brand-success text-white font-bold rounded py-1">
                                  ✓ Signed Contract
                                </div>
                              )}
                              {category === 'rejected' && (
                                <button
                                  onClick={() => onUpdateAppStatus(app.id, 'applied')}
                                  className="col-span-2 text-[9px] text-brand-muted hover:underline"
                                >
                                  Re-enqueue Active
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {columnApps.length === 0 && (
                          <div className="text-center py-8 text-[10px] text-brand-muted">
                            Empty state
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      )}

      {/* 3. POST NEW JOB MODAL DIALOG */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-[#050816]/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 max-w-lg w-full scale-100 transition-all text-white space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-primary" />
                Post New Enterprise Contract
              </h3>
              <button onClick={() => setShowPostModal(false)} className="p-1 hover:bg-white/5 rounded">
                <X className="w-5 h-5 text-brand-muted" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-brand-muted mb-1">Contract Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Staff Machine Learning Strategist"
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-muted mb-1">Sector Category</label>
                  <select
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-2 py-2 text-white"
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Type</label>
                  <select
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-2 py-2 text-white"
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-muted mb-1">Min Salary ($)</label>
                  <input
                    type="number"
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white"
                    value={newMinSalary}
                    onChange={(e) => setNewMinSalary(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Max Salary ($)</label>
                  <input
                    type="number"
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white"
                    value={newMaxSalary}
                    onChange={(e) => setNewMaxSalary(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-muted mb-1">Location Details</label>
                <input
                  type="text"
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1">Technical Stack keywords (comma-separated)</label>
                <input
                  type="text"
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1">Functional Description</label>
                <textarea
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white h-24"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-primary text-white font-bold rounded-xl text-xs hover:bg-opacity-95"
              >
                Launch Live Requisition
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. EDIT CANDIDATE BLUEPRINT MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-[#050816]/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto scale-100 transition-all text-white space-y-5 custom-scrollbar">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" />
                Refine Candidate Blueprint
              </h3>
              <button onClick={() => setShowEditProfileModal(false)} className="p-1 hover:bg-white/5 rounded">
                <X className="w-5 h-5 text-brand-muted" />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-brand-primary/10 border border-brand-primary/20 p-4 rounded-2xl">
              <div className="relative flex-shrink-0">
                <svg className="w-14 h-14" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#22D3EE"
                    strokeWidth="8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: completionPercentage / 100 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold font-mono text-white">{completionPercentage}%</span>
                </div>
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-white block">Interactive Alignment Feedback</span>
                <span className="text-brand-muted block">
                  Each completed field increases your discoverability rating by 10%. Complete your profile details for an automated priority boost the ATS algorithms look for.
                </span>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowEditProfileModal(false); }} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-muted mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Professional Headline *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-muted mb-1">Contact Email Address *</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Geographic Location *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-muted mb-1">Technical Skills Suite (comma-separated)</label>
                  <input
                    type="text"
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white"
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Years of Enterprise Experience</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white"
                    value={profile.experienceYears}
                    onChange={(e) => setProfile({ ...profile, experienceYears: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-muted mb-1">Expected Annual Salary Target</label>
                  <input
                    type="text"
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white"
                    value={profile.desiredSalary}
                    onChange={(e) => setProfile({ ...profile, desiredSalary: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Profile Avatar Image URL</label>
                  <input
                    type="text"
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-muted mb-1">Academic / University Education Background</label>
                  <input
                    type="text"
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white"
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Social & Professional Links (comma-separated)</label>
                  <input
                    type="text"
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white font-mono"
                    placeholder="github.com/username, linkedin.com/in/username"
                    value={profile.socialLinks}
                    onChange={(e) => setProfile({ ...profile, socialLinks: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-muted mb-1">Professional Portfolio Bio Summary</label>
                <textarea
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white h-20"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl text-xs hover:bg-opacity-95"
                >
                  Apply Blueprint Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
