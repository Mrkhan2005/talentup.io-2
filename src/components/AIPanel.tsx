import React, { useState } from 'react';
import { Sparkles, Upload, FileText, CheckCircle, Brain, Bot, Send, ArrowRight, Star, AlertCircle, RefreshCw, HelpCircle, Check, ArrowUpRight } from 'lucide-react';
import { ResumeAnalysisResult, ChatMessage } from '../types';
import { defaultResumeTemplate } from '../data';

interface AIPanelProps {
  onNotify: (title: string, msg: string, type: 'match' | 'viewer' | 'invite' | 'resume') => void;
}

export default function AIPanel({ onNotify }: AIPanelProps) {
  // Resume Analyzer States
  const [resumeText, setResumeText] = useState(defaultResumeTemplate);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  
  // Chat Coach State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'coach',
      text: "Welcome to TalentUp Strategic Consulting. I am your executive career co-pilot, tuned with Google Gemini AI. Ask me about resume strategies, salary targets, leadership matrices, or mock interview structures.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Resume Analyzer Trigger
  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
      });
      const data = await response.json();
      setAnalysisResult(data);
      onNotify(
        "Resume Analysis Complete",
        `Score parsed successfully: ${data.overallScore}/100. Key optimization priorities generated.`,
        'resume'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Career Coach Send Trigger
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/career-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6) // Send recent conversational window for continuity
        })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        sender: 'coach',
        text: data.reply,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* HEADER SPECS */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-xs font-semibold text-brand-primary">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          GEMINI CO-PILOT PROTOCOLS ENABLED
        </div>
        <h2 className="text-4xl font-bold tracking-tight font-display">
          AI Career Operations
        </h2>
        <p className="text-brand-muted text-sm">
          Optimize your candidate viability profile with professional-grade analysis modules & targeted guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RESUME ANALYZER WORKSPACE */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden" id="resume_analyzer_panel">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-md">Resume Analyzer Demo</h3>
                  <p className="text-xs text-brand-muted">Paste your CV draft below to test real-time scoring rules</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setResumeText(defaultResumeTemplate);
                  setAnalysisResult(null);
                }} 
                className="text-xs text-brand-muted hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10"
              >
                <RefreshCw className="w-3 h-3" /> Reset Template
              </button>
            </div>

            <textarea
              className="w-full h-80 bg-brand-bg/50 text-white font-mono text-xs p-4 rounded-xl border border-white/15 focus:outline-none focus:border-brand-primary placeholder-brand-muted/45 focus:ring-1 focus:ring-brand-primary resize-none"
              placeholder="Paste plain text code, LinkedIn profile, or standard resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />

            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-brand-muted">
                {resumeText.trim().length} characters parsed
              </span>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resumeText.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing Deep Analysis...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {/* DYNAMIC ANALYSIS RESULT DISPLAY */}
          {analysisResult && (
            <div className="glass-panel rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="p-4 bg-brand-success/15 border border-brand-success/20 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-brand-success shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Analysis Sync Success</h4>
                  <p className="text-xs text-brand-muted">Target ATS constraints successfully audited. Overall rating computed.</p>
                </div>
              </div>

              {/* SCORES CORE GRIDS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <div className="bg-brand-elevated/40 p-4 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-brand-muted uppercase block mb-1">Overall Score</span>
                  <span className="text-2xl font-bold text-white font-mono">{analysisResult.overallScore}</span>
                </div>
                <div className="bg-brand-elevated/40 p-4 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-brand-muted uppercase block mb-1">ATS Match</span>
                  <span className="text-2xl font-bold text-brand-primary font-mono">{analysisResult.atsScore}%</span>
                </div>
                <div className="bg-brand-elevated/40 p-4 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-brand-muted uppercase block mb-1">Keyword Score</span>
                  <span className="text-2xl font-bold text-brand-secondary font-mono">{analysisResult.keywordMatchScore}%</span>
                </div>
                <div className="bg-brand-elevated/40 p-4 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-brand-muted uppercase block mb-1">Readability</span>
                  <span className="text-2xl font-bold text-brand-success font-mono">{analysisResult.readabilityScore}%</span>
                </div>
                <div className="bg-brand-elevated/40 p-4 rounded-xl border border-white/5 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-brand-muted uppercase block mb-1">Formatting</span>
                  <span className="text-2xl font-bold text-brand-warning font-mono">{analysisResult.formattingScore}%</span>
                </div>
              </div>

              {/* STRENGTHS AND REMEDIES */}
              <div>
                <dt className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">AI Summary</dt>
                <dd className="text-xs text-white leading-relaxed italic bg-white/5 p-3 rounded-lg border border-white/10">
                  "{analysisResult.feedback}"
                </dd>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <h4 className="text-xs font-semibold text-brand-success uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Strengths Detected
                  </h4>
                  <ul className="space-y-1.5">
                    {analysisResult.strengths.map((s, idx) => (
                      <li key={idx} className="text-xs text-brand-muted flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 bg-brand-success rounded-full mt-1.5 shrink-0"></span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-brand-warning uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Key Vulnerabilities & Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {analysisResult.missingSkills.map((v, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 bg-brand-warning/15 text-brand-warning rounded border border-brand-warning/25">
                        {v}
                      </span>
                    ))}
                  </div>
                  <ul className="space-y-1.5">
                    {analysisResult.recommendations.map((r, idx) => (
                      <li key={idx} className="text-xs text-brand-muted flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 bg-brand-warning rounded-full mt-1.5 shrink-0"></span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* RECOMMENDATION ENGINE INCENTIVE */}
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-xs font-semibold text-[#A5B4C7] uppercase mb-3">Matching Program Optimization Recommendations</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-brand-bg border border-white/10 rounded-xl hover:border-brand-primary/40 transition-all flex justify-between items-center group">
                    <div>
                      <span className="text-[10px] text-brand-primary uppercase font-bold tracking-widest block">Action Recommend 1</span>
                      <span className="text-xs text-white font-medium">ATS Formatting Alignment V2</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-muted group-hover:text-brand-primary transition-colors" />
                  </div>
                  <div className="p-3 bg-brand-bg border border-white/10 rounded-xl hover:border-brand-primary/40 transition-all flex justify-between items-center group" onClick={() => handleSendMessage("Suggest exact phrasing to optimize executive leadership achievements.")}>
                    <div>
                      <span className="text-[10px] text-brand-secondary uppercase font-bold tracking-widest block">Action Recommend 2</span>
                      <span className="text-xs text-white font-medium">Discuss with Career Coach</span>
                    </div>
                    <Bot className="w-4 h-4 text-brand-muted group-hover:text-brand-secondary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI CAREER COACH ASSISTANT */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col">
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[600px] relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Coach Protocols
                    <span className="inline-block w-2 h-2 rounded-full bg-brand-success animate-pulse"></span>
                  </h3>
                  <p className="text-[10px] text-brand-primary font-mono select-all">Gemini-3.1-pro thinking</p>
                </div>
              </div>
              <span className="text-[10px] text-brand-muted tracking-widest uppercase font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded">High Fidelity</span>
            </div>

            {/* Messages Pane */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed border ${
                    m.sender === 'user' 
                      ? 'bg-brand-primary text-white border-brand-primary' 
                      : 'bg-brand-elevated/90 text-brand-muted border-white/10 text-white'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-brand-elevated/90 rounded-2xl p-4 border border-white/10 max-w-[85%] flex items-center gap-2 text-brand-muted">
                    <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-brand-success rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-brand-primary/80 ml-1">Analyzing complex queries deep logic...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Helper Prompts */}
            <div className="p-3 border-t border-white/10 bg-brand-bg/80 space-y-2">
              <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest block">Strategic Helper Prompts</span>
              <div className="flex flex-wrap gap-1.5">
                <button 
                  onClick={() => handleSendMessage("How do I structure a Star methodology answer for senior role interviews?")}
                  className="text-[10px] bg-white/5 text-brand-muted hover:text-white border border-white/10 rounded px-2 py-1 text-left"
                >
                  🚀 Star Interview
                </button>
                <button 
                  onClick={() => handleSendMessage("Suggest exact phrasing steps for salary negotiation targets without triggering initial pushbacks.")}
                  className="text-[10px] bg-white/5 text-brand-muted hover:text-white border border-white/10 rounded px-2 py-1 text-left"
                >
                  💵 Negotiation
                </button>
                <button 
                  onClick={() => handleSendMessage("Critique typical technology leadership formatting weaknesses in standard resumes.")}
                  className="text-[10px] bg-white/5 text-brand-muted hover:text-white border border-white/10 rounded px-2 py-1 text-left"
                >
                  📝 Formatting Errors
                </button>
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-white/10 bg-black/40 flex gap-2">
              <input
                type="text"
                className="flex-1 bg-brand-bg border border-white/10 text-xs px-3.5 py-2.5 rounded-xl text-white focus:outline-none focus:border-brand-primary"
                placeholder="Ask about negotiation metrics or portfolio strategies..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isThinking}
                className="p-2.5 bg-brand-primary text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
