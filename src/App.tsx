import { useState, useEffect, useMemo } from 'react';
import rawQuestions from './questions.json';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  BookOpen,
  Check,
  ChevronRight,
  ChevronLeft,
  Zap,
  BarChart3,
  ListFilter
} from 'lucide-react';

export interface Question {
  id: number;
  source: string;
  section: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctKey: 'a' | 'b' | 'c' | 'd';
  correctAnswer: string;
}

const questionsData: Question[] = rawQuestions as Question[];

export default function App() {
  // Navigation & Game State
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  
  // Timer state
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Categories extraction
  const categories = useMemo(() => {
    const list = Array.from(new Set(questionsData.map((q) => q.section)));
    return ['All', ...list];
  }, []);

  // Filtered questions based on selected category
  const filteredQuestions = useMemo(() => {
    if (activeCategory === 'All') return questionsData;
    return questionsData.filter((q) => q.section === activeCategory);
  }, [activeCategory]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !quizFinished) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, quizFinished]);

  // Sync selectedOption when moving between questions
  useEffect(() => {
    if (currentQ) {
      const saved = userAnswers[currentQ.id];
      setSelectedOption(saved || null);
      setIsSubmitted(!!saved);
    }
  }, [currentIndex, currentQ, userAnswers]);

  // Calculate score stats
  const scoreStats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let answered = 0;

    filteredQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans) {
        answered++;
        if (ans.toLowerCase() === q.correctKey.toLowerCase()) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const percentage = filteredQuestions.length > 0 ? Math.round((correct / filteredQuestions.length) * 100) : 0;
    return { correct, wrong, answered, total: filteredQuestions.length, percentage };
  }, [filteredQuestions, userAnswers]);

  // Trigger confetti upon high score or completion
  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSelectOption = (key: string) => {
    if (isSubmitted) return; // Prevent changing after submission if locked
    setSelectedOption(key);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || !currentQ) return;
    
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: selectedOption
    }));
    setIsSubmitted(true);

    if (selectedOption.toLowerCase() === currentQ.correctKey.toLowerCase()) {
      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.8 }
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      setIsTimerRunning(false);
      triggerCelebration();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizFinished(false);
    setSeconds(0);
    setIsTimerRunning(true);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Class 8 Science Quiz
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  100 Questions
                </span>
              </h1>
              <p className="text-xs text-slate-400">Solids, Liquids & Gases • Footprints & ICSE/CBSE</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 text-sm font-mono">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{formatTime(seconds)}</span>
            </div>

            {/* Score Pill */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-sm">
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{scoreStats.correct}</span>
              </div>
              <div className="flex items-center gap-1 text-rose-400 font-semibold">
                <XCircle className="w-4 h-4" />
                <span>{scoreStats.wrong}</span>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleRestart}
              title="Restart Quiz"
              className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Topic Filter & Progress Indicator */}
        <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-4">
          {/* Quick Stats Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Progress & Score
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Questions Completed</span>
                  <span className="font-semibold text-indigo-400">{scoreStats.answered} / {scoreStats.total}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 transition-all duration-300"
                    style={{ width: `${(scoreStats.answered / scoreStats.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-center">
                <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-2">
                  <span className="block text-xl font-bold text-emerald-400">{scoreStats.correct}</span>
                  <span className="text-[11px] text-emerald-500/80">Correct</span>
                </div>
                <div className="bg-rose-950/40 border border-rose-800/40 rounded-xl p-2">
                  <span className="block text-xl font-bold text-rose-400">{scoreStats.wrong}</span>
                  <span className="text-[11px] text-rose-500/80">Incorrect</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Selector */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm flex-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ListFilter className="w-4 h-4 text-purple-400" /> Topic Filter
            </h3>
            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const count = cat === 'All' 
                  ? questionsData.length 
                  : questionsData.filter((q) => q.section === cat).length;
                const isSelected = activeCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setCurrentIndex(0);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="truncate pr-2">{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Side: Interactive Quiz Card */}
        <section className="flex-1 flex flex-col">
          {!quizFinished ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm flex-1 flex flex-col justify-between">
              <div>
                {/* Question Header & Meta Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                      Question {currentIndex + 1} of {filteredQuestions.length}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">
                      {currentQ?.source}
                    </span>
                  </div>

                  <span className="text-xs text-purple-400 font-medium">
                    {currentQ?.section}
                  </span>
                </div>

                {/* Question Prompt */}
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-relaxed">
                  {currentQ?.question}
                </h2>

                {/* MCQ Options with Interactive Tick */}
                <div className="space-y-3 mb-6">
                  {currentQ &&
                    Object.entries(currentQ.options).map(([key, optText]) => {
                      if (!optText) return null;
                      const isSelected = selectedOption === key;
                      const isCorrect = key.toLowerCase() === currentQ.correctKey.toLowerCase();
                      
                      let optionClasses = 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50';

                      if (isSubmitted) {
                        if (isCorrect) {
                          optionClasses = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200 shadow-md shadow-emerald-900/20';
                        } else if (isSelected && !isCorrect) {
                          optionClasses = 'border-rose-500/60 bg-rose-950/40 text-rose-200 shadow-md shadow-rose-900/20';
                        }
                      } else if (isSelected) {
                        optionClasses = 'border-indigo-500 bg-indigo-950/40 text-indigo-200 shadow-md shadow-indigo-900/20';
                      }

                      return (
                        <button
                          key={key}
                          onClick={() => handleSelectOption(key)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${optionClasses}`}
                        >
                          <div className="flex items-center gap-3.5 flex-1 pr-2">
                            {/* Key Badge */}
                            <span
                              className={`w-8 h-8 rounded-xl font-bold text-xs uppercase flex items-center justify-center transition-colors ${
                                isSubmitted && isCorrect
                                  ? 'bg-emerald-500 text-white'
                                  : isSubmitted && isSelected && !isCorrect
                                  ? 'bg-rose-500 text-white'
                                  : isSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                              }`}
                            >
                              {key}
                            </span>
                            <span className="text-base font-medium">{optText}</span>
                          </div>

                          {/* Check / Status Icon */}
                          <div className="flex-shrink-0">
                            {isSubmitted && isCorrect && (
                              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            )}
                            {isSubmitted && isSelected && !isCorrect && (
                              <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                                <XCircle className="w-4 h-4 stroke-[2.5]" />
                              </div>
                            )}
                            {!isSubmitted && (
                              <div
                                className={`w-5 h-5 rounded-full border-2 transition ${
                                  isSelected
                                    ? 'border-indigo-500 bg-indigo-500/30'
                                    : 'border-slate-700 group-hover:border-slate-500'
                                }`}
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                </div>

                {/* Explanation / Verification Banner after submit */}
                {isSubmitted && (
                  <div
                    className={`p-4 rounded-2xl border mb-6 text-sm transition-all animate-in fade-in duration-300 ${
                      selectedOption?.toLowerCase() === currentQ.correctKey.toLowerCase()
                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                        : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {selectedOption?.toLowerCase() === currentQ.correctKey.toLowerCase() ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">
                          {selectedOption?.toLowerCase() === currentQ.correctKey.toLowerCase()
                            ? 'Spot on! Correct answer.'
                            : `Incorrect. The right answer is: (${currentQ.correctKey.toUpperCase()}) ${currentQ.correctAnswer}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 text-sm font-medium cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="flex gap-3">
                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOption}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition text-sm flex items-center gap-2 cursor-pointer"
                    >
                      {currentIndex < filteredQuestions.length - 1 ? (
                        <>Next Question <ChevronRight className="w-4 h-4" /></>
                      ) : (
                        <>Finish Quiz <Trophy className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Quiz Completed Scorecard Screen */
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-sm flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/20 mb-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl font-extrabold text-white mb-2">Quiz Completed!</h2>
              <p className="text-slate-400 text-sm max-w-md mb-8">
                Great job testing your knowledge on Solids, Liquids, and Gases across Class 8 concepts.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl mb-8">
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">Total Score</span>
                  <div className="text-2xl font-bold text-indigo-400 mt-1">
                    {scoreStats.percentage}%
                  </div>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">Correct</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {scoreStats.correct}
                  </div>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">Incorrect</span>
                  <div className="text-2xl font-bold text-rose-400 mt-1">
                    {scoreStats.wrong}
                  </div>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">Time Taken</span>
                  <div className="text-2xl font-bold text-amber-400 mt-1">
                    {formatTime(seconds)}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
                <button
                  onClick={() => setQuizFinished(false)}
                  className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" /> Review Questions
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        Class 8 Science Quiz Project • Deployed on Vercel • Solids, Liquids, and Gases Master Bank
      </footer>
    </div>
  );
}
