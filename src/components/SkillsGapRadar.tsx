import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip 
} from 'recharts';
import { 
  Target, Award, AlertCircle, Sparkles, Check, Zap, ArrowUpRight, Wrench, ShieldAlert, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeAnalysisResult } from '../types';

interface SkillsGapRadarProps {
  resumeAnalysis?: ResumeAnalysisResult | null;
  profile: {
    title: string;
    skills: string;
  };
}

export default function SkillsGapRadar({ resumeAnalysis, profile }: SkillsGapRadarProps) {
  // Define available target profile roles for customization
  const [targetType, setTargetType] = useState<'architecture' | 'ai_engineering' | 'fullstack'>('architecture');

  // Pre-configured capabilities & minimum targets per profile
  const rolePresets = useMemo(() => {
    return {
      architecture: {
        title: 'Lead Frontend UI Architect',
        requiredSkills: ['React 19 & Next.js', 'Advanced TypeScript', 'Micro-Frontends', 'Tailwind & Motion', 'Performance Metrics', 'CI/CD & DevOps'],
        targets: [95, 90, 85, 95, 90, 80],
        currentBase: [90, 92, 70, 94, 75, 60] // current skill levels mapped
      },
      ai_engineering: {
        title: 'Senior AI Platform Engineer',
        requiredSkills: ['Model Inference APIs', 'TypeScript / Python', 'Real-time WebSockets', 'UI Streaming Layers', 'Vector DBs & Search', 'Docker & Kubeflow'],
        targets: [90, 95, 90, 90, 85, 80],
        currentBase: [75, 92, 85, 70, 60, 50]
      },
      fullstack: {
        title: 'Enterprise Fullstack Engineer',
        requiredSkills: ['Next.js App Router', 'Node.js & Express', 'Relational Schemas', 'API Orchestration', 'Client-side State', 'Cloud Serverless'],
        targets: [95, 90, 85, 90, 95, 85],
        currentBase: [92, 80, 75, 88, 92, 70]
      }
    };
  }, []);

  // Compute dynamic skill levels basing on the user's real AI resume analysis
  const radarData = useMemo(() => {
    const preset = rolePresets[targetType];
    
    // Overall resume optimization multipliers - if they have a higher ATS/Formatting/Keyword score, it boosts the current levels close to the target!
    const overallScore = resumeAnalysis ? resumeAnalysis.overallScore : 92;
    const keywordMatch = resumeAnalysis ? resumeAnalysis.keywordMatchScore : 89;
    
    // Calculate an optimization factor from 0.8 to 1.15
    const optimizationFactor = 0.8 + ((overallScore - 60) / 40) * 0.35; 

    return preset.requiredSkills.map((skill, idx) => {
      let baseVal = preset.currentBase[idx];
      
      // Fine-tune individual vectors based on real analysis parameters
      if (resumeAnalysis) {
        // Look for specific negative signals in missing skills
        const isMissingLower = resumeAnalysis.missingSkills.some(
          ms => ms.toLowerCase().includes(skill.toLowerCase()) || 
                skill.toLowerCase().includes(ms.toLowerCase()) ||
                (ms.toLowerCase().includes("system design") && skill.toLowerCase().includes("architecture")) ||
                (ms.toLowerCase().includes("docker") && skill.toLowerCase().includes("devops"))
        );

        if (isMissingLower) {
          // penalize that specific vector because the AI explicitly noted it as missing!
          baseVal = Math.max(45, Math.round(preset.targets[idx] * 0.62));
        } else {
          // boost slightly if it is a noted strength
          const isStrength = resumeAnalysis.strengths.some(
            st => st.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(st.toLowerCase())
          );
          if (isStrength) {
            baseVal = Math.min(100, Math.round(preset.targets[idx] * 1.05));
          } else {
            // scale normally
            baseVal = Math.min(100, Math.max(40, Math.round(baseVal * optimizationFactor)));
          }
        }
      } else {
        baseVal = Math.min(100, Math.max(40, Math.round(baseVal * optimizationFactor)));
      }

      return {
        subject: skill,
        CurrentLevel: baseVal,
        TargetLevel: preset.targets[idx],
        gap: preset.targets[idx] - baseVal
      };
    });
  }, [targetType, resumeAnalysis, rolePresets]);

  // Derive exact matching summary details
  const matchingSummary = useMemo(() => {
    let totalTarget = 0;
    let totalCurrent = 0;
    let gapsCount = 0;
    let seriousGaps: string[] = [];

    radarData.forEach(d => {
      totalTarget += d.TargetLevel;
      totalCurrent += d.CurrentLevel;
      if (d.gap > 10) {
        gapsCount++;
        seriousGaps.push(d.subject);
      }
    });

    const matchRatio = Math.round((totalCurrent / totalTarget) * 100);

    return {
      matchPercent: Math.min(100, matchRatio),
      gapsCount,
      seriousGaps
    };
  }, [radarData]);

  return (
    <div className="bg-[#0b1220]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl"></div>
      
      {/* SECTION TITLE & TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="text-left space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-secondary/15 border border-brand-secondary/20 rounded text-[9px] font-mono font-bold text-brand-secondary uppercase tracking-wider">
            <Target className="w-3 h-3 text-cyan-400" />
            Vetted Requirement Mapping
          </div>
          <h3 className="font-extrabold text-sm text-white font-sans flex items-center gap-1.5">
            ATS Skills Gap Radar Chart
          </h3>
          <p className="text-[11px] text-brand-muted leading-relaxed">
            Side-by-side visualization mapping user current score indices against elite sector benchmarks.
          </p>
        </div>

        {/* PROFILE ROLE SELECTOR */}
        <div className="flex bg-[#050816]/70 border border-white/5 p-1 rounded-xl">
          {[
            { id: 'architecture', label: 'UI Architect' },
            { id: 'ai_engineering', label: 'AI Platform' },
            { id: 'fullstack', label: 'Fullstack' }
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setTargetType(btn.id as any)}
              className={`py-1.5 px-3 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                targetType === btn.id
                  ? 'bg-brand-secondary text-white shadow shadow-brand-secondary/35'
                  : 'text-brand-muted hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* COMPACT GAP CHIP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#050816]/50 rounded-xl p-3 border border-white/5 space-y-0.5">
          <span className="text-[9px] font-mono text-brand-muted uppercase">Global Skill Affinity</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-emerald-400">{matchingSummary.matchPercent}%</span>
            <span className="text-[10px] text-brand-muted font-sans font-medium">Alignment Level</span>
          </div>
        </div>

        <div className="bg-[#050816]/50 rounded-xl p-3 border border-white/5 space-y-0.5">
          <span className="text-[9px] font-mono text-brand-muted uppercase">Urgent Gaps Found</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-bold font-mono ${matchingSummary.gapsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {matchingSummary.gapsCount}
            </span>
            <span className="text-[10px] text-brand-muted font-sans font-medium">Deficit Domains</span>
          </div>
        </div>

        <div className="bg-[#050816]/50 rounded-xl p-3 border border-white/5 space-y-0.5">
          <span className="text-[9px] font-mono text-brand-muted uppercase">Target Job Standard</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-white">Elite</span>
            <span className="text-[10px] text-brand-muted font-sans font-medium">SLA Tier 1</span>
          </div>
        </div>
      </div>

      {/* CORE RADAR STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* RADAR CANVAS */}
        <div className="lg:col-span-7 h-64 sm:h-72 flex items-center justify-center relative bg-white/[0.01] rounded-2xl border border-white/5 p-4 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#A5B4C7', fontSize: 9, fontFamily: 'sans-serif' }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: '#64748B', fontSize: 8 }}
                axisLine={false}
              />
              {/* Tooltip implementation */}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#0B1220]/95 border border-white/10 rounded-xl p-3 shadow-xl space-y-1 font-mono text-[9px]">
                        <div className="text-white font-bold font-sans border-b border-white/5 pb-1 select-none">
                          {data.subject}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between gap-5 text-indigo-400">
                            <span>Your Level:</span>
                            <span className="font-extrabold">{data.CurrentLevel}/100</span>
                          </div>
                          <div className="flex justify-between gap-5 text-gray-400">
                            <span>Sector Benchmark:</span>
                            <span className="font-extrabold">{data.TargetLevel}/100</span>
                          </div>
                          <div className={`flex justify-between gap-5 border-t border-white/5 pt-1 font-bold ${data.gap > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            <span>Deficit Gap:</span>
                            <span>{data.gap > 0 ? `-${data.gap}` : 'Optimized'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Target benchmark shape */}
              <Radar
                name="Benchmark Standard"
                dataKey="TargetLevel"
                stroke="rgba(255, 255, 255, 0.45)"
                fill="rgba(255, 255, 255, 0.05)"
                fillOpacity={0.6}
              />
              {/* Profile current status shape */}
              <Radar
                name="Your Resume Score"
                dataKey="CurrentLevel"
                stroke="#8B5CF6"
                fill="url(#radarGradient)"
                fillOpacity={0.4}
              />
              {/* Gradient def for radar */}
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* GAP RESOLUTION ROADMAP */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 font-display border-b border-white/5 pb-1.5">
            <Wrench className="w-4 h-4 text-brand-secondary" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gap Resolution Roadmap</h4>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto scrollbar-thin pr-1">
            {radarData.map((sk) => {
              const isSerious = sk.gap > 10;
              const isOptimized = sk.gap <= 0;
              return (
                <div 
                  key={sk.subject} 
                  className={`p-3 rounded-xl border flex gap-2.5 items-start transition-all ${
                    isOptimized 
                      ? 'bg-emerald-500/5 border-emerald-500/15'
                      : isSerious
                        ? 'bg-amber-500/5 border-amber-500/15'
                        : 'bg-white/[0.01] border-white/5'
                  }`}
                >
                  {isOptimized ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[9px] flex items-center justify-center shrink-0 font-bold mt-0.5">✓</span>
                  ) : isSerious ? (
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[9px] flex items-center justify-center shrink-0 font-bold mt-0.5">!</span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-white/10 text-indigo-300 font-mono text-[9px] flex items-center justify-center shrink-0 font-bold mt-0.5">i</span>
                  )}
                  
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[11px] font-bold text-white block leading-snug">{sk.subject}</span>
                      <span className="text-[9px] font-mono text-brand-muted">
                        {sk.CurrentLevel} vs {sk.TargetLevel}
                      </span>
                    </div>
                    <p className="text-[10px] text-brand-muted leading-relaxed">
                      {isOptimized 
                        ? 'Strong asset. Matches or exceeds target market depth requirements.' 
                        : isSerious 
                          ? `Serious skill deficit of -${sk.gap} points. Rectify by including relevant quantitative indicators.`
                          : 'Minor compatibility delta. Easily resolved with structural placement adjustments.'
                      }
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick AI Help Info Box */}
          <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/15 rounded-xl p-3 flex gap-2.5 items-start">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 font-sans">
              <span className="text-[9px] font-mono uppercase tracking-wider text-white font-bold block">
                Close Skills Gap In 1 Click
              </span>
              <p className="text-[10px] text-[#A5B4C7] leading-relaxed">
                Head over to our <strong>AIPanel</strong> upload center to automatically align formatting and cover lack of keywords metrics.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
