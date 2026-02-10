"use client"
import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  Copy, 
  Check, 
  Folder,
  FolderOpen,
  FileCode,
  Menu, 
  X,
  Eye,
  AlertTriangle,
  Sparkles,
  Code2,
  Zap
} from 'lucide-react';
import { topics, Topic, Question } from './topics';

// Syntax highlighter for JavaScript
const highlightCode = (code: string) => {
  let highlighted = code;
  highlighted = highlighted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  const tokenMap: {[key: string]: string} = {};
  let tokenIndex = 0;
  
  const saveToken = (content: string, className: string) => {
    const key = `__TOKEN_${tokenIndex++}__`;
    tokenMap[key] = `<span class="${className}">${content}</span>`;
    return key;
  };
  
  // Comments
  highlighted = highlighted.replace(/(\/\/.*$)/gm, m => saveToken(m, "text-[#6A9955] italic"));
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, m => saveToken(m, "text-[#6A9955] italic"));
  
  // Strings
  highlighted = highlighted.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, m => saveToken(m, "text-[#ce9178]"));
  
  // Keywords
  highlighted = highlighted.replace(/\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|class|extends|super|this|static|async|await|yield|import|export|from|default|typeof|instanceof|in|of|delete|void)\b/g, m => saveToken(m, "text-[#569cd6] font-medium"));
  
  // Built-in objects and methods
  highlighted = highlighted.replace(/\b(console|document|window|Array|Object|String|Number|Boolean|Math|Date|Promise|JSON|parseInt|parseFloat|setTimeout|setInterval|fetch)\b/g, m => saveToken(m, "text-[#4ec9b0]"));
  
  // Function names
  highlighted = highlighted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, m => saveToken(m.trim(), "text-[#dcdcaa]"));
  
  // Numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, m => saveToken(m, "text-[#b5cea8]"));
  
  // Booleans and null/undefined
  highlighted = highlighted.replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, m => saveToken(m, "text-[#569cd6]"));
  
  Object.keys(tokenMap).forEach(key => {
    highlighted = highlighted.split(key).join(tokenMap[key]);
  });
  
  return highlighted;
};

// Code Block Component
const CodeBlock = ({ title, code }: { title: string; code: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#1e1e1e] shadow-2xl">
      <div className="bg-[#252526] px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-xs text-zinc-500 font-mono">{title}</span>
        </div>
        <button 
          onClick={handleCopy} 
          className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-zinc-700"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-[13px] leading-relaxed font-mono text-[#d4d4d4]">
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
      </pre>
    </div>
  );
};

// Difficulty Badge
const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const colors = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colors[difficulty as keyof typeof colors]}`}>
      {difficulty}
    </span>
  );
};

// Main App Component
const App = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['basics']);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewingAnswer, setViewingAnswer] = useState<Question | null>(null);
  const [showWarning, setShowWarning] = useState<Question | null>(null);
  const [unlockedAnswers, setUnlockedAnswers] = useState<Set<string>>(new Set());

  const handleTopicClick = (topic: Topic) => {
    if (topic.subTopics && topic.subTopics.length > 0) {
      setExpandedFolders(prev => 
        prev.includes(topic.id) 
          ? prev.filter(id => id !== topic.id) 
          : [...prev, topic.id]
      );
    }
    setSelectedTopic(topic);
    setIsMobileMenuOpen(false);
  };

  const handleShowAnswer = (question: Question) => {
    if (unlockedAnswers.has(question.id)) {
      setViewingAnswer(question);
    } else {
      setShowWarning(question);
    }
  };

  const confirmReveal = () => {
    if (showWarning) {
      const newSet = new Set(unlockedAnswers);
      newSet.add(showWarning.id);
      setUnlockedAnswers(newSet);
      setViewingAnswer(showWarning);
      setShowWarning(null);
    }
  };

  const renderSidebarItem = (topic: Topic, depth = 0) => {
    const isExpanded = expandedFolders.includes(topic.id);
    const isSelected = selectedTopic.id === topic.id;
    const hasChildren = topic.subTopics && topic.subTopics.length > 0;
    const paddingLeft = `${depth * 1 + 1}rem`;

    return (
      <div key={topic.id} className="w-full">
        <button
          onClick={() => handleTopicClick(topic)}
          className={`
            w-full flex items-center gap-3 py-3 px-4 text-sm transition-all border-l-2 group
            ${isSelected 
              ? 'bg-gradient-to-r from-violet-500/10 to-transparent text-white border-violet-500' 
              : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border-transparent'
            }
          `}
          style={{ paddingLeft }}
        >
          <span className="text-lg">{topic.icon}</span>
          <span className="truncate flex-1 text-left font-medium">{topic.title}</span>
          {hasChildren && (
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="border-l border-zinc-800 ml-4">
            {topic.subTopics!.map(child => renderSidebarItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        flex flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300
        fixed lg:relative inset-y-0 left-0 z-50 w-80
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  JS Interview
                </span>
              </h1>
              <p className="text-xs text-zinc-500">Master JavaScript concepts</p>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {topics.map(topic => renderSidebarItem(topic))}
        </nav>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <div className="text-xs text-zinc-500 text-center">
            {topics.reduce((sum, t) => sum + t.questions.length, 0)} questions available
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 border-b border-zinc-800 bg-zinc-900 flex items-center px-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="text-zinc-300 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            JS Interview
          </span>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl items-center justify-between px-8">
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <span>Topics</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-zinc-200 font-medium">{selectedTopic.title}</span>
          </div>
          <div className="flex items-center gap-3 bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-zinc-300 font-medium">{selectedTopic.questions.length} Questions</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
          <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{selectedTopic.icon}</span>
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  {selectedTopic.title}
                </h2>
              </div>
              <p className="text-zinc-400 text-lg">
                Test your knowledge with {selectedTopic.questions.length} carefully crafted questions
              </p>
            </div>

            {/* Questions Grid */}
            <div className="space-y-6">
              {selectedTopic.questions.map((question, idx) => (
                <div 
                  key={question.id}
                  className="group bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300 shadow-lg hover:shadow-violet-500/10"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-zinc-100 leading-relaxed">
                          {question.question}
                        </h3>
                      </div>
                    </div>
                    <DifficultyBadge difficulty={question.difficulty} />
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleShowAnswer(question)}
                      className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all
                        ${unlockedAnswers.has(question.id)
                          ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700'
                        }
                      `}
                    >
                      <Eye className="w-4 h-4" />
                      {unlockedAnswers.has(question.id) ? 'View Solution' : 'Show Solution'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">Think First!</h3>
              <p className="text-zinc-400 leading-relaxed">
                Try solving the problem yourself before viewing the solution. 
                This is the best way to master JavaScript!
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmReveal} 
                className="w-full px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all"
              >
                Show Answer Anyway
              </button>
              <button 
                onClick={() => setShowWarning(null)} 
                className="w-full px-6 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                I'll Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Answer Modal */}
      {viewingAnswer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-100">Solution</h3>
                  <p className="text-sm text-zinc-500 font-mono">{viewingAnswer.answer.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingAnswer(null)} 
                className="text-zinc-400 hover:text-white bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <CodeBlock 
                title={viewingAnswer.answer.title} 
                code={viewingAnswer.answer.code} 
              />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #18181b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #52525b;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoom-in {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        
        .animate-in {
          animation: fade-in 0.3s ease-out, zoom-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;