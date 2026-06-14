import React, { useState, useMemo } from 'react';
import { Search, Filter, Briefcase, MapPin, DollarSign, Building2, Star, Users, ArrowUpRight, Check, X, ShieldCheck } from 'lucide-react';
import { Job, Company, Candidate } from '../types';
import { sampleJobs, sampleCompanies, sampleCandidates } from '../data';

interface JobSearchProps {
  onApply: (job: Job) => void;
  appliedJobIds: string[];
  role: 'seeker' | 'employer';
  onInviteCandidate: (candidate: Candidate) => void;
  invitedCandidateIds: string[];
}

export default function JobSearch({ 
  onApply, 
  appliedJobIds, 
  role, 
  onInviteCandidate,
  invitedCandidateIds 
}: JobSearchProps) {
  const [subTab, setSubTab] = useState<'jobs' | 'companies' | 'talents'>('jobs');
  
  // Job Board Search & Filter state
  const [jobQuery, setJobQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [salaryMinRange, setSalaryMinRange] = useState<number>(0);

  // Company Search & Filter state
  const [companyQuery, setCompanyQuery] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState<string>('All');

  // Candidate Search state
  const [candQuery, setCandQuery] = useState('');
  const [candSkill, setCandSkill] = useState<string>('All');
  const [candAvailability, setCandAvailability] = useState<string>('All');

  // Programmatic Category Pools
  const categories = ['All', 'Technology', 'Healthcare', 'Finance', 'Marketing', 'Engineering', 'Remote'];
  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid'];
  const industries = ['All', 'Enterprise AI', 'Global Fintech', 'Healthcare Security'];

  // FILTER LOGIC FOR MOCK JOBS
  const filteredJobs = useMemo(() => {
    return sampleJobs.filter(job => {
      const matchQuery = job.title.toLowerCase().includes(jobQuery.toLowerCase()) || 
                         job.company.toLowerCase().includes(jobQuery.toLowerCase()) ||
                         job.skillsRequired.some(s => s.toLowerCase().includes(jobQuery.toLowerCase()));
      const matchCat = selectedCategory === 'All' || job.category === selectedCategory;
      const matchType = selectedType === 'All' || job.type === selectedType;
      const matchSalary = job.salaryMin >= salaryMinRange;
      return matchQuery && matchCat && matchType && matchSalary;
    });
  }, [jobQuery, selectedCategory, selectedType, salaryMinRange]);

  // FILTER LOGIC FOR COMPANIES
  const filteredCompanies = useMemo(() => {
    return sampleCompanies.filter(co => {
      const matchQuery = co.name.toLowerCase().includes(companyQuery.toLowerCase()) ||
                         co.description.toLowerCase().includes(companyQuery.toLowerCase());
      const matchInd = companyIndustry === 'All' || co.industry === companyIndustry;
      return matchQuery && matchInd;
    });
  }, [companyQuery, companyIndustry]);

  // FILTER LOGIC FOR CANDIDATES (TALENTS)
  const filteredCandidates = useMemo(() => {
    return sampleCandidates.filter(cand => {
      const matchQuery = cand.name.toLowerCase().includes(candQuery.toLowerCase()) ||
                         cand.title.toLowerCase().includes(candQuery.toLowerCase());
      const matchSkill = candSkill === 'All' || cand.skills.includes(candSkill);
      const matchAvail = candAvailability === 'All' || cand.availability === candAvailability;
      return matchQuery && matchSkill && matchAvail;
    });
  }, [candQuery, candSkill, candAvailability]);

  // Collect all unique skills for talent filtering
  const candidateSkillsPool = useMemo(() => {
    const list = new Set<string>();
    sampleCandidates.forEach(c => c.skills.forEach(s => list.add(s)));
    return ['All', ...Array.from(list)];
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Sub tabs navigation */}
      <div className="flex border-b border-white/10 max-w-md">
        <button
          onClick={() => setSubTab('jobs')}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
            subTab === 'jobs' ? 'border-brand-primary text-white' : 'border-transparent text-brand-muted hover:text-white'
          }`}
        >
          🔍 Jobs Discovery ({filteredJobs.length})
        </button>
        <button
          onClick={() => setSubTab('companies')}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
            subTab === 'companies' ? 'border-brand-primary text-white' : 'border-transparent text-brand-muted hover:text-white'
          }`}
        >
          🏢 Tech Directory
        </button>
        <button
          onClick={() => setSubTab('talents')}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
            subTab === 'talents' ? 'border-brand-primary text-white' : 'border-transparent text-brand-muted hover:text-white'
          }`}
        >
          ✨ Talent Marketplace
        </button>
      </div>

      {/* JOBS COMPONENT */}
      {subTab === 'jobs' && (
        <div className="space-y-6">
          {/* SEARCH ACTIONS BANNER */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-brand-card/85 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-muted" />
              <input
                type="text"
                className="w-full bg-brand-bg/60 text-white rounded-xl border border-white/10 pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                placeholder="Search 100+ jobs by title, tech stack keywords, company..."
                value={jobQuery}
                onChange={(e) => setJobQuery(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <select
                className="w-full bg-brand-bg/60 text-white rounded-xl border border-white/10 px-3 py-2.5 text-xs focus:outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat} Sector</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                className="w-full bg-brand-bg/60 text-white rounded-xl border border-white/10 px-3 py-2.5 text-xs focus:outline-none"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="md:col-span-2 flex items-center justify-end px-2">
              <div className="w-full">
                <label className="text-[10px] text-brand-muted block mb-1 font-mono">Min ${salaryMinRange / 1000}k</label>
                <input
                  type="range"
                  min="0"
                  max="180000"
                  step="10000"
                  value={salaryMinRange}
                  onChange={(e) => setSalaryMinRange(Number(e.target.value))}
                  className="w-full accent-brand-primary h-1 bg-white/15 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* TOTAL INDICATOR DISPLAY */}
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-brand-muted font-mono uppercase tracking-widest">
              Showing <span className="text-brand-primary font-bold font-sans">{filteredJobs.length}</span> live matching contracts
            </span>
            {salaryMinRange > 0 && (
              <button 
                onClick={() => setSalaryMinRange(0)}
                className="text-[10px] text-brand-warning bg-brand-warning/10 border border-brand-warning/20 px-2 py-0.5 rounded"
              >
                Clear Salary Filter
              </button>
            )}
          </div>

          {/* GRID RENDERERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.slice(0, 32).map((job) => {
              const applied = appliedJobIds.includes(job.id);
              return (
                <div key={job.id} className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-brand-primary/40 transition-all shadow-md group">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary/10 to-brand-secondary/15 border border-white/5 flex items-center justify-center text-white text-xs font-bold font-display uppercase tracking-widest leading-none">
                          {job.company.substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm group-hover:text-brand-primary transition-colors leading-tight">
                            {job.title}
                          </h4>
                          <span className="text-xs text-brand-muted block mt-0.5">{job.company}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-white/5 rounded">
                        {job.type}
                      </span>
                    </div>

                    <p className="text-xs text-[#A5B4C7] line-clamp-2 leading-relaxed font-sans">{job.description}</p>

                    {/* Meta data tags */}
                    <div className="flex flex-wrap gap-2 text-[10px] text-brand-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-brand-success font-semibold">
                        <DollarSign className="w-3.5 h-3.5" /> ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                      </span>
                    </div>

                    {/* Skill required */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.skillsRequired.map((s, sIdx) => (
                        <span key={sIdx} className="text-[9px] font-mono px-2 py-0.5 bg-brand-elevated text-brand-muted rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/15 pt-3 mt-4 flex justify-between items-center">
                    <span className="text-[10px] text-brand-muted font-mono">Posted: {job.postedAt}</span>
                    <button
                      onClick={() => onApply(job)}
                      disabled={applied}
                      className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
                        applied 
                          ? 'bg-brand-success/10 text-brand-success border border-brand-success/20 cursor-default' 
                          : 'bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white border border-brand-primary/30'
                      }`}
                    >
                      {applied ? '✓ Handed Over' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredJobs.length === 0 && (
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl">
              <span className="font-bold text-white text-md block">Zero Active Job Matches Find</span>
              <span className="text-xs text-brand-muted mt-1 block">Adjust search parameters or broaden salary constraints.</span>
            </div>
          )}
        </div>
      )}

      {/* TECH DIRECTORY */}
      {subTab === 'companies' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-brand-card p-5 rounded-2xl border border-white/10">
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-muted" />
              <input
                type="text"
                className="w-full bg-brand-bg text-white rounded-xl border border-white/10 pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-brand-primary"
                placeholder="Search registered enterprises, ratings, structures..."
                value={companyQuery}
                onChange={(e) => setCompanyQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full bg-brand-bg text-white rounded-xl border border-white/10 px-3 py-2 text-xs focus:outline-none"
                value={companyIndustry}
                onChange={(e) => setCompanyIndustry(e.target.value)}
              >
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCompanies.map((co) => (
              <div key={co.id} className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-brand-primary/40 transition-all">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-elevated border border-white/10 flex items-center justify-center font-bold text-white uppercase tracking-widest text-sm">
                        {co.name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{co.name}</h4>
                        <span className="text-xs text-brand-primary block">{co.industry}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-brand-warning bg-brand-warning/10 px-2 py-0.5 rounded font-mono text-xs">
                      <Star className="w-3 h-3 fill-brand-warning" />
                      {co.rating}
                    </div>
                  </div>

                  <p className="text-xs text-[#A5B4C7] leading-relaxed">{co.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-brand-muted">
                    <div className="bg-white/5 p-2 rounded">
                      <span className="block text-white font-bold">{co.openPositions} Opening</span>
                      <span className="text-[8px] uppercase">Active roles</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded">
                      <span className="block text-white font-bold">{co.employees}</span>
                      <span className="text-[8px] uppercase">Total Size</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-brand-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {co.location}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedCategory('All');
                      setJobQuery(co.name);
                      setSubTab('jobs');
                    }}
                    className="text-xs text-brand-primary hover:underline flex items-center gap-1"
                  >
                    View Positions <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TALENT MARKETPLACE */}
      {subTab === 'talents' && (
        <div className="space-y-6">
          <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-primary shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">Enterprise Talent Intelligence</span>
              <span className="text-brand-muted block">Mock view of highly matching resumes optimized under our recruitment CRM algorithms.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-brand-card p-5 rounded-2xl border border-white/10">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-muted" />
              <input
                type="text"
                className="w-full bg-brand-bg text-white rounded-xl border border-white/10 pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-brand-primary"
                placeholder="Filter by title, target sector..."
                value={candQuery}
                onChange={(e) => setCandQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full bg-brand-bg text-white rounded-xl border border-white/10 px-3 py-2 text-xs focus:outline-none"
                value={candSkill}
                onChange={(e) => setCandSkill(e.target.value)}
              >
                {candidateSkillsPool.map(sk => <option key={sk} value={sk}>{sk} Expert</option>)}
              </select>
            </div>
            <div>
              <select
                className="w-full bg-brand-bg text-white rounded-xl border border-white/10 px-3 py-2 text-xs focus:outline-none"
                value={candAvailability}
                onChange={(e) => setCandAvailability(e.target.value)}
              >
                <option value="All">All Availability</option>
                <option value="Immediate">Immediate Active</option>
                <option value="1 Month">1 Month Notice</option>
                <option value="Passive">Passive Outlook</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((cand) => {
              const invited = invitedCandidateIds.includes(cand.id);
              return (
                <div key={cand.id} className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-brand-primary/35 transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <img 
                        src={cand.avatarUrl} 
                        className="w-12 h-12 rounded-xl object-cover border border-white/5" 
                        alt={cand.name} 
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white text-sm leading-tight">{cand.name}</h4>
                          <span className={`w-2 h-2 rounded-full ${
                            cand.availability === 'Immediate' ? 'bg-brand-success' : 'bg-brand-warning'
                          }`}></span>
                        </div>
                        <span className="text-xs text-brand-muted block">{cand.title}</span>
                      </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-brand-muted">Target Range:</span>
                        <span className="text-white font-semibold font-mono">{cand.desiredSalary}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-brand-muted">Total Tenure:</span>
                        <span className="text-white font-mono">{cand.experienceYears} Years</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-brand-muted">Viability Score:</span>
                        <span className="text-brand-primary font-bold font-mono">{cand.score}/100</span>
                      </div>
                    </div>

                    {/* Skill list */}
                    <div className="flex flex-wrap gap-1.5">
                      {cand.skills.map((sk, skIdx) => (
                        <span key={skIdx} className="text-[9px] font-mono px-2 py-0.5 bg-brand-elevated text-brand-muted rounded border border-white/5">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3 mt-4 flex justify-between items-center">
                    <span className="text-[10px] text-brand-muted">{cand.location}</span>
                    <button
                      onClick={() => onInviteCandidate(cand)}
                      disabled={invited}
                      className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all ${
                        invited 
                          ? 'bg-brand-success/15 text-brand-success border border-brand-success/20 cursor-default'
                          : 'bg-brand-primary text-white hover:bg-opacity-95'
                      }`}
                    >
                      {invited ? '✓ Invitation Sent' : 'Invite Interview'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
