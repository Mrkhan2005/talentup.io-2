import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, ShieldCheck, Heart, Users, Target, Rocket, Compass, Sparkles, 
  MessageSquare, UserCheck, ArrowUpRight, CheckCircle2, Star, Zap, Network, Mail, Linkedin
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function AboutUs() {
  const [founderImg, setFounderImg] = useState('/assets/founder.png');
  const [founderAttempts, setFounderAttempts] = useState(0);

  const [coFounderImg, setCoFounderImg] = useState('/assets/co_founder.png');
  const [coFounderAttempts, setCoFounderAttempts] = useState(0);

  const handleFounderError = () => {
    if (founderAttempts === 0) {
      setFounderImg('/assets/founder.jpg');
      setFounderAttempts(1);
    } else if (founderAttempts === 1) {
      setFounderImg('/assets/founder.jpeg');
      setFounderAttempts(2);
    } else if (founderAttempts === 2) {
      // In case the file was uploaded directly under a user-friendly custom name
      setFounderImg('/founder.png');
      setFounderAttempts(3);
    } else if (founderAttempts === 3) {
      setFounderImg('/founder.jpg');
      setFounderAttempts(4);
    } else {
      // Fallback fallback: high-quality curated profile fit for Dr. Siddiqui
      setFounderImg('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600&h=800');
    }
  };

  const handleCoFounderError = () => {
    if (coFounderAttempts === 0) {
      setCoFounderImg('/assets/co_founder.jpg');
      setCoFounderAttempts(1);
    } else if (coFounderAttempts === 1) {
      setCoFounderImg('/assets/co_founder.jpeg');
      setCoFounderAttempts(2);
    } else if (coFounderAttempts === 2) {
      // In case alternative folder paths exist
      setCoFounderImg('/co-founder.png');
      setCoFounderAttempts(3);
    } else if (coFounderAttempts === 3) {
      setCoFounderImg('/co-founder.jpg');
      setCoFounderAttempts(4);
    } else if (coFounderAttempts === 4) {
      setCoFounderImg('/assets/co-founder.png');
      setCoFounderAttempts(5);
    } else {
      // Fallback fallback: high-quality curated profile fit for Mr. Khan
      setCoFounderImg('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const principles = [
    {
      step: "01",
      title: "Personalized Coaching",
      desc: "Every individual receives tailored guidance based on their unique career goals and challenges.",
      color: "from-purple-500/20 to-indigo-500/10",
      accent: "text-purple-400"
    },
    {
      step: "02",
      title: "Measurable Impact",
      desc: "We track and measure the real impact of our coaching to ensure tangible career growth.",
      color: "from-emerald-500/20 to-teal-500/10",
      accent: "text-emerald-400"
    },
    {
      step: "03",
      title: "Growing Potential",
      desc: "Empowering professionals to reach their fullest potential through expert guidance and support.",
      color: "from-cyan-500/20 to-blue-500/10",
      accent: "text-cyan-400"
    }
  ];

  return (
    <div className="space-y-16 pb-20 text-left">
      {/* HERO SECTION WITH ABSTRACT MATRIX GRIDS */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-12 md:py-20 rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-b from-[#0F1026]/90 via-[#060813]/95 to-[#030409]/90 text-center px-6"
      >
        {/* Abstract design elements */}
        <div className="absolute top-0 left-12 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-12 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono font-bold text-brand-primary uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Empowering Careers
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display text-white">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">TalentUp</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-brand-muted font-sans leading-relaxed max-w-2xl mx-auto font-medium">
            Empowering careers through personalized coaching and expert guidance. We metrisize professional trajectories and pave paths to top-tier enterprise standings.
          </p>
          
          <div className="pt-4 flex items-center justify-center gap-6">
            <div className="text-center">
              <span className="text-3xl font-extrabold text-white font-mono">45+</span>
              <span className="text-[10px] text-brand-muted uppercase tracking-widest font-mono block mt-1">Combined Years Exp</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <span className="text-3xl font-extrabold text-white font-mono">100%</span>
              <span className="text-[10px] text-brand-muted uppercase tracking-widest font-mono block mt-1">Empowered Vision</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <span className="text-3xl font-extrabold text-white font-mono">1M+</span>
              <span className="text-[10px] text-brand-muted uppercase tracking-widest font-mono block mt-1">Impact Goal</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FOUNDER BOARD SHOWCASE */}
      <ScrollReveal direction="up" delay={0.1}>
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-primary uppercase">Executive Leadership</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">Our Foundations</h2>
            <p className="text-xs sm:text-sm text-brand-muted font-sans leading-normal">
              Meet the visionaries behind talentup.io who are democratizing elite tech-coaching paradigms.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {/* DR. FARRUKH SIDDIQUI CARD */}
            <motion.div 
              variants={itemVariants}
              className="group relative bg-[#0b1220]/60 hover:bg-[#0c162c]/85 border border-white/10 rounded-3xl hover:border-brand-primary/40 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden"
              id="founder-card"
            >
              <div>
                {/* PICTURE PLACED FIRST */}
                <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-[#070b14]/80 border-b border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-transparent z-10 opacity-60" />
                  <img 
                    src={founderImg} 
                    onError={handleFounderError}
                    alt="Dr. Farrukh Siddiqui - Founder of TalentUp" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    id="founder-picture"
                  />
                  
                  {/* Visual Category Badge */}
                  <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1 bg-brand-primary/90 border border-brand-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-extrabold text-white tracking-wider uppercase shadow-lg">
                    <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                    Founder
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {/* visual tech grid light overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none transition-all group-hover:scale-125" />
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight leading-none pt-1 font-display">
                      Dr. Farrukh Siddiqui
                    </h3>
                    <p className="text-xs text-brand-secondary font-mono font-bold uppercase tracking-wider">
                      Technologist & Entrepreneur
                    </p>
                  </div>

                  <div className="w-full h-px bg-white/5" />

                  <p className="text-xs sm:text-sm text-[#A5B4C7] leading-relaxed font-sans font-medium">
                    Dr. Farrukh Siddiqui is a technologist and an entrepreneur with 20+ years of experience. He has a passion for growing people to their fullest potential.
                  </p>

                  <div className="bg-[#050816]/70 border border-white/5 rounded-2xl p-4 text-[11px] leading-relaxed text-brand-muted relative">
                    <span className="text-brand-primary font-bold block mb-1 font-mono uppercase text-[9px] tracking-wider">Vision Milestone</span>
                    "talentup.io was built with a vision to metrisize the impact of personalized coaching in people's lives."
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8">
                <div className="flex justify-between items-center pt-6 border-t border-white/5 text-[11px] font-mono">
                  <span className="text-brand-muted flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" /> 20+ Years Track Record</span>
                  <div className="flex gap-2">
                    <a href="#linkedin" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-brand-muted hover:text-white transition-colors" title="LinkedIn Profile">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="mailto:founder@talentup.io" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-brand-muted hover:text-white transition-colors" title="Email directly">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* MR. KHAN CARD */}
            <motion.div 
              variants={itemVariants}
              className="group relative bg-[#0b1220]/60 hover:bg-[#0c162c]/85 border border-white/10 rounded-3xl hover:border-brand-secondary/40 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden"
              id="co-founder-card"
            >
              <div>
                {/* PICTURE PLACED FIRST */}
                <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-[#070b14]/80 border-b border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-transparent z-10 opacity-60" />
                  <img 
                    src={coFounderImg} 
                    onError={handleCoFounderError}
                    alt="Mr. Khan - Co-Founder of TalentUp" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    id="co-founder-picture"
                  />
                  
                  {/* Visual Category Badge */}
                  <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1 bg-brand-secondary/90 border border-brand-secondary/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-extrabold text-white tracking-wider uppercase shadow-lg">
                    <Users className="w-3 h-3 text-emerald-300 animate-pulse" />
                    Co-Founder
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {/* visual tech grid light overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full blur-[80px] pointer-events-none transition-all group-hover:scale-125" />
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight leading-none pt-1 font-display">
                      Mr. Khan
                    </h3>
                    <p className="text-xs text-brand-primary font-mono font-bold uppercase tracking-wider">
                      Project Management & Delivery Lead
                    </p>
                  </div>

                  <div className="w-full h-px bg-white/5" />

                  <p className="text-xs sm:text-sm text-[#A5B4C7] leading-relaxed font-sans font-medium">
                    Mr. Khan is a seasoned professional with over 25 years of experience in the field of Information Technology.
                  </p>

                  <div className="bg-[#050816]/70 border border-white/5 rounded-2xl p-4 text-[11px] leading-relaxed text-brand-muted relative">
                    <span className="text-brand-secondary font-bold block mb-1 font-mono uppercase text-[9px] tracking-wider">Expertise Focal Point</span>
                    "A strong background in project management, product development, and execution with a focus on delivering complex, largework IT ventures on time and within budget parameters."
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8">
                <div className="flex justify-between items-center pt-6 border-t border-white/5 text-[11px] font-mono">
                  <span className="text-brand-muted flex items-center gap-1"><Network className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} /> 25+ Years Enterprise IT</span>
                  <div className="flex gap-2">
                    <a href="#linkedin" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-brand-muted hover:text-white transition-colors" title="LinkedIn Profile">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="mailto:co-founder@talentup.io" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-brand-muted hover:text-white transition-colors" title="Email co-founder">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </ScrollReveal>

      {/* CORE MISSION METRICS */}
      <ScrollReveal direction="left" delay={0.15}>
        <section className="bg-gradient-to-r from-[#110D2C]/70 via-[#0B1220]/80 to-[#0A1728]/70 border border-white/10 p-8 rounded-3xl relative overflow-hidden backdrop-blur-xl max-w-5xl mx-auto">
          <div className="absolute top-0 right-0 w-44 h-44 bg-brand-primary/10 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 text-left space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[10px] font-mono font-bold text-brand-primary uppercase">
                <Target className="w-3 h-3 text-cyan-400" />
                Strategic Mandate
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Our Core Mission
              </h3>
              
              <p className="text-xs sm:text-sm text-[#A5B4C7] leading-relaxed font-sans font-medium">
                To democratize access to expert career coaching and help professionals achieve their dream jobs through personalized guidance and proven strategies. We strip away standard application barriers, optimizing every metric from original CV formatting to final interview scripts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-brand-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Tailored Executive Alignment
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Enterprise Placement Systems
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Rigorous Trajectory Auditing
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Transparent Coaching Milestones
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#050816]/70 border border-white/5 rounded-2xl p-6 text-center space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-brand-muted block">Coaching Confidence Index</span>
              <span className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono tracking-tighter block">98.4%</span>
              <span className="text-[10px] text-brand-muted font-sans font-medium block mt-1">Hired within target timeline spans</span>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* THREE PILLARS VISION GRID */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-secondary uppercase">The TalentUp Strategy</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">Our Clear Vision</h2>
            <p className="text-xs sm:text-sm text-brand-muted font-sans font-medium leading-normal">
              Bypassing repetitive HR cycles via structured coaching and clear measurable growth indices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {principles.map((p) => {
              return (
                <div 
                  key={p.step}
                  className="group relative bg-[#0b1220]/50 hover:bg-[#0d162d]/70 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between h-60 text-left overflow-hidden"
                >
                  {/* Background ambient bubble */}
                  <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-tr ${p.color} blur-2xl pointer-events-none transition-all group-hover:scale-150`} />
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-4xl font-extrabold font-mono font-display outline-text leading-none select-none ${p.accent}`}>
                        {p.step}
                      </span>
                      <span className="p-1 px-2.5 bg-white/5 border border-white/10 rounded-full text-[8.5px] font-mono uppercase text-brand-muted font-bold tracking-wider">
                        Vetted Pillar
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-white tracking-tight block">
                      {p.title}
                    </h4>
                    
                    <p className="text-xs text-brand-muted leading-relaxed font-sans font-medium mt-2">
                      {p.desc}
                    </p>
                  </div>

                  <div className="text-[9px] font-mono text-brand-muted tracking-wider uppercase pt-4 border-t border-white/5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    SLA Compliant Node
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* CLOSING CONVERSION VALUE */}
      <ScrollReveal scale={0.98} direction="none" delay={0.1}>
        <section className="text-center max-w-2xl mx-auto space-y-5 bg-[#0b1220]/35 border border-white/5 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 via-transparent to-brand-secondary/5 pointer-events-none" />
          <h3 className="text-xl font-bold text-white font-display">Ready to Elevate Your Trajectory?</h3>
          <p className="text-xs text-brand-muted leading-relaxed font-sans max-w-md mx-auto">
            Our specialized algorithms analyze keyword indicators across thousands of live partner repositories to bypass generic gatekeepers automatically.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button 
              type="button" 
              className="px-5 py-2.5 bg-brand-primary hover:bg-[#7c3aed] text-white text-xs font-bold font-sans uppercase rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              onClick={() => {
                const el = document.querySelector('nav');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Ecosystem
            </button>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
