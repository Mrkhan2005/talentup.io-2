import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Sparkles, Award, ArrowUpRight, CheckCircle, Info, HelpCircle, 
  ChevronRight, Calendar, Zap, DollarSign, Target, Briefcase, Sliders, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { ResumeAnalysisResult } from '../types';

interface CareerPathSimulatorProps {
  resumeAnalysis?: ResumeAnalysisResult | null;
  profile: {
    title: string;
    experienceYears: number;
    desiredSalary: string;
    location: string;
    skills: string;
  };
}

export default function CareerPathSimulator({ resumeAnalysis, profile }: CareerPathSimulatorProps) {
  // Current resume score (Default to 92 if not analyzed, or user's score)
  const currentResumeScore = resumeAnalysis ? resumeAnalysis.overallScore : 92;

  // State controls for Simulator
  const [selectedSector, setSelectedSector] = useState<'ai_ml' | 'fintech' | 'saas' | 'general'>('ai_ml');
  const [simDuration, setSimDuration] = useState<5 | 10>(5);
  const [targetResumeScore, setTargetResumeScore] = useState<number>(currentResumeScore || 90);

  // Sector-specific configuration multipliers
  const sectorPresets = useMemo(() => {
    return {
      ai_ml: {
        name: 'Artificial Intelligence & Machine Learning Eng',
        baseSalary: 145000,
        baselineGrowthRate: 0.058, // 5.8% base annual growth
        optimizedGrowthRateMultiplier: 0.125, // Up to 12.5% with perfect CV
        milestones: [
          { year: 1, title: 'Senior AI Engineer', desc: 'Secure high-impact roles at top tier model builders bypassing HR filters.' },
          { year: 3, title: 'Staff Research Architect', desc: 'Lead quantitative team pipelines representing advanced optimization structures.' },
          { year: 5, title: 'Director of AI Systems', desc: 'Own unified system designs and model serving layers with premium comp metrics.' },
          { year: 8, title: 'VP of Cognitive Technology', desc: 'Deploy state-of-the-art enterprise paradigms with massive stock allocations.' },
          { year: 10, title: 'Chief AI Officer', desc: 'Align executive board members on total artificial intelligence investments.' }
        ]
      },
      fintech: {
        name: 'Fintech & Web Platform Systems',
        baseSalary: 135000,
        baselineGrowthRate: 0.048, // 4.8% base
        optimizedGrowthRateMultiplier: 0.098, // Up to 9.8% with perfect CV
        milestones: [
          { year: 1, title: 'Senior Web Architect', desc: 'Establish robust micro-frontend standards & secure payment pathways.' },
          { year: 3, title: 'Lead Interface Engineer', desc: 'Optimize telemetry loops and core trade matching screen latencies.' },
          { year: 5, title: 'Principal Platform Lead', desc: 'Consolidate distributed CJS/ESM modules across multi-billion portfolios.' },
          { year: 8, title: 'Director of Web Engineering', desc: 'Scale cross-border consumer gateways and regulatory compliance systems.' },
          { year: 10, title: 'VP of Platform Architecture', desc: 'Spearhead global financial engine transitions to unified secure frameworks.' }
        ]
      },
      saas: {
        name: 'Enterprise Cloud & SaaS Infrastructure',
        baseSalary: 125000,
        baselineGrowthRate: 0.042, // 4.2% base
        optimizedGrowthRateMultiplier: 0.082, // Up to 8.2% with perfect CV
        milestones: [
          { year: 1, title: 'Devops/Frontend Specialist', desc: 'Deploy lightning-fast Vite applications integrating server routing.' },
          { year: 3, title: 'Lead SaaS Engineer', desc: 'Drive product-led growth features paired with user-centric visual systems.' },
          { year: 5, title: 'Staff Systems Architect', desc: 'Overhaul complex multi-tenant admin grids and analytical workflows.' },
          { year: 8, title: 'Director of Application Delivery', desc: 'Evangelize premium visual components supporting high retention.' },
          { year: 10, title: 'VP of Product Infrastructure', desc: 'Direct secure multicloud delivery cycles and developer operations.' }
        ]
      },
      general: {
        name: 'Standard Software Engineering Sector',
        baseSalary: 110000,
        baselineGrowthRate: 0.035, // 3.5% base
        optimizedGrowthRateMultiplier: 0.070, // Up to 7.0% with perfect CV
        milestones: [
          { year: 1, title: 'Software Engineer II', desc: 'Deliver production-ready features across standard web frameworks.' },
          { year: 3, title: 'Senior Software Engineer', desc: 'Manage modular applications, refactoring static logic loops.' },
          { year: 5, title: 'Tech Lead Manager', desc: 'Guide sprint trajectories, prioritizing high readability clean code.' },
          { year: 8, title: 'Principal Engineer', desc: 'Drive high-importance cross-team integrations from initial blueprints.' },
          { year: 10, title: 'Head of Engineering', desc: 'Supervise technical resources and represent development teams.' }
        ]
      }
    };
  }, []);

  // Sync baseline salary from profile expectations if available
  const initialBaseSalary = useMemo(() => {
    let parsed = sectorPresets[selectedSector].baseSalary;
    if (profile.desiredSalary) {
      const matches = profile.desiredSalary.match(/\d+[\d,.]*/);
      if (matches && matches[0]) {
        const val = parseInt(matches[0].replace(/,/g, ''), 10);
        if (val > 50000 && val < 400000) {
          parsed = val;
        }
      }
    }
    return parsed;
  }, [profile.desiredSalary, selectedSector, sectorPresets]);

  // Generate Career Growth Chart Data
  const chartData = useMemo(() => {
    const config = sectorPresets[selectedSector];
    const data = [];

    // Calculate dynamic growth rates based on Target Resume Score
    // Higher resume score = higher baseline start + faster compound promotion salary progression
    const scoreFactor = (targetResumeScore - 60) / 40; // 0 to 1 scaling from score 60 to 100
    const boundedFactor = Math.max(0, Math.min(1, scoreFactor));

    // Instant premium multiplier on start salary (ATS verified resumes command higher signing bands)
    const signingPremiumRatio = 1 + (boundedFactor * 0.15); // up to 15% immediate bump on start
    
    const baselineStart = initialBaseSalary;
    const optimizedStart = initialBaseSalary * signingPremiumRatio;

    // Compound Rate calculations
    const baselineGrowth = config.baselineGrowthRate;
    // Optimized growth can reach the maximum multiplier according to resume score
    const optimizedGrowth = baselineGrowth + (boundedFactor * (config.optimizedGrowthRateMultiplier - baselineGrowth));

    for (let year = 0; year <= simDuration; year++) {
      const baselineVal = Math.round(baselineStart * Math.pow(1 + baselineGrowth, year));
      const optimizedVal = Math.round(optimizedStart * Math.pow(1 + optimizedGrowth, year));
      
      // Determine seniority milestone text
      let milestoneName = 'Standard progression';
      if (year === 0) {
        milestoneName = 'Entry Target';
      } else {
        const matchingMilestone = config.milestones.find(m => m.year === year || (year > m.year && !config.milestones.some(other => other.year > m.year && other.year <= year)));
        milestoneName = matchingMilestone ? matchingMilestone.title : 'Senior Professional Area';
      }

      data.push({
        year: `Year ${year}`,
        yearNum: year,
        baseline: baselineVal,
        optimized: optimizedVal,
        milestone: milestoneName
      });
    }
    return data;
  }, [selectedSector, simDuration, targetResumeScore, initialBaseSalary, sectorPresets]);

  // Summary Metrics calculations
  const totalEarningsLift = useMemo(() => {
    let baselineSum = 0;
    let optimizedSum = 0;
    chartData.forEach(d => {
      baselineSum += d.baseline;
      optimizedSum += d.optimized;
    });
    return optimizedSum - baselineSum;
  }, [chartData]);

  const maxSalaryReached = useMemo(() => {
    return chartData[chartData.length - 1].optimized;
  }, [chartData]);

  const progressBonusPercentage = useMemo(() => {
    const config = sectorPresets[selectedSector];
    const baseG = config.baselineGrowthRate * 100;
    const optG = (config.baselineGrowthRate + ((targetResumeScore - 60) / 40) * (config.optimizedGrowthRateMultiplier - config.baselineGrowthRate)) * 100;
    return {
      base: baseG.toFixed(1),
      opt: optG.toFixed(1),
      delta: (optG - baseG).toFixed(1)
    };
  }, [selectedSector, targetResumeScore, sectorPresets]);

  return (
    <div className="space-y-6">
      
      {/* 1. BLUEPRINT HEADER */}
      <div className="bg-[#0b1220]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-primary/15 border border-brand-primary/20 rounded text-[9px] font-mono font-bold text-brand-primary uppercase tracking-wider">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              Real-world Projection Node
            </div>
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              Career Trajectory & Compensation Simulator
            </h2>
            <p className="text-xs text-brand-muted max-w-xl leading-relaxed">
              Calculate the long-term compounding impact of an optimized ATS CV structure. Recalculate salary growth thresholds based on industry target presets.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-brand-primary px-2.5 py-1 rounded-full uppercase tracking-widest font-bold self-start md:self-auto">
            Algorithm v2.5 Online
          </span>
        </div>
      </div>

      {/* 2. CONTROL SELECTION PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Trajectory Toggles */}
        <div className="md:col-span-8 bg-[#0b1220]/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
              <Briefcase className="w-3.5 h-3.5 text-brand-primary" /> Select Market Vertical
            </span>
            <span className="text-[9px] font-mono text-brand-muted uppercase">Updates Baseline Standards</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(sectorPresets) as Array<keyof typeof sectorPresets>).map((key) => {
              const info = sectorPresets[key];
              const isSelected = selectedSector === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedSector(key)}
                  className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-between h-20 active:scale-95 cursor-pointer ${
                    isSelected 
                      ? 'bg-brand-primary/10 border-brand-primary text-white shadow-lg shadow-brand-primary/5' 
                      : 'bg-white/[0.01] border-white/5 text-brand-muted hover:border-white/15 hover:bg-white/[0.02]'
                  }`}
                >
                  <span className={`text-[10px] font-bold block leading-tight truncate w-full ${isSelected ? 'text-white' : 'text-brand-muted'}`}>
                    {key === 'ai_ml' ? 'AI & ML Core' : key === 'fintech' ? 'Fintech SaaS' : key === 'saas' ? 'Enterprise Cloud' : 'Standard Tech'}
                  </span>
                  <div className="flex items-end justify-between w-full">
                    <span className="text-[9px] font-mono text-brand-muted">Base ${Math.round(info.baseSalary/1000)}k</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Timeline Duration */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider text-brand-muted">Simulation Timeline Horizon</label>
              <div className="flex gap-2">
                {[5, 10].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSimDuration(dur as any)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      simDuration === dur
                        ? 'bg-brand-secondary/20 border-brand-secondary text-white'
                        : 'bg-white/[0.01] border-white/5 text-brand-muted hover:text-white'
                    }`}
                  >
                    {dur}-Year Growth Sprint
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Score adjustment slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-mono tracking-wider text-brand-muted">Projected Resume Optimization Score</label>
                <span className={`text-xs font-mono font-extrabold ${targetResumeScore >= 90 ? 'text-emerald-400' : 'text-brand-primary'}`}>
                  {targetResumeScore}/100 Score
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 p-2 rounded-xl">
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={targetResumeScore}
                  onChange={(e) => setTargetResumeScore(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats Info */}
        <div className="md:col-span-4 bg-[#0b1220]/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 rounded-full blur-2xl" />
          
          <div className="space-y-3.5">
            <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block border-b border-white/5 pb-1">
              Differential Projection Dividends
            </span>

            <div>
              <span className="text-[10px] text-brand-muted block">Estimated Comp Cumulative Lift</span>
              <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight block mt-0.5">
                +${totalEarningsLift.toLocaleString()}
              </span>
              <span className="text-[9px] text-brand-muted block mt-1 leading-normal font-sans">
                Accumulated wage advantage over {simDuration} years with top-tier ATS optimization parameters.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
              <div>
                <span className="text-[9px] text-[#A5B4C7] block">Standard Progression CAGR</span>
                <span className="text-xs font-mono font-bold text-white">{progressBonusPercentage.base}%</span>
              </div>
              <div>
                <span className="text-[9px] text-indigo-300 block">Optimized Progression CAGR</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{progressBonusPercentage.opt}%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#050816]/70 border border-white/5 px-3.5 py-2.5 rounded-xl text-[10px] text-brand-muted leading-relaxed flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Target resume score of <strong>{targetResumeScore}</strong> secures elite recruitment bypass codes.</span>
          </div>
        </div>

      </div>

      {/* 3. CHARTS INTERACTIVE STAGE */}
      <div className="bg-[#0b1220]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-left">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand-primary" /> Projecting Comp Development Tracks
            </h3>
            <p className="text-[11px] text-brand-muted mt-0.5 leading-snug">
              Annual comparison of standard unoptimized career development paths (Baseline) vs Apply4U optimized layout strategies.
            </p>
          </div>

          {/* Chart Legend Labels */}
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-brand-muted rounded-full inline-block" />
              <span className="text-brand-muted">Baseline Standard</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-brand-primary rounded-full inline-block" />
              <span className="text-brand-primary">Apply4U Optimized</span>
            </span>
          </div>
        </div>

        {/* CHART PORT */}
        <div className="h-72 w-full pt-4 relative overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 12, right: 18, left: 18, bottom: 5 }}
            >
              <defs>
                <linearGradient id="lineOptimizedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                vertical={false} 
                stroke="rgba(255, 255, 255, 0.04)" 
                strokeDasharray="3 3"
              />
              <XAxis 
                dataKey="year" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#A5B4C7', fontSize: 10, fontFamily: 'monospace' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                tick={{ fill: '#A5B4C7', fontSize: 10, fontFamily: 'monospace' }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as any;
                    return (
                      <div className="bg-[#0B1220]/95 border border-white/10 rounded-xl p-3 shadow-xl space-y-1.5 font-mono text-[10px] backdrop-blur-md">
                        <div className="text-white font-bold font-sans border-b border-white/5 pb-1 flex justify-between gap-4">
                          <span>{data.year}</span>
                          <span className="text-indigo-400 font-mono">{data.milestone}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between gap-6">
                            <span className="text-brand-muted font-bold">Standard Baseline:</span>
                            <span className="text-white font-extrabold">${data.baseline?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between gap-6">
                            <span className="text-brand-primary font-bold">Apply4U Projections:</span>
                            <span className="text-emerald-400 font-extrabold">${data.optimized?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between gap-6 border-t border-white/5 pt-1 text-emerald-400 font-bold">
                            <span>SLA Earnings Lift:</span>
                            <span>+${(data.optimized - data.baseline).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Baseline standard track */}
              <Line 
                name="Baseline Standard"
                type="monotone" 
                dataKey="baseline" 
                stroke="rgba(255, 255, 255, 0.25)" 
                strokeWidth={2}
                strokeDasharray="4 4"
                activeDot={{ r: 4 }}
                dot={{ r: 2, fill: '#A5B4C7' }}
              />
              {/* Optimized Comp Growth track */}
              <Line 
                name="Apply4U Projections"
                type="monotone" 
                dataKey="optimized" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                dot={{ r: 3, fill: '#8B5CF6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone Tracker Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
            <span className="text-[8px] font-mono uppercase text-brand-muted">Target Career Anchor (Year 1)</span>
            <div className="text-xs font-bold text-white">
              {sectorPresets[selectedSector].milestones[0].title}
            </div>
            <p className="text-[10px] text-brand-muted leading-relaxed font-sans mt-0.5">
              {sectorPresets[selectedSector].milestones[0].desc}
            </p>
          </div>
          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
            <span className="text-[8px] font-mono uppercase text-indigo-300">Midpoint Trajectory (Year 5)</span>
            <div className="text-xs font-bold text-indigo-400">
              {sectorPresets[selectedSector].milestones[2].title}
            </div>
            <p className="text-[10px] text-brand-muted leading-relaxed font-sans mt-0.5">
              {sectorPresets[selectedSector].milestones[2].desc}
            </p>
          </div>
          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
            <span className="text-[8px] font-mono uppercase text-brand-secondary">Peak Comp Terminal Horizon</span>
            <div className="text-xs font-bold text-emerald-400">
              ${maxSalaryReached.toLocaleString()} / Yr
            </div>
            <p className="text-[10px] text-brand-muted leading-relaxed font-sans mt-0.5">
              Secure elite sector standing in Year {simDuration} with accelerated authority parameters.
            </p>
          </div>
        </div>
      </div>

      {/* 4. HIGHLIGHT ACTIONS EXERT DETAILS */}
      <div className="bg-[#0b1220]/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3.5">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-secondary" />
          <h4 className="text-xs font-extrabold tracking-wider text-white uppercase font-sans">Strategic Recommendations To Maximize Comp</h4>
        </div>
        
        <div className="space-y-2.5 text-xs text-brand-muted font-sans p-1">
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</div>
            <div>
              <span className="font-bold text-white block">Close the Keyword gaps</span>
              <p className="text-[10px] text-brand-muted mt-0.5 leading-relaxed">
                Your current score is <strong>{currentResumeScore}</strong>. By closing technical keyword gaps represented in the AI Panel, your score rises to <strong>{targetResumeScore >= 95 ? targetResumeScore : 96}</strong>, unlocking up to <strong>+18% placement speed multipliers</strong>.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</div>
            <div>
              <span className="font-bold text-white block">Leverage automated negotiation phrasing</span>
              <p className="text-[10px] mt-0.5 text-brand-muted leading-relaxed">
                Bypass repetitive sifting procedures. Armed with the <strong>Salary Benchmark Script Node</strong>, confidently assert compensation anchors during early stages.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
