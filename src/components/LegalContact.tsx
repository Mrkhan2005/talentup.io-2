import React, { useState } from 'react';
import { Mail, Shield, ChevronRight, HelpCircle, Check, MapPin, Send, AlertCircle, Sparkles } from 'lucide-react';

export default function LegalContact() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Contact States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitStatus, setContactSubmitStatus] = useState(false);

  // Legal drawers
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'cookie' | 'accessibility' | 'dataprot' | null>(null);

  const faqs = [
    {
      q: "How does the AI Resume Analyzer score my formatting and keywords?",
      a: "Our analyzer uses official Google Gemini-3.5-flash endpoints. It cross-references layout hierarchies against industry-standard ATS constraints, scoring structural formatting blocks. It then scans for core sector skills and suggests tactical phrasing optimizations."
    },
    {
      q: "How do I upgrade to high-thinking career coaching?",
      a: "The AI Career Coach utilizes the state-of-the-art 'gemini-3.1-pro-preview' model. Setting `thinkingLevel` to HIGH prompts deep-reasoning parameters to analyze executive level leadership and complex salary negotiation frameworks seamlessly."
    },
    {
      q: "Who handles candidate data protection?",
      a: "We adhere to rigorous EU GDPR metrics and local California Consumer Privacy standards. Candidate portfolios, resume strings, and CRM applications are stored securely in local, private instances for secure testing and sandbox reviews."
    },
    {
      q: "Can I post roles directly to the search engine?",
      a: "Yes! Any employer account can launch jobs in the catalog instantly. Newly queued contracts appear instantly under the Job list containing custom locations, stack lists, and salary indicators."
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitStatus(true);
    setTimeout(() => {
      setContactSubmitStatus(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 2500);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* FAQ SECTION */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-bold font-display text-white">Frequently Audited Inquiries</h3>
          <p className="text-xs text-brand-muted">Simple guides decoding our underlying ATS frameworks & Gemini coach mechanisms.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, idx) => {
            const open = activeFaq === idx;
            return (
              <div key={idx} className="bg-brand-card/70 border border-white/10 rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => setActiveFaq(open ? null : idx)}
                  className="w-full p-4 text-left flex justify-between items-center text-xs font-semibold text-white focus:outline-none"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-primary" />
                    {f.q}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-brand-muted transform transition-transform ${open ? 'rotate-90' : ''}`} />
                </button>
                {open && (
                  <div className="p-4 bg-brand-bg/50 border-t border-white/5 text-xs text-brand-muted leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-4">
        
        {/* CONTACT BOX */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div>
            <span className="text-[10px] text-brand-primary uppercase font-mono font-bold tracking-widest block">Communications</span>
            <h4 className="font-bold text-white text-md">Strategic Feedback Command</h4>
            <p className="text-xs text-brand-muted mt-1">Leave inquiries, suggestions or enter enterprise SLA requests directly.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-brand-muted mb-1">Professional Name</label>
              <input
                type="text"
                required
                className="w-full bg-brand-bg border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-brand-muted mb-1">Corporate Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-brand-bg border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-brand-muted mb-1">Inquiry Details</label>
              <textarea
                required
                className="w-full bg-brand-bg border border-white/10 rounded-lg px-3 py-2 h-24 text-white focus:outline-none focus:border-brand-primary resize-none"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-brand-primary text-white font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {contactSubmitStatus ? (
                <>
                  <Check className="w-4 h-4 text-white" /> Sent Successfully
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Submit Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* MAP & LEGAL CLERICAL PANEL */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* Map mockup */}
          <div className="bg-[#0B1220]/70 p-5 rounded-2xl border border-white/10 space-y-3">
            <span className="text-[10px] text-brand-primary uppercase font-mono block">Enterprise Headquartered Coordinates</span>
            <div className="h-32 bg-brand-bg/60 border border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* Retro digital dot map coordinates visual */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-40"></div>
              <div className="absolute w-2 h-2 rounded-full bg-brand-primary animate-ping"></div>
              <div className="absolute w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
              <span className="text-[9px] font-mono text-brand-muted mt-20 relative z-10">
                HQ: 100 Infinite Corridor, Suite 600, SF, CA
              </span>
            </div>
          </div>

          {/* Legal Pages Button grids */}
          <div className="bg-brand-card p-5 rounded-2xl border border-white/5 space-y-3">
            <span className="text-[10px] text-[#A5B4C7] uppercase font-mono font-bold block">Compliance Protocols</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => setActivePolicy('privacy')} className="text-left p-2.5 bg-brand-bg hover:bg-brand-elevated border border-white/5 rounded-lg text-brand-muted hover:text-white transition-all">
                🛡️ Privacy Policy
              </button>
              <button onClick={() => setActivePolicy('terms')} className="text-left p-2.5 bg-brand-bg hover:bg-brand-elevated border border-white/5 rounded-lg text-brand-muted hover:text-white transition-all">
                📝 Terms of Service
              </button>
              <button onClick={() => setActivePolicy('cookie')} className="text-left p-2.5 bg-brand-bg hover:bg-brand-elevated border border-white/5 rounded-lg text-brand-muted hover:text-white transition-all">
                🍪 Cookie Directives
              </button>
              <button onClick={() => setActivePolicy('accessibility')} className="text-left p-2.5 bg-brand-bg hover:bg-brand-elevated border border-white/5 rounded-lg text-brand-muted hover:text-white transition-all">
                👁️ Accessibility Policy
              </button>
              <button onClick={() => setActivePolicy('dataprot')} className="col-span-2 text-center p-2.5 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/20 text-brand-primary rounded-lg transition-all font-semibold">
                🛡️ GDPR Data Protection Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POLICY SLIDE DRAWER DIALOG PANEL */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 bg-[#050816]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 max-w-2xl w-full text-white h-[450px] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-widest font-mono">
                TALENTUP LEGAL FRAMEWORK DETAILED PROTOCOL
              </span>
              <button 
                onClick={() => setActivePolicy(null)} 
                className="text-xs uppercase bg-white/15 px-2.5 py-1 rounded hover:bg-white/20"
              >
                Close Legal View [X]
              </button>
            </div>

            {activePolicy === 'privacy' && (
              <div className="space-y-3 text-xs text-brand-muted leading-relaxed">
                <h4 className="font-bold text-white text-md">Privacy Policy</h4>
                <p>TalentUp takes user privacy seriously. All parsed resume text parameters inputs, metrics, evaluations, and simulated search activities are protected using active end-to-end sandbox storage. We never sell, coordinate or lease confidential parameters inputs to marketing agencies, keeping recruitment workflows fully offline-resilient.</p>
                <p>Additionally, Gemini-3.5 strategic endpoints calls are processed server-side under official cloud protocols, meaning third-party analytics scripts never capture individual keystrokes or layout structures directly on the client browser.</p>
              </div>
            )}

            {activePolicy === 'terms' && (
              <div className="space-y-3 text-xs text-brand-muted leading-relaxed">
                <h4 className="font-bold text-white text-md">Terms of Service</h4>
                <p>Welcome to TalentUp. By accessing any component of the platform (re-routing candidates, managing jobs, uploading sample portfolios, executing coach messages), you agree to comply with our modern simulated playground use guidelines.</p>
                <p>This software is optimized for evaluation. It replicates modern enterprise setups to demonstrate how a $50M recruitment portal scales and functions. System logs, user profiles, and applied trackers are persistently stored in Local Storage to save workspace latency.</p>
              </div>
            )}

            {activePolicy === 'cookie' && (
              <div className="space-y-3 text-xs text-brand-muted leading-relaxed">
                <h4 className="font-bold text-white text-md">Cookie Directives</h4>
                <p>TalentUp utilizes standard client-side storage technologies. We do not place active invasive third-party analytics cookies. Our system cookies are limited to secure session state management (for holding demo seeker identities or employer CRM states) guaranteeing rapid response cycles and persistent workspace testing logs.</p>
              </div>
            )}

            {activePolicy === 'accessibility' && (
              <div className="space-y-3 text-xs text-brand-muted leading-relaxed">
                <h4 className="font-bold text-white text-md">Accessibility Policy</h4>
                <p>TalentUp prioritizes readable, high-contrast layouts. In line with global WCAG 2.1 AAA protocols, our Aurora Future and Sophisticated Dark styles maintain excellent color contrast parameters (minimum 4.5:1 ratio), legible responsive grids, semantic element identifiers, and visual indicators to allow perfect screen reader integration.</p>
              </div>
            )}

            {activePolicy === 'dataprot' && (
              <div className="space-y-3 text-xs text-brand-muted leading-relaxed">
                <h4 className="font-bold text-white text-md">Data Protection (GDPR)</h4>
                <p>Under European General Data Protection and California CCPA protocols, users maintain the right to erase, inspect, or retrieve any information loaded inside this sandbox ecosystem. Click the reset buttons inside the analyzer, use our log-out protocols, or empty browser cache to instantly wipe any localized data stores flawlessly.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
