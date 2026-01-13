"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Code, 
  ChevronRight, 
  ChevronDown,
  Copy, 
  Check, 
  PanelLeftClose, 
  PanelLeft,
  FileCode,
  Folder,
  FolderOpen,
  Menu, 
  X
} from 'lucide-react';

// Import data and types from your file
import { topics, Topic } from './topics';

// --- HELPER FUNCTION: FIND BREADCRUMBS ---
// This recursively searches for the selected ID and builds the path of titles
const findBreadcrumbs = (nodes: Topic[], targetId: string): string[] | null => {
  for (const node of nodes) {
    // If we found the node, start the path with its title
    if (node.id === targetId) return [node.title];
    
    // If this node has children, search inside them
    if (node.subTopics) {
      const childPath = findBreadcrumbs(node.subTopics, targetId);
      if (childPath) {
        // If found in a child, prepend the current node's title
        return [node.title, ...childPath];
      }
    }
  }
  return null;
};

// --- CODE BLOCK COMPONENT ---
const CodeBlock = ({ title, code }: { title: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    highlighted = highlighted.replace(/(".*?"|'.*?'|`[\s\S]*?`)/g, m => saveToken(m, "text-[#ce9178]"));
    highlighted = highlighted.replace(/(\/\/.*$)/gm, m => saveToken(m, "text-[#6A9955] italic"));
    highlighted = highlighted.replace(/\b(return|if|else|class|new|this|super|extends)\b/g, m => saveToken(m, "text-[#c586c0] font-medium"));
    highlighted = highlighted.replace(/\b(const|let|var|function|constructor|static)\b/g, m => saveToken(m, "text-[#569cd6] font-medium"));
    highlighted = highlighted.replace(/([\w$]+)(?=\()/g, m => saveToken(m, "text-[#dcdcaa]"));
    highlighted = highlighted.replace(/\b([A-Z][\w]*)\b/g, m => saveToken(m, "text-[#4ec9b0]"));
    highlighted = highlighted.replace(/\b(\d+)\b/g, m => saveToken(m, "text-[#b5cea8]"));
    Object.keys(tokenMap).forEach(key => {
       highlighted = highlighted.split(key).join(tokenMap[key]);
    });
    return highlighted;
  };

  return (
    <div className="mt-6 rounded-lg overflow-hidden border border-[#3e3e42] bg-[#1e1e1e] shadow-xl">
      <div className="bg-[#252526] px-4 py-2 border-b border-[#3e3e42] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-xs text-gray-400 font-mono ml-2">{title}.java</span>
        </div>
        <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-[14px] leading-relaxed font-mono text-[#d4d4d4]">
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
      </pre>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['intro', 'principles']);
  
  // Calculate Breadcrumbs based on the current selection
  const breadcrumbs = findBreadcrumbs(topics, selectedTopic.id) || [selectedTopic.title];

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  // Resizable Sidebar Logic
  const [sidebarWidth, setSidebarWidth] = useState(240); 
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Resize Handlers
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const resize = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = Math.max(200, Math.min(e.clientX, 500));
        setSidebarWidth(newWidth);
      }
    };

    const stopResizing = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none'; 
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  const handleTopicClick = (topic: Topic) => {
    if (topic.subTopics && topic.subTopics.length > 0) {
      setExpandedFolders(prev => 
        prev.includes(topic.id) 
          ? prev.filter(id => id !== topic.id) 
          : [...prev, topic.id]
      );
      // If folder has content, select it. If not, just toggle expand.
      if (topic.content) {
        setSelectedTopic(topic);
        setIsMobileMenuOpen(false); 
      }
    } else {
      setSelectedTopic(topic);
      setIsMobileMenuOpen(false); 
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Recursive Sidebar Item Renderer
  const renderSidebarItem = (topic: Topic, depth = 0) => {
    const isExpanded = expandedFolders.includes(topic.id);
    const isSelected = selectedTopic.id === topic.id;
    const hasChildren = topic.subTopics && topic.subTopics.length > 0;
    
    const paddingLeft = (isSidebarOpen || isMobileMenuOpen) ? `${depth * 1 + 1}rem` : '0.5rem';

    return (
      <div key={topic.id} className="w-full">
        <button
          onClick={() => handleTopicClick(topic)}
          title={!isSidebarOpen && !isMobileMenuOpen ? topic.title : ''}
          className={`
            w-full flex items-center gap-2 py-2.5 px-2 text-sm transition-colors border-l-2
            ${isSelected 
              ? 'bg-[#37373d] text-white border-indigo-500' 
              : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200 border-transparent'
            }
          `}
          style={{ paddingLeft }}
        >
          <div className={`flex items-center justify-center ${( !isSidebarOpen && !isMobileMenuOpen ) && 'w-full'}`}>
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-gray-500'}`} />
              ) : (
                <Folder className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-gray-500'}`} />
              )
            ) : (
              <FileCode className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-blue-400'}`} />
            )}
          </div>
          
          {(isSidebarOpen || isMobileMenuOpen) && (
            <>
              <span className="truncate flex-1 text-left">{topic.title}</span>
              {hasChildren && (
                <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
              )}
            </>
          )}
        </button>

        {hasChildren && isExpanded && (isSidebarOpen || isMobileMenuOpen) && (
          <div className="border-l border-[#3e3e42] ml-4">
            {topic.subTopics!.map(child => renderSidebarItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#0d1117] text-[#cccccc] overflow-hidden font-sans select-none">
      
      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <div 
        ref={sidebarRef}
        style={{ width: (isSidebarOpen && !isMobileMenuOpen) ? sidebarWidth : undefined }}
        className={`
          flex flex-col bg-[#252526] border-r border-[#1e1e1e] transition-all ease-in-out duration-300
          fixed md:relative inset-y-0 left-0 z-50
          ${isMobileMenuOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          ${(!isSidebarOpen && !isMobileMenuOpen) ? 'md:w-16' : ''}
        `}
      >
        {isSidebarOpen && (
          <div
            className="hidden md:block absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-indigo-500/50 transition-colors z-50"
            onMouseDown={startResizing}
          />
        )}

        <div className={`p-4 border-b border-[#1e1e1e] flex items-center ${(isSidebarOpen || isMobileMenuOpen) ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-indigo-500 shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="animate-in fade-in duration-300">
                <h1 className="font-bold text-gray-100 tracking-tight">OOPs <span className="text-indigo-500">Notes</span></h1>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
           {topics.map(topic => renderSidebarItem(topic))}
        </nav>

        <div className="border-t border-[#1e1e1e] bg-[#252526] relative z-20">
          <button 
            onClick={toggleSidebar}
            className={`hidden md:flex w-full hover:bg-[#37373d] text-gray-500 p-4 transition-colors items-center ${(isSidebarOpen) ? 'justify-end' : 'justify-center'}`}
          >
             {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#1e1e1e]">
        
        {/* Mobile Header */}
        <div className="md:hidden h-14 border-b border-[#2d2d2d] bg-[#252526] flex items-center px-4 shrink-0">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-300 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-bold text-gray-200">OOPs Notes</span>
        </div>

        {/* Top Header Bar (With Dynamic Breadcrumbs) */}
        <div className="h-14 border-b border-[#2d2d2d] bg-[#1e1e1e] flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 overflow-hidden">
             <span>notes</span>
             <ChevronRight className="w-3 h-3 shrink-0" />
             <span className="hidden sm:inline">java</span>
             
             {/* DYNAMIC BREADCRUMBS MAPPING */}
             {breadcrumbs.map((item, index) => {
               // Only color the last item gray-300, others are gray-500
               const isLast = index === breadcrumbs.length - 1;
               return (
                 <React.Fragment key={index}>
                   <ChevronRight className="w-3 h-3 shrink-0" />
                   <span className={`${isLast ? "text-gray-300 truncate" : "hidden sm:inline"}`}>
                     {item}
                   </span>
                 </React.Fragment>
               );
             })}
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-[#252526] px-3 py-1.5 rounded-full border border-[#3e3e42]">
             <div className="flex -space-x-2">
                {selectedTopic.contributors.map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-[#252526] flex items-center justify-center text-[8px] font-bold text-white" title={c}>
                    {c.charAt(0)}
                  </div>
                ))}
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] text-gray-500 font-medium uppercase leading-none">Contributors</span>
             </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto pb-20">
            {selectedTopic.content ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-100 tracking-tight">
                    {selectedTopic.title}
                  </h2>
                  <div className="space-y-4">
                    {selectedTopic.content.description.map((paragraph, index) => (
                      <p key={index} className="text-[#cccccc] leading-7 text-base sm:text-lg">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                     Key Concepts
                   </h3>
                   <ul className="space-y-3">
                    {selectedTopic.content.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300 bg-[#252526] p-3 rounded-lg border border-[#3e3e42] hover:border-indigo-500/50 transition-colors text-sm sm:text-base">
                        <span className="text-indigo-400 font-mono mt-0.5">{`0${index + 1}`}</span>
                        <span>{point}</span>
                      </li>
                    ))}
                   </ul>
                </div>

                {selectedTopic.content.codeExample && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" /> Implementation
                    </h3>
                    <CodeBlock
                      title={selectedTopic.content.codeExample.title}
                      code={selectedTopic.content.codeExample.code}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 mt-10 sm:mt-20 text-center">
                <FolderOpen className="w-16 h-16 sm:w-20 sm:h-20 mb-4 opacity-20" />
                <p className="text-base sm:text-lg">Select a sub-topic from the sidebar to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;