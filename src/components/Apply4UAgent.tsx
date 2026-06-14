import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle, Clock, FileText, Send, Play, Pause, RefreshCw, 
  Settings, Sliders, DollarSign, MapPin, ArrowRight, ShieldCheck, Check, 
  AlertCircle, HelpCircle, FileCheck, Layers, Bot, Radio, Zap, ExternalLink, HelpCircle as HelpIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Job, ResumeAnalysisResult, Application } from '../types';
import { sampleJobs } from '../data';

interface Apply4UAgentProps {
  resumeAnalysis: ResumeAnalysisResult | null;
  onNotify: (title: string, msg: string, type: 'match' | 'viewer' | 'invite' | 'resume') => void;
  onApplyToJob: (job: Job) => void;
  onNavigateToTab?: (tab: 'home' | 'analyzer' | 'jobs' | 'dashboard' | 'contact') => void;
}

interface AutoJobApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  salary: string;
  matchScore: number;
  status: 'scanning' | 'crafting_cover' | 'submitting' | 'dispatched' | 'hold';
  timestamp: string;
  trackingLink?: string;
  log: string[];
}

export default function Apply4UAgent({ resumeAnalysis, onNotify, onApplyToJob, onNavigateToTab }: Apply4UAgentProps) {
  // Config States
  const [targetTitle, setTargetTitle] = useState('Senior React Architect');
  const [targetLocation, setTargetLocation] = useState('Remote (US/Europe/UK)');
  const [desiredSalary, setDesiredSalary] = useState([120000, 180000]);
  const [workType, setWorkType] = useState<'Full-time' | 'Contract' | 'Part-time'>('Full-time');
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentStatusSummary, setAgentStatusSummary] = useState('Agent is standby. Configure target preferences & press Play to start automated submissions.');
  
  // CV Rewrite States
  const [cvStyle, setCvStyle] = useState<'Minimalist ATS' | 'Executive Lead' | 'Technical Functional'>('Minimalist ATS');
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenResume, setRewrittenResume] = useState<string | null>(null);

  // Auto Applications Register
  const [autoApplications, setAutoApplications] = useState<AutoJobApplication[]>([
    {
      id: 'auto-1',
      jobTitle: 'Lead UI System Architect',
      companyName: 'Aether Corp',
      location: 'Remote',
      salary: '$140k - $160k',
      matchScore: 96,
      status: 'dispatched',
      timestamp: '15m ago',
      log: [
        'Initialized neural stack matching scan.',
        'Matched 96% technical overlaps (React v19, TypeScript runtime compiled).',
        'Auto-crafted structural cover letter focused on liquid glass UI optimizations.',
        'Dispatched application block directly to internal hiring inbox of Aether Corp.'
      ]
    },
    {
      id: 'auto-2',
      jobTitle: 'Senior Frontend Engineer (AI Platforms)',
      companyName: 'Stripe Corporate',
      location: 'Hybrid (San Francisco)',
      salary: '$150k - $190k',
      matchScore: 92,
      status: 'dispatched',
      timestamp: '2h ago',
      log: [
        'Target discovered via live sitemap scraping.',
        'Analyzed CV: High alignment on Stripe Core API mechanics.',
        'Generated personalized motivation report.',
        'Successfully bypass submitted through employer partner portal.'
      ]
    }
  ]);

  // Simulation loop for are automated agent running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAgentRunning) {
      setAgentStatusSummary('ACTIVE BROADCASTING Loop: Harvesting live tech rosters, compiling documents, and submitting portfolios on your behalf...');
      
      interval = setInterval(() => {
        // Trigger a simulated application setup
        const candidates = [
          { title: 'Senior UX Lead (GenAI Core)', company: 'Helix Genomics', sal: '$130k - $165k', loc: 'Remote', score: 91 },
          { title: 'Frontend Team Lead', company: 'Veridian Dynamics', sal: '$140k - $180k', loc: 'Hybrid (Boston)', score: 94 },
          { title: 'Lead Interface Developer', company: 'Linear Systems', sal: '$150k - $175k', loc: 'Remote', score: 95 },
          { title: 'Staff Frontend Architect', company: 'Apex Systems', sal: '$160k - $210k', loc: 'Remote', score: 97 }
        ];

        // Choose one that is not already in list
        const untargeted = candidates.filter(
          c => !autoApplications.some(existing => existing.companyName === c.company)
        );

        if (untargeted.length > 0) {
          const target = untargeted[Math.floor(Math.random() * untargeted.length)];
          const newAppId = `auto-new-${Date.now()}`;
          
          // Phase 1: Scanning
          const newAppItem: AutoJobApplication = {
            id: newAppId,
            jobTitle: target.title,
            companyName: target.company,
            location: target.loc,
            salary: target.sal,
            matchScore: target.score,
            status: 'scanning',
            timestamp: 'Just now',
            log: ['Discovered target matching keywords.', 'Scanning compliance...']
          };

          setAutoApplications(prev => [newAppItem, ...prev]);

          // Transition phase: Scanning -> Crafting Cover -> Submitting -> Dispatched
          setTimeout(() => {
            updateAppStatus(newAppId, 'crafting_cover', [
              'Target matched successfully.',
              'Scanning compatibility: Verified 94% coverage.',
              'Crafting cover credentials highlighting candidate performance history...'
            ]);
          }, 2500);

          setTimeout(() => {
            updateAppStatus(newAppId, 'submitting', [
              'Personalized cover letter fully structural.',
              'Formulating secure API handshakes with recruiter backend logs.',
              'Transmitting formatted resume packages...'
            ]);
          }, 5000);

          setTimeout(() => {
            updateAppStatus(newAppId, 'dispatched', [
              'Formulating secure API handshakes with recruiter backend logs.',
              'Transmitting formatted resume packages...',
              'SUCCESS! Application Dispatched: Checked and entered into candidate tracking CRM.'
            ]);
            onNotify(
              "Apply4U Agent Dispatched",
              `Formally applied to "${target.title}" at ${target.company} on your behalf!`,
              "match"
            );
          }, 8000);

        } else {
          // Restart with some recycled targets
          setIsAgentRunning(false);
          setAgentStatusSummary('Agent loop complete! All potential high-match requisitions evaluated.');
          onNotify(
            "Auto Loop Complete",
            "The Apply4U Agent completed its sweep across all accessible enterprise channels.",
            "match"
          );
        }
      }, 11000);
    } else {
      setAgentStatusSummary('Agent standby. Ready to sweep, format, and apply to jobs matching your criteria.');
    }

    return () => clearInterval(interval);
  }, [isAgentRunning, autoApplications]);

  const updateAppStatus = (id: string, status: AutoJobApplication['status'], extraLogs: string[]) => {
    setAutoApplications(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status,
          log: [...a.log, ...extraLogs]
        };
      }
      return a;
    }));
  };

  const handleToggleAgent = () => {
    setIsAgentRunning(!isAgentRunning);
    onNotify(
      isAgentRunning ? "Auto-Apply Agent Paused" : "Auto-Apply Agent Activated",
      isAgentRunning 
        ? "The background job application search loop has been placed on hold."
        : "Apply4U loop started. We are now scanning and applying on your behalf in real time!",
      "resume"
    );
  };

  const handleTriggerCVRewrite = async () => {
    setIsRewriting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const formattedDate = new Date().toLocaleDateString();
    const candidateName = "Sarah Jenkins";
    const currentScore = resumeAnalysis ? resumeAnalysis.overallScore : 92;

    const template = `==========================================================
APPLY4U.IO PREMIUM CV OPTIMIZATION ENGINE v3.4 [SUCCESS]
FORMAT PROTOCOL: ${cvStyle.toUpperCase()}
COMPILED ON: ${formattedDate}
ATS SCAN COMPATIBILITY PRE-RATING: 98/100
==========================================================

CONTACT DETAILS:
NAME: ${candidateName}
ROLE DESIGNATION: ${targetTitle}
TARGET COMPASS: ${targetLocation}
EMAIL: sarah.jenkins@talentup-ats.io

----------------------------------------------------------
1. PROFESSIONAL PROFILE SUMMARY (RE-STRUCTURED)
----------------------------------------------------------
A highly accomplished, metrics-driven Frontend Solutions Architect with over 6 years of expertise leading interactive workspace builds. Proven record of migrating slow codebase layers to premium liquid glass Tailwind structures, driving core conversion indicators by 14%. Recognized for establishing pristine, keyboard-accessible component standards compliance (WCAG 2.1) and maximizing system-level compile performance.

----------------------------------------------------------
2. HARD SHIELD STACK CORE
----------------------------------------------------------
* Frameworks: React 18/19, Next.js Corporate, Solid.js, Vite
* Languages: TypeScript Core (OOP/Functional), ES14, Node.js
* Stylescaping: Tailwind CSS Unified utility layers, Framer Motion
* System Architecture: Micro-Frontends, Monorepos, D3 Data Visualizers
* Automation suite: Jest, Cypress, GitHub Actions, Docker Bundling

----------------------------------------------------------
3. PROFESSIONAL TRAJECTORY HIGHLIGHTS
----------------------------------------------------------
LEAD FRONTEND ARCHITECT | Next-Gen Solutions (2022 - present)
* Spearheaded total architectural restructure of flagship telemetry dashboard using unified Tailwind/Vite, cutting component latency by 48%.
* Led coordinate engineering across 12 distributed staff designers, establishing robust atomic UI principles.
* Developed custom internal caching modules in TypeScript, decreasing overall API overhead by 34%.

SENIOR UI ENGINEER | Apex Systems Corp (2018 - 2022)
* Architected standard customer acquisition pipeline workflows, enhancing successful matching by 14%.
* Crafted 100% compliant fully accessible forms (WCAG) across multi-million user fintech portals.

----------------------------------------------------------
4. ACADEMICS & RECOGNITIONS
----------------------------------------------------------
* B.S. in Computer Science (Major honors standard) — Stanford University
* Certified Senior UI System Architect — Global Technology Alliance
`;

    setRewrittenResume(template);
    setIsRewriting(false);
    onNotify(
      "CV Refined & Rewritten",
      `Optimization completed successfully using ${cvStyle} style protocol. Download or copy text inside!`,
      "resume"
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[10px] font-mono font-bold text-brand-primary">
            <Bot className="w-3 h-3 text-cyan-400" />
            POWERED BY APPLY4U TECHNOLOGY
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">
            Smart Apply4U Agent™
          </h1>
          <p className="text-xs text-brand-muted max-w-xl leading-relaxed">
            Eliminate hours of scanning and manual form filling. Our Smart Agent optimize your CV structural layout and applies to targeted, vetted positions directly to our enterprise recruitment database on your behalf.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleAgent}
            className={`px-5 py-3 rounded-xl text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
              isAgentRunning 
                ? 'bg-red-500/25 hover:bg-red-500/35 border border-red-500/30 text-white shadow-red-500/5' 
                : 'bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-500/30 text-emerald-300 shadow-emerald-500/5'
            }`}
          >
            {isAgentRunning ? (
              <>
                <Pause className="w-4 h-4 text-rose-400" />
                Pause Automation
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-emerald-400 shrink-0" />
                Run Smart Apply Agent
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE MONITOR & PREFERENCES */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* CRITERIA CARD */}
          <div className="bg-[#0b1220]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl"></div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-primary" /> Target Job Matching Preferences
              </h3>
              <span className="text-[10px] text-brand-muted font-mono uppercase">Vetted Channels Ready</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-brand-muted">Target Job Title</label>
                <input
                  type="text"
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  className="w-full bg-[#050816]/70 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary font-sans"
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-brand-muted">Preferred Location</label>
                <input
                  type="text"
                  value={targetLocation}
                  onChange={(e) => setTargetLocation(e.target.value)}
                  className="w-full bg-[#050816]/70 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary font-sans"
                  placeholder="e.g. Remote, Hybrid (London)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-brand-muted">Work Setup Type</label>
                <div className="flex gap-2">
                  {['Full-time', 'Contract', 'Part-time'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWorkType(type as any)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        workType === type
                          ? 'bg-brand-primary/20 border-brand-primary text-white'
                          : 'bg-white/[0.01] border-white/5 text-brand-muted hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-[#A5B4C7]">Ideal Salary Base Floor</label>
                <div className="flex items-center gap-2 bg-[#050816]/70 border border-white/10 rounded-xl px-3 py-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-white leading-normal">
                    $120,000 - $180,000 / Year
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Live Agent Status */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex gap-2.5 items-start">
              <div className="relative mt-1 shrink-0">
                <span className={`flex h-2.5 w-2.5 rounded-full ${isAgentRunning ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {isAgentRunning && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 top-0 left-0" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-brand-muted font-bold block">
                  Agent Loop Telemetry
                </span>
                <p className="text-[10px] text-[#A5B4C7] leading-relaxed">
                  {agentStatusSummary}
                </p>
              </div>
            </div>
          </div>

          {/* ACTIVE DISPATCHED LOGS */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Radio className={`w-4 h-4 ${isAgentRunning ? 'text-emerald-400 animate-pulse' : 'text-brand-muted'}`} />
              Real-time Apply4U Submission Tracker ({autoApplications.length})
            </h3>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {autoApplications.map((app) => (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#0b1220]/60 border border-white/10 rounded-2xl p-5 space-y-3.5 relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                      <div className="text-left space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-extrabold text-white font-sans">{app.jobTitle}</h4>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/25">
                            {app.companyName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-brand-muted font-mono">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {app.location}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">{app.salary}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-[9px] text-brand-muted font-mono block">Match Alignment</span>
                          <span className="text-xs font-bold text-white font-mono block">{app.matchScore}% Score</span>
                        </div>
                        
                        <div className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold border ${
                          app.status === 'dispatched'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : app.status === 'hold'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 animate-pulse'
                        }`}>
                          {app.status === 'scanning' && '🔍 Scanning Code...'}
                          {app.status === 'crafting_cover' && '✍️ Writing Bio...'}
                          {app.status === 'submitting' && '📤 Dispatching Portals...'}
                          {app.status === 'dispatched' && '✔️ Dispatched'}
                          {app.status === 'hold' && '⛔ Hold'}
                        </div>
                      </div>
                    </div>

                    {/* Step telemetry entries */}
                    <div className="bg-[#050816]/50 p-3 rounded-xl border border-white/5 space-y-1.5">
                      <div className="text-[8px] uppercase tracking-wider font-mono font-bold text-brand-muted">Automated Log Entries</div>
                      <div className="space-y-1">
                        {app.log.map((step, idx) => (
                          <div key={idx} className="flex gap-2 text-[10px] font-mono text-brand-muted leading-relaxed">
                            <span className="text-brand-secondary shrink-0">&gt;</span>
                            <span className={idx === app.log.length - 1 ? "text-[#D1D5DB]" : ""}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: REWRITE WORKSPACE & VALUE CARD */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* VALUE CARD */}
          <div className="bg-gradient-to-br from-brand-primary/10 via-[#0B1220]/60 to-[#0c1322]/90 border border-brand-primary/20 rounded-2xl p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h4 className="text-xs font-bold tracking-wider text-white uppercase">How Apply4U Works</h4>
            </div>
            
            <div className="space-y-3.5 text-xs text-brand-muted font-sans">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary font-mono text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <span className="font-bold text-white block">Optimize Resume Core</span>
                  <p className="text-[10px] mt-0.5 text-brand-muted leading-relaxed">
                    Our AI parses and structures your CV text file into highly compatible formats.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary font-mono text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <span className="font-bold text-white block">Set Submission Target</span>
                  <p className="text-[10px] mt-0.5 text-brand-muted leading-relaxed">
                    Set specific location scopes and ideal floor targets to bypass inappropriate job alerts.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary font-mono text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">3</div>
                <div>
                  <span className="font-bold text-white block">Automated Dispatch</span>
                  <p className="text-[10px] mt-0.5 text-brand-muted leading-relaxed">
                    We actively match, fill out recruiter submission forms, and apply fully on your behalf.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CV CLINIC CARD */}
          <div className="bg-[#0b1220]/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-secondary" /> Apply4U CV Transformation Clinic
              </h4>
            </div>

            <p className="text-[11px] text-brand-muted leading-relaxed">
              Standard resumes often trigger filters. Format your details into a targeted SEO configuration.
            </p>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-mono text-brand-muted">Transformation Style</label>
              <div className="grid grid-cols-3 gap-1 bg-[#050816]/70 border border-white/5 p-1 rounded-xl">
                {['Minimalist ATS', 'Executive Lead', 'Technical Functional'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setCvStyle(style as any)}
                    className={`py-1.5 text-[8px] font-bold rounded-lg transition-all ${
                      cvStyle === style
                        ? 'bg-brand-secondary text-white shadow shadow-brand-secondary/30'
                        : 'text-brand-muted hover:text-white'
                    }`}
                  >
                    {style.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleTriggerCVRewrite}
              disabled={isRewriting}
              className="w-full py-2.5 bg-brand-primary hover:bg-[#7c3aed] text-white text-[11px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand-primary/10 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isRewriting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Aligning Formatting Grid...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  Generate Optimized Rewrite
                </>
              )}
            </button>

            {rewrittenResume && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-3.5 bg-brand-bg/90 border border-emerald-500/20 text-[#A5B4C7] font-mono text-[9px] rounded-xl overflow-x-auto max-h-56 scrollbar-thin select-text relative space-y-3"
              >
                <div className="absolute top-2 right-2 text-[8px] text-emerald-400 border border-emerald-400/20 rounded bg-emerald-400/5 px-1.5 py-0.5">
                  OPTIMIZED v3.4
                </div>
                <pre>{rewrittenResume}</pre>
              </motion.div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
