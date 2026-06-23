import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import api from '../services/api';
import { Mic, ArrowRight, CheckCircle2, ChevronRight, RefreshCw, Award, Timer, ClipboardList } from 'lucide-react';

const Interviews = () => {
  const { user } = useAuth();
  
  // State variables
  const [session, setSession] = useState(null); // Active session data
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null); // Current answer grade
  const [interviewSummary, setInterviewSummary] = useState(null); // Finished summary
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Setup form states
  const [role, setRole] = useState('Data Science');
  const [numQuestions, setNumQuestions] = useState(5);
  const [useAI, setUseAI] = useState(true);

  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const res = await api.get(`/interview/history/${user.id}`);
      if (res.data.success) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.error('Error fetching interview history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleStart = async () => {
    if (!user) return;
    setLoading(true);
    setInterviewSummary(null);
    setEvaluation(null);
    setTypedAnswer('');
    try {
      const res = await api.post('/interview/start', {
        user_id: user.id,
        role: role,
        skills: ['python', 'sql', 'git'], // fallback/mock context
        num_questions: numQuestions,
        use_ai: useAI
      });
      if (res.data.success) {
        setSession(res.data.session);
        setCurrentQuestionIdx(0);
      }
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Error starting interview session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !typedAnswer.trim()) {
      alert('Please provide an answer first.');
      return;
    }
    setLoading(true);
    setEvaluation(null);
    try {
      const currentQuestion = session.questions[currentQuestionIdx];
      const res = await api.post('/interview/submit', {
        session_id: session.session_id,
        question: currentQuestion,
        answer: typedAnswer
      });
      if (res.data.success) {
        setEvaluation(res.data.feedback);
      }
    } catch (err) {
      console.error('Error grading answer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setEvaluation(null);
    setTypedAnswer('');
    setCurrentQuestionIdx(prev => prev + 1);
  };

  const handleFinish = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await api.post('/interview/finish', {
        session_id: session.session_id
      });
      if (res.data.success) {
        setInterviewSummary(res.data.summary);
        setSession(null);
        fetchHistory();
      }
    } catch (err) {
      console.error('Error finishing session:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Mock Interviews</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          Simulate standard screening tests and check real-time evaluations instantly.
        </p>
      </div>

      {/* No active session & not viewing final summary */}
      {!session && !interviewSummary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Setup Configurator */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm space-y-6 lg:col-span-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              <span>Configure Session</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interview Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none font-semibold text-slate-700 focus:border-primary/50 transition-all cursor-pointer"
                >
                  <option value="Data Science">Data Science / ML</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="Web Designing">Web Designing / Frontend</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Database">Database Administrator</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number of Questions ({numQuestions})</label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <input
                  type="checkbox"
                  id="useAI"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                />
                <label htmlFor="useAI" className="text-xs text-slate-600 font-bold cursor-pointer">
                  Use AI generated questions
                </label>
              </div>

              <button
                onClick={handleStart}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all text-sm flex justify-center items-center gap-2 mt-4"
              >
                {loading ? 'Preparing...' : '🚀 Start Interview'}
              </button>
            </div>
          </div>

          {/* Past Sessions History list */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-card shadow-sm lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span>Past Attempts</span>
            </h3>

            {loadingHistory ? (
              <div className="py-12 flex justify-center">
                <span className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></span>
              </div>
            ) : history && history.length > 0 ? (
              <div className="divide-y divide-slate-100 overflow-hidden">
                {history.map((row, idx) => {
                  const dateStr = row.created_at
                    ? new Date(row.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—';
                  return (
                    <div key={idx} className="flex justify-between items-center py-4 text-sm text-slate-600">
                      <div>
                        <h4 className="font-bold text-slate-800 capitalize">{row.target_role || 'General'} Mock Session</h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Attempted on: {dateStr}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-primary">{row.interview_score}/10 score</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-semibold py-8 text-center">No past attempts found. Configure and start one today!</p>
            )}
          </div>
        </div>
      )}

      {/* Active Session Console */}
      {session && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-bold text-slate-600">
                Question {currentQuestionIdx + 1} of {session.total_questions}
              </span>
            </div>
            <div className="w-40 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / session.total_questions) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Question:</span>
            <h2 className="text-lg font-bold text-slate-800">
              {session.questions[currentQuestionIdx] || 'Explain your experience working with REST APIs.'}
            </h2>
          </div>

          {/* Evaluation feedback area (if graded) */}
          {evaluation && (
            <div className="bg-slate-50 border border-slate-200 rounded-card p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <h4 className="text-sm font-bold text-slate-800">Grade Evaluation</h4>
                <span className="text-base font-extrabold text-primary bg-primary-light px-3 py-1 rounded-xl">
                  {evaluation.score}/10
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600 leading-relaxed">
                <div>
                  <h5 className="font-bold text-emerald-600 mb-1">👍 Strength</h5>
                  <p>{evaluation.strengths}</p>
                </div>
                <div>
                  <h5 className="font-bold text-rose-600 mb-1">⚠️ Area to Improve</h5>
                  <p>{evaluation.weaknesses}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 text-xs font-medium text-slate-600 leading-relaxed space-y-2">
                <h5 className="font-bold text-slate-700">💡 Suggested Answer model</h5>
                <p className="p-3.5 bg-white border border-slate-100 rounded-xl italic">"{evaluation.improved_answer}"</p>
              </div>

              {evaluation.tip && (
                <div className="bg-primary/5 p-3.5 rounded-xl border border-primary/10 text-xs font-semibold text-primary">
                  💡 Tip: {evaluation.tip}
                </div>
              )}
            </div>
          )}

          {/* Input field panel */}
          {!evaluation && (
            <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm space-y-4">
              <textarea
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="Write your answer clearly here. Try to cover definition, mechanisms, and examples..."
                className="w-full h-44 border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-all custom-scrollbar resize-none"
              ></textarea>
              <button
                onClick={handleSubmitAnswer}
                disabled={loading || !typedAnswer.trim()}
                className="w-full bg-primary hover:bg-primary-hover disabled:bg-slate-100 disabled:text-slate-400 font-bold py-3.5 rounded-2xl shadow-lg hover:shadow transition-all text-sm flex justify-center items-center gap-2"
              >
                {loading ? 'Evaluating...' : 'Submit Answer ➡️'}
              </button>
            </div>
          )}

          {/* Action Footer Navigation buttons */}
          {evaluation && (
            <div className="flex justify-end">
              {currentQuestionIdx + 1 < session.total_questions ? (
                <button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-2xl shadow-md shadow-primary/20 hover:shadow-primary/35 transition-all text-sm flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-2xl shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all text-sm flex items-center gap-1.5"
                >
                  {loading ? 'Finishing...' : 'Finish Interview 🏁'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Finished Summary Scorecard */}
      {interviewSummary && (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-card p-8 shadow-sm space-y-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full border border-emerald-100">
              <Award className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">🏁 Interview Complete!</h2>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 mt-2">
              <span className="text-xs font-bold text-slate-400 uppercase block">Overall Score</span>
              <span className="text-3xl font-extrabold text-primary">{interviewSummary.overall_score}/10</span>
            </div>
          </div>

          <div className="border-t border-b border-slate-100 py-6 text-left text-xs font-medium text-slate-600 space-y-4 leading-relaxed">
            <div>
              <h4 className="font-bold text-slate-700">📋 Overall Feedback:</h4>
              <p className="text-slate-500 mt-1">{interviewSummary.overall_feedback}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-emerald-600">👍 Top Strength:</h4>
                <p className="text-slate-500 mt-1">{interviewSummary.top_strength}</p>
              </div>
              <div>
                <h4 className="font-bold text-rose-600">⚠️ Top Weakness:</h4>
                <p className="text-slate-500 mt-1">{interviewSummary.top_weakness}</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-700">🎯 Recommendation:</h4>
              <p className="text-slate-500 mt-1">{interviewSummary.recommendation}</p>
            </div>
          </div>

          <button
            onClick={() => setInterviewSummary(null)}
            className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-primary/20 transition-all text-sm"
          >
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
};

export default Interviews;
