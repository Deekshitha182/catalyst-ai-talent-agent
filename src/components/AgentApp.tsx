import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Search, MessageSquare, Award, ArrowRight, Loader } from 'lucide-react';
import { matchCandidatesToJD, simulateEngagement, MatchResult, EngagementResult } from '../services/ai';
import { mockCandidates, Candidate } from '../data/candidates';

type Phase = 'INPUT' | 'DISCOVERING' | 'MATCHES' | 'ENGAGING' | 'DASHBOARD';

export default function AgentApp() {
  const [phase, setPhase] = useState<Phase>('INPUT');
  const [jdText, setJdText] = useState('');
  
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [engagementResults, setEngagementResults] = useState<Record<string, EngagementResult>>({});
  const [isEngagingId, setIsEngagingId] = useState<string | null>(null);

  const startDiscovery = async () => {
    if (!jdText.trim()) return;
    setPhase('DISCOVERING');
    const results = await matchCandidatesToJD(jdText);
    // Sort by match score
    results.sort((a, b) => b.matchScore - a.matchScore);
    setMatchResults(results);
    setPhase('MATCHES');
  };

  const engageCandidate = async (candidateId: string) => {
    const candidate = mockCandidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    setIsEngagingId(candidateId);
    // Simple summary from JD for prompt
    const jdSummary = jdText.length > 200 ? jdText.substring(0, 200) + '...' : jdText;
    const result = await simulateEngagement(candidate, jdSummary);
    
    setEngagementResults(prev => ({ ...prev, [candidateId]: result }));
    setIsEngagingId(null);
  };

  const engageAllTop = async () => {
    setPhase('ENGAGING');
    const topCandidates = matchResults.filter(m => m.matchScore > 60).map(m => m.candidateId);
    
    for (const cid of topCandidates) {
      if (!engagementResults[cid]) {
        await engageCandidate(cid);
      }
    }
    setPhase('DASHBOARD');
  };

  // Components for each phase
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">Catalyst <span className="text-indigo-600">Agent</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Talent Scouting Pipeline</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'INPUT', icon: Briefcase },
              { id: 'MATCHES', icon: Search },
              { id: 'DASHBOARD', icon: Award }
            ].map(step => {
              const active = phase === step.id || (phase === 'DISCOVERING' && step.id === 'INPUT') || (phase === 'ENGAGING' && step.id === 'MATCHES');
              return (
                <div key={step.id} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${active ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                  <step.icon size={16} />
                </div>
              )
            })}
          </div>
        </header>

        <main className="relative">
          <AnimatePresence mode="wait">
            
            {phase === 'INPUT' && (
              <motion.div key="INPUT" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold tracking-tight mb-6 text-slate-800">Initialize Search</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Job Description (JD)</label>
                    <button 
                      onClick={() => setJdText("We are looking for a highly skilled Senior Full Stack Engineer with at least 5 years of experience. You should be an expert in React, TypeScript, and Node.js. Experience with AWS and distributed systems is a big plus. We need someone who can lead projects end-to-end and mentor junior developers. Remote work is supported, but you must be willing to occasionally travel to our SF office.")}
                      className="text-[10px] text-indigo-600 hover:underline uppercase font-bold tracking-wider"
                    >
                      Load Example
                    </button>
                  </div>
                  <textarea 
                    className="w-full h-64 p-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none text-sm text-slate-700 leading-relaxed"
                    placeholder="Paste the job description here..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                  />
                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={startDiscovery}
                      disabled={!jdText.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest">Discover Candidates</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'DISCOVERING' && (
              <motion.div key="DISCOVERING" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
                <Loader className="animate-spin text-indigo-600 mb-6" size={48} />
                <h2 className="text-2xl font-bold tracking-tight mb-2 text-slate-800">Analyzing Job Description</h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">Our AI is parsing your requirements and finding the best matches from the talent pool.</p>
              </motion.div>
            )}

            {phase === 'MATCHES' && (
              <motion.div key="MATCHES" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">Discovered Talent</h2>
                    <p className="text-slate-500 text-sm mt-1">We found {matchResults.length} potential candidates. Top matches are prioritized.</p>
                  </div>
                  <button 
                    onClick={engageAllTop}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageSquare size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Engage Top Candidates</span>
                  </button>
                </div>

                <div className="grid gap-4">
                  {matchResults.map((match, idx) => {
                    const candidate = mockCandidates.find(c => c.id === match.candidateId)!;
                    const isEngaging = isEngagingId === candidate.id;
                    const engagement = engagementResults[candidate.id];

                    return (
                      <div key={candidate.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 hover:border-indigo-200 transition-colors">
                        <div className="flex-shrink-0 w-16 text-center pt-1">
                          <div className="text-2xl font-bold text-slate-700">{match.matchScore}</div>
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Match</div>
                          <div className="w-full h-1 bg-slate-100 rounded-full mt-2">
                             <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${match.matchScore}%` }}></div>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-base font-bold text-slate-800">{candidate.name}</h3>
                              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{candidate.role} <span className="font-normal mx-1">·</span> {candidate.currentCompany}</p>
                            </div>
                            <div className="flex gap-1.5 flex-wrap justify-end">
                              {candidate.skills.slice(0,3).map(s => (
                                <span key={s} className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-600 rounded">{s}</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs mt-3 text-slate-600 italic">
                            "{match.rationale}"
                          </p>
                          
                          {engagement ? (
                             <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                               <div className="flex items-center gap-3 mb-3">
                                 <div className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                                   Interest: {engagement.interestScore}%
                                 </div>
                                 <span className="text-xs text-slate-600 italic">"{engagement.interestRationale}"</span>
                               </div>
                               <div className="space-y-2 mt-3 text-[11px] font-mono bg-white p-3 border border-slate-100 rounded-lg max-h-32 overflow-y-auto">
                                 {engagement.simulatedChatLog.map((chat, i) => (
                                   <div key={i} className="leading-snug">
                                     <span className="font-bold text-indigo-600 uppercase tracking-wider text-[10px]">{chat.speaker}:</span> <span className="text-slate-700">{chat.message}</span>
                                   </div>
                                 ))}
                               </div>
                             </div>
                          ) : (
                            <div className="mt-4 border-t border-slate-100 pt-3">
                              <button 
                                onClick={() => engageCandidate(candidate.id)}
                                disabled={isEngaging}
                                className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50"
                              >
                                {isEngaging ? <Loader size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                                {isEngaging ? 'Simulating Outreach...' : 'Engage 1:1'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => setPhase('DASHBOARD')}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest shadow-sm transition-colors"
                  >
                    Proceed to Combined Dashboard
                  </button>
                </div>
              </motion.div>
            )}

            {phase === 'ENGAGING' && (
              <motion.div key="ENGAGING" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
                <Loader className="animate-spin text-indigo-600 mb-6" size={48} />
                <h2 className="text-2xl font-bold tracking-tight mb-2 text-slate-800">Engaging Candidates</h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">Simulating personalized outreach and evaluating genuine interest based on candidate profiles...</p>
              </motion.div>
            )}

            {phase === 'DASHBOARD' && (
              <motion.div key="DASHBOARD" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">Final Shortlist</h2>
                    <p className="text-slate-500 text-sm mt-1">Candidates ranked by combined Match and Interest scores.</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scores</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Assessment</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Composite</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {matchResults
                        .map(m => {
                          const e = engagementResults[m.candidateId];
                          const totalScore = e ? (m.matchScore * 0.5) + (e.interestScore * 0.5) : m.matchScore * 0.5;
                          return { match: m, engagement: e, totalScore };
                        })
                        .sort((a,b) => b.totalScore - a.totalScore)
                        .map((item, idx) => {
                          const candidate = mockCandidates.find(c => c.id === item.match.candidateId)!;
                          const initials = candidate.name.split(' ').map(n=>n[0]).join('').substring(0,2);
                          
                          return (
                            <tr key={candidate.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">{initials}</div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-800">{candidate.name}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{candidate.role} · {candidate.currentCompany}</p>
                                  </div>
                                </div>
                              </td>
                              
                              <td className="px-6 py-4">
                                <div className="space-y-2 max-w-[120px]">
                                  <div className="flex items-center gap-2 text-[10px] font-bold">
                                    <span className="text-slate-400 w-12 text-right">Match:</span>
                                    <span className="text-slate-700 w-6">{item.match.matchScore}%</span>
                                    <div className="flex-1 w-12 h-1 bg-slate-100 rounded-full">
                                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.match.matchScore}%` }}></div>
                                    </div>
                                  </div>
                                  {item.engagement && (
                                    <div className="flex items-center gap-2 text-[10px] font-bold">
                                      <span className="text-slate-400 w-12 text-right">Interest:</span>
                                      <span className="text-emerald-600 w-6">{item.engagement.interestScore}%</span>
                                      <div className="flex-1 w-12 h-1 bg-slate-100 rounded-full">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.engagement.interestScore}%` }}></div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                              
                              <td className="px-6 py-4">
                                <p className="text-xs text-slate-600 italic line-clamp-2 max-w-xs block">
                                  "{item.engagement?.interestRationale || item.match.rationale}"
                                </p>
                              </td>
                              
                              <td className="px-6 py-4 text-right">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs ring-2 ring-slate-100">
                                  {Math.round(item.totalScore)}
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 flex justify-center">
                  <button 
                      onClick={() => { setPhase('INPUT'); setMatchResults([]); setEngagementResults({}); setJdText(''); }}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest shadow-sm transition-colors"
                    >
                      Start New Search
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
