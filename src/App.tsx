import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Bot, Briefcase, FileText, Users, MapPin, Star, Bell, 
  ChevronRight, ArrowRight, ShieldCheck, Check, Info, User, Lock, Mail, 
  X, RefreshCw, LogIn, Plus, LogOut, CheckCircle, Award
} from 'lucide-react';
import { User as UserType, Job, Company, Candidate, Application, Notification, ResumeAnalysisResult } from './types';
import { sampleJobs, sampleCompanies, sampleCandidates } from './data';

// Modular Sub-components
import AIPanel from './components/AIPanel';
import JobSearch from './components/JobSearch';
import Dashboard from './components/Dashboard';
import LegalContact from './components/LegalContact';
import Apply4UAgent from './components/Apply4UAgent';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'analyzer' | 'jobs' | 'dashboard' | 'contact' | 'apply4u'>('home');
  
  // Auth state defaults to Sarah Jenkins (Seeker) for instant high fidelity data
  const [user, setUser] = useState<UserType | null>({
    id: 'user-seeker-1',
    email: 'demo@talentup.com',
    name: 'Sarah Jenkins',
    role: 'seeker',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
  });

  // Global Resume Analysis State
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult | null>({
    overallScore: 92,
    atsScore: 94,
    formattingScore: 90,
    keywordMatchScore: 89,
    readabilityScore: 95,
    professionalImpactScore: 92,
    feedback: "Your resume demonstrates exceptional alignment with senior frontend/AI architectures, displaying crisp phrasing and highly actionable quantitative indicators.",
    missingSkills: ["Docker & Kubernetes", "System Design", "Kubeflow"],
    strengths: [
      "Excellent quantitative achievements and business outcomes cited",
      "Robust core technical credentials matching senior expectations",
      "Perfect ATS format structure and font hierarchies"
    ],
    recommendations: [
      "Integrate missing system design benchmarks to push for a perfect 100",
      "Incorporate precise machine learning serving framework callouts",
      "Structure bio with a highly focused executive profile anchor"
    ]
  });

  // Login Form States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRole, setAuthRole] = useState<'seeker' | 'employer'>('seeker');
  const [authError, setAuthError] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      title: 'New Job Match Found',
      message: 'Aether Corp released a Lead Frontend Engineer position matching 96% of your tech stack.',
      time: '10m ago',
      type: 'match',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Profile Viewed',
      message: 'A recruitment partner from Stripe viewed your verified metrics archive.',
      time: '1h ago',
      type: 'viewer',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Resume Score Approved',
      message: 'ATS compliance checks successfully cleared with optimal rating of 96/100.',
      time: '3h ago',
      type: 'resume',
      read: true,
    }
  ]);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  // Applied Jobs list
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const appliedJobsList = sampleJobs.filter(j => appliedJobIds.includes(j.id));

  // Employer candidates invitation roster
  const [invitedCandidateIds, setInvitedCandidateIds] = useState<string[]>([]);
  const invitedCandidatesList = sampleCandidates.filter(c => invitedCandidateIds.includes(c.id));

  // ATS Applications status store
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'app-mock-1',
      jobId: 'job-1',
      jobTitle: 'Lead AI Research Engineer',
      companyName: 'Aether Corp',
      candidateId: 'cand-1',
      candidateName: 'Sarah Jenkins',
      candidateTitle: 'Lead Frontend Architect',
      status: 'screening',
      appliedDate: 'Yesterday',
      resumeScore: 96
    },
    {
      id: 'app-mock-2',
      jobId: 'job-2',
      jobTitle: 'Senior DevOps Architect',
      companyName: 'Veridian Dynamics',
      candidateId: 'cand-2',
      candidateName: 'Marcus Chen',
      candidateTitle: 'Senior DevOps Engineer',
      status: 'applied',
      appliedDate: '2 Days ago',
      resumeScore: 92
    },
    {
      id: 'app-mock-3',
      jobId: 'job-3',
      jobTitle: 'Bioinformatics Researcher',
      companyName: 'Helix Genomics',
      candidateId: 'cand-3',
      candidateName: 'Dr. Evelyn Martinez',
      candidateTitle: 'Bioinformatics Director',
      status: 'interview',
      appliedDate: '4 Days ago',
      resumeScore: 98
    }
  ]);

  // Load state from local storage on mount
  useEffect(() => {
    const savedJobs = localStorage.getItem('talentup_applied_jobs');
    if (savedJobs) {
      setAppliedJobIds(JSON.parse(savedJobs));
    }
    const savedInvites = localStorage.getItem('talentup_invited_candidates');
    if (savedInvites) {
      setInvitedCandidateIds(JSON.parse(savedInvites));
    }
  }, []);

  // Dispatch Notification trigger
  const handleAddNewNotification = (title: string, message: string, type: 'match' | 'viewer' | 'invite' | 'resume') => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Job apply trigger
  const handleJobApply = (job: Job) => {
    if (appliedJobIds.includes(job.id)) return;
    const nextArr = [...appliedJobIds, job.id];
    setAppliedJobIds(nextArr);
    localStorage.setItem('talentup_applied_jobs', JSON.stringify(nextArr));

    // Also inject into ATS applications system if employer viewed
    const newApp: Application = {
      id: `app-user-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company,
      candidateId: 'cand-user',
      candidateName: user?.name || 'Anonymous Seeker',
      candidateTitle: 'React & Core TS Developer',
      status: 'applied',
      appliedDate: 'Just now',
      resumeScore: 94
    };
    setApplications(prev => [newApp, ...prev]);

    handleAddNewNotification(
      "Application Submitted",
      `Your credentials were sent to the recruitment desk of ${job.company} for "${job.title}".`,
      'match'
    );
  };

  // Re-routes candidate application states inside ATS (Applied -> Screening etc)
  const handleUpdateAppStatus = (appId: string, nextStatus: Application['status']) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        // Notify user about recruiter status change
        handleAddNewNotification(
          "Pipeline Status Alert",
          `Status updated for "${app.jobTitle}" at ${app.companyName}: Moved into "${nextStatus}".`,
          'invite'
        );
        return { ...app, status: nextStatus };
      }
      return app;
    }));
  };

  // Candidate invitation trigger
  const handleInviteCandidate = (cand: Candidate) => {
    if (invitedCandidateIds.includes(cand.id)) return;
    const nextIm = [...invitedCandidateIds, cand.id];
    setInvitedCandidateIds(nextIm);
    localStorage.setItem('talentup_invited_candidates', JSON.stringify(nextIm));

    handleAddNewNotification(
      "Candidate Invited",
      `You issued a mock technology evaluation invite to ${cand.name} for senior roles testing.`,
      'invite'
    );
  };

  // Posting new jobs from corporate account
  const handlePostNewJob = (newJob: Omit<Job, 'id' | 'postedAt'>) => {
    const freshJob: Job = {
      ...newJob,
      id: `job-custom-${Date.now()}`,
      postedAt: 'Today'
    };
    sampleJobs.unshift(freshJob); // Inject directly to the live jobs register
    handleAddNewNotification(
      "Requisition Launched",
      `Enterprise job requisition "${freshJob.title}" has been listed publicly online.`,
      'match'
    );
  };

  // Simulate credentials authentication check
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail === 'demo@talentup.com' && authPassword === 'password123') {
      setUser({
        id: 'user-seeker-1',
        email: 'demo@talentup.com',
        name: authRole === 'seeker' ? 'Sarah Jenkins' : 'Aether Corporate Admin',
        role: authRole,
        companyName: authRole === 'employer' ? 'Aether Corp' : undefined,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
      });
      setShowAuthModal(false);
      setAuthError('');
      setActiveTab('dashboard');
      handleAddNewNotification(
        "Secure Login Authorized",
        `Welcome back, ${authRole === 'seeker' ? 'Sarah' : 'Enterprise Admin'}. Active secure tokens signed.`,
        'resume'
      );
    } else {
      setAuthError("Invalid credentials. Please use 'demo@talentup.com' and 'password123' to test.");
    }
  };

  // Quick logout
  const handleLogOut = () => {
    setUser(null);
    setActiveTab('home');
    setAppliedJobIds([]);
    setInvitedCandidateIds([]);
    localStorage.removeItem('talentup_applied_jobs');
    localStorage.removeItem('talentup_invited_candidates');
  };

  // Switch role helper for swift evaluation in UI
  const toggleUserRole = () => {
    if (!user) return;
    const nextRole = user.role === 'seeker' ? 'employer' : 'seeker';
    setUser({
      ...user,
      role: nextRole,
      name: nextRole === 'seeker' ? 'Sarah Jenkins' : 'Aether Corporate Admin'
    });
    handleAddNewNotification(
      "Context Profile Toggled",
      `Evaluation scope switched to dashboard: ${nextRole === 'seeker' ? 'Seeker POV' : 'Recruiter POV'}.`,
      'resume'
    );
  };

  // Testimonial States
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      quote: "TalentUp bypassed our manual vetting bottlenecks. The integrated Gemini analyzer evaluated 1,200 applications overnight with surgical precision, accelerating our technical screening phase.",
      author: "Hana Vancore",
      title: "VP of People, Linear",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
      quote: "The strategic career coach is mind-blowing. The Gemini high thinking level insights gave me precise structural guidance and scripts that unlocked a $180K base offer from Veridian Dynamics.",
      author: "Marcus Chen",
      title: "Lead Cloud Architect (Ex-Amazon)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
      quote: "Recruitment CRM of the future. The visual drag columns sync beautifully, while candidates arrive with pre-computed ATS formatting analysis already attached to their record.",
      author: "Edward Vance",
      title: "Talent Partner, Remote.com",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100&h=100"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-white font-sans flex flex-col justify-between selection:bg-brand-primary selection:text-white relative">
      
      {/* BACKGROUND DECORATIVE GLOW SPHERES (LIQUID PHYSICS ENGINE) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Shifting fluid liquid elements */}
        <div className="absolute top-[-25%] left-[-15%] w-[75%] h-[60%] bg-gradient-to-br from-brand-primary/15 to-brand-secondary/5 rounded-full blur-[110px] animate-liquid-wobble"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[85%] h-[65%] bg-gradient-to-tl from-brand-secondary/15 to-brand-primary/5 rounded-full blur-[130px] animate-liquid-wobble-delayed"></div>
        <div className="absolute top-[35%] left-[5%] w-[45%] h-[40%] bg-indigo-500/8 rounded-full blur-[100px] animate-liquid-wobble"></div>
        <div className="absolute top-[60%] right-[10%] w-[40%] h-[40%] bg-emerald-500/8 rounded-full blur-[120px] animate-liquid-wobble-delayed"></div>
        
        {/* Tiny twinkling ambient stars/dust */}
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-white/25 blur-[0.5px] animate-pulse"></div>
        <div className="absolute top-2/3 left-2/4 w-2 h-2 rounded-full bg-purple-400/30 blur-[1px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-3/4 w-1 h-1 rounded-full bg-blue-300/40 blur-[0.5px] animate-pulse" style={{ animationDelay: '4.5s' }}></div>
      </div>

      {/* HEADER NAVIGATION */}
      <nav className="relative z-30 sticky top-4 mx-6 my-4 backdrop-blur-xl bg-[#030409]/60 border border-white/10 px-6 py-3.5 flex items-center justify-between rounded-2xl shadow-xl shadow-black/30">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          {/* Logo merged letter T and upward white arrow */}
          <div className="w-9 h-9 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/25">
            <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 4v16m0 0l-4-4m4 4l4-4M4 8h16" />
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tighter font-display uppercase">
            TALENT<span className="text-brand-primary">UP</span>
          </span>
        </div>

        {/* Tab Links */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'home' ? 'liquid-nav-btn-active' : 'liquid-nav-btn text-brand-muted hover:text-white'
            }`}
          >
            Ecosystem
          </button>
          <button 
            onClick={() => setActiveTab('jobs')} 
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'jobs' ? 'liquid-nav-btn-active' : 'liquid-nav-btn text-brand-muted hover:text-white'
            }`}
          >
            Marketplace
          </button>
          <button 
            onClick={() => setActiveTab('analyzer')} 
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'analyzer' ? 'liquid-nav-btn-active' : 'liquid-nav-btn text-brand-muted hover:text-white'
            }`}
          >
            AI Consulting
          </button>
          <button 
            onClick={() => setActiveTab('apply4u')} 
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'apply4u' ? 'liquid-nav-btn-active font-extrabold' : 'liquid-nav-btn text-brand-muted hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            Smart Apply
          </button>
          {user && (
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'dashboard' ? 'liquid-nav-btn-active' : 'liquid-nav-btn text-brand-muted hover:text-white'
              }`}
            >
              Dashboard
            </button>
          )}
          <button 
            onClick={() => setActiveTab('contact')} 
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'contact' ? 'liquid-nav-btn-active' : 'liquid-nav-btn text-brand-muted hover:text-white'
            }`}
          >
            Contact
          </button>
        </div>

        {/* Credentials / Notifications Triggers */}
        <div className="flex items-center gap-4">
          
          {/* Notification Button */}
          <button 
            onClick={() => setShowNotifDrawer(prev => !prev)} 
            className="p-2 bg-white/5 border border-white/10 hover:border-brand-primary/40 rounded-xl relative transition-all"
          >
            <Bell className="w-4 h-4 text-brand-muted hover:text-white" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-success rounded-full border-2 border-brand-bg animate-pulse"></span>
            )}
          </button>

          {/* User Signin toggle */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <span className="text-xs font-bold text-white block leading-none">{user.name}</span>
                <span className="text-[9px] text-brand-primary uppercase font-mono mt-1 block">
                  {user.role === 'seeker' ? 'Candidate POV' : 'Corporate POV'}
                </span>
              </div>
              
              <button
                onClick={toggleUserRole}
                className="text-[9px] uppercase font-bold px-2 py-1 bg-white/5 border border-white/10 hover:border-brand-primary/40 rounded-lg text-brand-muted hover:text-white transition-all"
                title="Swift Swap Views between Candidate and Enterprise Recruiter dashboards to evaluate easily."
              >
                Swap View
              </button>

              <button
                onClick={handleLogOut}
                className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/25 rounded-xl transition-all"
                title="Wipe state & exit simulation"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-5 py-2.5 bg-brand-primary hover:opacity-90 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
          )}

        </div>
      </nav>

      {/* CORE WEBSITE ENGINE ROUTER */}
      <main className="flex-1 relative z-10 px-6 py-8 max-w-7xl mx-auto w-full">

        {/* NOTIFICATION DRAWER CONTAINER */}
        {showNotifDrawer && (
          <div className="absolute top-0 right-6 w-80 bg-[#0B1220]/95 border border-white/10 rounded-2xl p-4 shadow-2xl z-40 backdrop-blur-xl animate-scaleIn">
            <div className="flex justify-between items-center border-b border-white/15 pb-2 mb-3">
              <span className="text-xs font-bold text-white">Simulation Alert Dispatcher</span>
              <button onClick={() => setShowNotifDrawer(false)} className="text-[10px] text-brand-muted hover:text-white">Close [X]</button>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-2.5 rounded-lg text-xs leading-relaxed border transition-all ${
                    n.read ? 'bg-brand-bg/40 border-white/5' : 'bg-brand-primary/10 border-brand-primary/20 bg-opacity-40'
                  }`}
                  onClick={() => {
                    setNotifications(prev => prev.map(cur => cur.id === n.id ? { ...cur, read: true } : cur));
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white block text-[11px]">{n.title}</span>
                    <span className="text-[8px] text-brand-muted font-mono">{n.time}</span>
                  </div>
                  <span className="text-[10px] text-brand-muted mt-0.5 block">{n.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1. HOME SCREEN / DISCOVERY */}
        {activeTab === 'home' && (
          <div className="space-y-20">
            {/* HERO HEROICS */}
            <section className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-between gap-12 py-12">
              <div className="space-y-6 max-w-2xl text-left">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-brand-primary">
                  <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse"></span>
                  AURORA FUTURE SERIES V2.4 RUNNING
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight font-display leading-[1.05]">
                  The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Talent Growth</span> Starts Here.
                </h1>

                <p className="text-lg text-[#A5B4C7] max-w-lg leading-relaxed font-sans">
                  AI-powered career advancement and executive hiring solutions for world-class professionals and forward-thinking organizations.
                </p>

                {/* Counter statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5 mt-4">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">50,000+</span>
                    <span className="text-[10px] text-brand-muted uppercase tracking-widest block mt-0.5">Career Profiles</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">10,000+</span>
                    <span className="text-[10px] text-brand-muted uppercase tracking-widest block mt-0.5">Employers</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">500,000+</span>
                    <span className="text-[10px] text-brand-muted uppercase tracking-widest block mt-0.5">App Audits</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">95%</span>
                    <span className="text-[10px] text-brand-muted uppercase tracking-widest block mt-0.5">User Satisfaction</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-6">
                  <button 
                    onClick={() => setActiveTab('jobs')}
                    className="px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-95 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-primary/10 group flex items-center gap-2"
                  >
                    Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('analyzer')}
                    className="px-8 py-4 bg-brand-elevated border border-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all hover:bg-brand-card flex items-center gap-2"
                  >
                    Try AI Resume Analyzer <Sparkles className="w-4 h-4 text-brand-secondary" />
                  </button>
                </div>
              </div>

              {/* Mock premium UI visual card widget */}
              <div className="w-full max-w-md bg-brand-card border border-white/10 rounded-3xl shadow-2xl p-6 relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl"></div>
                
                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-primary" />
                    AI Talent Pipeline Demo
                  </h3>
                  <span className="text-[10px] bg-brand-success/15 text-brand-success font-semibold px-2 py-0.5 rounded font-mono">Live Sync</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-[#A5B4C7] uppercase font-mono tracking-wider block">Average Match Rating</span>
                      <span className="text-3xl font-extrabold text-white font-mono">94.2<span className="text-sm font-normal text-brand-muted">/100</span></span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-brand-primary flex items-center justify-center font-bold text-brand-primary text-xs">
                      A+
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-brand-muted">ATS Compliance</span>
                        <span className="text-brand-success font-semibold font-mono">98%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary w-[98%]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-brand-muted">Leadership Vector</span>
                        <span className="text-brand-success font-semibold font-mono">87%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-secondary w-[87%]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-brand-muted">Technical Velocity</span>
                        <span className="text-brand-success font-semibold font-mono">92%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-success w-[92%]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-[8px] uppercase tracking-widest text-[#A5B4C7] font-bold block mb-1">Synthesizer Insight</span>
                    <p className="text-xs text-brand-muted leading-normal italic font-sans">
                      "Candidate shows exceptional growth in distributed React systems with high potential for Technical Architect roles."
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SERVICES MATRIX GRIDS */}
            <section className="space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="text-xs text-brand-primary uppercase font-mono tracking-widest font-bold">Comprehensive Capabilities Spectrum</span>
                <h2 className="text-4xl font-bold select-none tracking-tight font-display">Crafted Services For High Growth</h2>
                <p className="text-xs text-brand-muted">Discover specifically categorized frameworks engineered to accelerate placement metrics on both sides. </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Seekers */}
                <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-full blur-3xl"></div>
                  <h3 className="font-bold text-white text-md flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-primary" /> For Candidates Seeking Growth
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-brand-bg/50 p-3 rounded-xl border border-white/5">
                      <span className="font-bold text-white block">ATS Optimization drafts</span>
                      <span className="text-[10px] text-brand-muted block mt-0.5">Direct parsing feedback clears hiring blockers.</span>
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-xl border border-white/5">
                      <span className="font-bold text-white block">LinkedIn Branding</span>
                      <span className="text-[10px] text-brand-muted block mt-0.5">Restructure profile cards based on recruiter metrics.</span>
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-xl border border-white/5">
                      <span className="font-bold text-white block">Elite Career Coach chat</span>
                      <span className="text-[10px] text-brand-muted block mt-0.5">Consultations powered by Gemini-3.1-pro algorithms.</span>
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-xl border border-white/5">
                      <span className="font-bold text-white block">Mock Interview drills</span>
                      <span className="text-[10px] text-brand-muted block mt-0.5">Prepare exact phrasing targets dynamically.</span>
                    </div>
                  </div>
                </div>

                {/* Employers */}
                <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/15 rounded-full blur-3xl"></div>
                  <h3 className="font-bold text-white text-md flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-brand-secondary" /> For Enterprise Talent Partners
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-brand-bg/50 p-3 rounded-xl border border-white/5">
                      <span className="font-bold text-white block">Candidate Match Scorecard</span>
                      <span className="text-[10px] text-brand-muted block mt-0.5">Pre-computed structural scores save hours.</span>
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-xl border border-white/5">
                      <span className="font-bold text-white block">Active Recruitment CRM</span>
                      <span className="text-[10px] text-brand-muted block mt-0.5">Visual application pipelines keep queues structured.</span>
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-xl border border-white/5">
                      <span className="font-bold text-white block">Talent Search engine</span>
                      <span className="text-[10px] text-brand-muted block mt-0.5">Filter by notice terms, salary specs, or exact skills.</span>
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-xl border border-white/5">
                      <span className="font-bold text-white block">Instant SLA Postings</span>
                      <span className="text-[10px] text-brand-muted block mt-0.5">Launch public listings with real-time response counters.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* APPLY4U AUTOMATION INTEGRATED SPOTLIGHT CARD */}
              <div className="bg-gradient-to-r from-[#170F2C]/70 via-[#0C1221]/80 to-[#101F2F]/70 border border-brand-primary/20 p-8 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-44 h-44 bg-brand-primary/15 rounded-full blur-3xl"></div>
                
                <div className="space-y-4 max-w-xl text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 rounded-full text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                    APPLY4U INTEGRATED ENGINE
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                    Don’t Search For Jobs. <br/>Let Us Apply <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#10B981]">On Your Behalf</span>.
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Tired of repetitive resumes uploads and 50-step question sets? Meet our deep-seated automation assistant. We analyze, optimize your structure, and submit directly to our partner network automatically.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] font-medium text-brand-muted font-sans">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Restructures CV Into Vetted Formats
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Automatically Target Title & Location
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" /> 24/7 Background Submission Sprints
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Real-time Tracking & Interview Alerting
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-3 bg-[#050816]/50 border border-white/5 p-6 rounded-2xl min-w-[260px]">
                  <div className="text-center">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-brand-muted font-bold block">Estimated SLA Match Lift</span>
                    <span className="text-4xl font-extrabold text-emerald-400 font-mono tracking-tight block mt-0.5">3.4x</span>
                    <span className="text-[10px] text-brand-muted mt-1 block">Accelerated application cycle</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('apply4u')}
                    className="w-full mt-2 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:opacity-95 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-brand-primary/15 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    Activate Smart Apply Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* TESTIMONIALS CAROUSEL */}
            <section className="bg-brand-card/30 border border-white/10 p-8 rounded-3xl relative overflow-hidden space-y-6">
              <span className="text-xs text-brand-primary uppercase font-mono font-bold tracking-widest text-center block">Ecosystem Reviews</span>
              
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <p className="text-base sm:text-lg text-white font-serif leading-relaxed italic">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                
                <div className="flex items-center justify-center gap-3 pt-4">
                  <img src={testimonials[activeTestimonial].avatar} className="w-10 h-10 rounded-full object-cover" />
                  <div className="text-left text-xs">
                    <span className="font-bold text-white block">{testimonials[activeTestimonial].author}</span>
                    <span className="text-brand-muted block">{testimonials[activeTestimonial].title}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2 pt-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeTestimonial === index ? 'bg-brand-primary w-4' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. AI MOLECULAR ANALYZER */}
        {activeTab === 'analyzer' && (
          <AIPanel 
            onNotify={handleAddNewNotification} 
            resumeAnalysis={resumeAnalysis}
            onUpdateResumeAnalysis={setResumeAnalysis}
          />
        )}

        {/* 3. SEARCH DIRECTORY & CONTRACT SERVICES */}
        {activeTab === 'jobs' && (
          <JobSearch 
            onApply={handleJobApply} 
            appliedJobIds={appliedJobIds} 
            role={user?.role || 'seeker'}
            onInviteCandidate={handleInviteCandidate}
            invitedCandidateIds={invitedCandidateIds}
          />
        )}

        {/* 4. USER CONTEXT DASHBOARD MODULE */}
        {activeTab === 'dashboard' && user && (
          <Dashboard 
            role={user.role} 
            appliedJobs={appliedJobsList}
            applications={applications}
            invitedCandidates={invitedCandidatesList}
            onUpdateAppStatus={handleUpdateAppStatus}
            onPostNewJob={handlePostNewJob}
            resumeAnalysis={resumeAnalysis}
            onNavigateToTab={setActiveTab}
          />
        )}

        {/* SMART APPLY4U AUTO-AGENT SERVICE */}
        {activeTab === 'apply4u' && (
          <Apply4UAgent 
            resumeAnalysis={resumeAnalysis}
            onNotify={handleAddNewNotification}
            onApplyToJob={handleJobApply}
            onNavigateToTab={setActiveTab}
          />
        )}

        {/* 5. CONTACT & DETAILED FAQS SHEET */}
        {activeTab === 'contact' && (
          <LegalContact />
        )}

      </main>

      {/* FOOTER MATRICES */}
      <footer className="bg-black/40 border-t border-white/10 px-8 py-8 mt-12 text-xs text-[#A5B4C7] font-medium z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 pb-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-8 h-8 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M12 4v16m0 0l-4-4m4 4l4-4M4 8h16" />
                </svg>
              </div>
              <span className="text-md font-bold text-white tracking-widest font-display">TALENTUP</span>
            </div>
            <p className="text-xs text-brand-muted max-w-sm leading-relaxed">
              Elevate Talent. Accelerate Success. Discover verified global executive roles, optimized portfolios, and premium recruitment CRM setups seamlessly.
            </p>
          </div>

          <div>
            <span className="block text-white font-mono uppercase text-[9px] tracking-wider mb-3">Enterprise Seeker</span>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => { setActiveTab('jobs'); }} className="hover:text-white">Active Contracts Catalog</button></li>
              <li><button onClick={() => { setActiveTab('analyzer'); }} className="hover:text-white">Gemini Resume Analysis</button></li>
              <li><button onClick={() => { setActiveTab('analyzer'); }} className="hover:text-white">Strategic Coach Chat</button></li>
              <li><button onClick={() => { setActiveTab('home'); }} className="hover:text-white">Talent Success Timelines</button></li>
            </ul>
          </div>

          <div>
            <span className="block text-white font-mono uppercase text-[9px] tracking-wider mb-3">For Corporate Sponsors</span>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => { setActiveTab('jobs'); }} className="hover:text-white">Registered Candidate Profiles</button></li>
              <li><button onClick={() => { setActiveTab('jobs'); }} className="hover:text-white">Enter Technical Directory</button></li>
              <li><button onClick={() => { if (user) { setActiveTab('dashboard'); } else { setShowAuthModal(true); } }} className="hover:text-white">Applicant Tracking System</button></li>
              <li><button onClick={() => { if (user) { setActiveTab('dashboard'); } else { setShowAuthModal(true); } }} className="hover:text-white">Hiring SLAs CRM</button></li>
            </ul>
          </div>

          <div>
            <span className="block text-white font-mono uppercase text-[9px] tracking-wider mb-3">Support Protocols</span>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => setActiveTab('contact')} className="hover:text-white">Help & Frequently Audited Questions</button></li>
              <li><button onClick={() => setActiveTab('contact')} className="hover:text-white">Submit Slag Inquiries</button></li>
              <li><button className="hover:text-white cursor-default">Status: Online Node Operational</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-brand-muted">
          <div>
            <span>&copy; {new Date().getFullYear()} TALENTUP SYSTEM ECOSYSTEM. INC. ALL SIMULATIONS RESERVED.</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('contact')} className="hover:underline hover:text-white">Global Privacy Guidelines</button>
            <span>•</span>
            <button onClick={() => setActiveTab('contact')} className="hover:underline hover:text-white">Corporate Terms Of Service</button>
          </div>
          <div className="text-white flex items-center gap-1">
            <span className="opacity-50">Powered by</span>
            <span className="font-bold">Aurora Engine</span>
          </div>
        </div>
      </footer>

      {/* 6. AUTHENTICATION POPUP DIALOG */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-[#050816]/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 max-w-sm w-full scale-100 transition-all text-white space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-primary">
                Secure Authentication Node
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="p-1 hover:bg-white/5 rounded">
                <X className="w-5 h-5 text-brand-muted" />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs font-sans">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-brand-warning block uppercase">Simulation Passwords</span>
                <p className="text-[10px] text-brand-muted leading-tight">
                  Email: <span className="text-white font-mono font-bold select-all">demo@talentup.com</span><br/>
                  Password: <span className="text-white font-mono font-bold select-all">password123</span>
                </p>
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-mono text-[10px]">Context Evaluation Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setAuthRole('seeker')}
                    className={`p-2 rounded-lg font-bold border transition-all ${
                      authRole === 'seeker' 
                        ? 'bg-brand-primary text-white border-brand-primary' 
                        : 'bg-white/5 text-brand-muted border-white/10'
                    }`}
                  >
                    Job Seeker
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAuthRole('employer')}
                    className={`p-2 rounded-lg font-bold border transition-all ${
                      authRole === 'employer' 
                        ? 'bg-brand-primary text-white border-brand-primary' 
                        : 'bg-white/5 text-brand-muted border-white/10'
                    }`}
                  >
                    Employer CRM
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-brand-muted mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="demo@talentup.com"
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1">Access Token Password</label>
                <input
                  type="password"
                  required
                  placeholder="password123"
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>

              {authError && (
                <p className="text-[10px] text-brand-warning font-mono bg-brand-warning/10 p-2 rounded border border-brand-warning/20">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-primary hover:opacity-95 text-white font-extrabold rounded-xl transition-all uppercase tracking-wider mt-4"
              >
                Sign In & Synthesize Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
