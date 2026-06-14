import React, { useState } from 'react';
import { Briefcase, CheckCircle, Clock, FileText, Sparkles, TrendingUp, Users, Award, Eye, Calendar, User, ArrowRight, X, UserCheck, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import { Job, Candidate, Application } from '../types';
import { sampleCandidates } from '../data';

interface DashboardProps {
  role: 'seeker' | 'employer';
  appliedJobs: Job[];
  applications: Application[];
  invitedCandidates: Candidate[];
  onUpdateAppStatus: (appId: string, nextStatus: Application['status']) => void;
  onPostNewJob: (job: Omit<Job, 'id' | 'postedAt'>) => void;
}

export default function Dashboard({
  role,
  appliedJobs,
  applications,
  invitedCandidates,
  onUpdateAppStatus,
  onPostNewJob
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
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
  });

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
    { key: 'avatarUrl', label: 'Profile Avatar Image', check: (v: any) => !!v && v.trim().length > 0 && v.startsWith('http') }
  ];

  const completedFields = profileFields.filter(field => field.check((profile as any)[field.key]));
  const completionPercentage = Math.round((completedFields.length / profileFields.length) * 100);

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

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. SEEKER REGENCY PORTAL */}
      {role === 'seeker' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main LHS */}
          <div className="lg:col-span-8 space-y-6">
            
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
                                    ? 'bg-brand-primary/20 text-brand-primary border-brand-primary'
                                    : isPastOrCurrent
                                      ? 'bg-brand-success/10 text-brand-success border-brand-success/20'
                                      : 'bg-white/5 text-brand-muted border-white/5'
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

          {/* RHS Panels for seek progress indicators */}
          <div className="lg:col-span-4 space-y-6">
            
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
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * completionPercentage) / 100 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
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
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * completionPercentage) / 100 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
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

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-brand-muted mb-1">Academic / University Education Background</label>
                  <input
                    type="text"
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary text-white"
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
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
