// "use client"
// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Database, 
//   Code, 
//   ChevronRight, 
//   ChevronDown,
//   Copy, 
//   Check, 
//   PanelLeftClose, 
//   PanelLeft,
//   FileCode,
//   Folder,
//   FolderOpen,
//   Menu, 
//   X,
//   Layers
// } from 'lucide-react';

// // Import data and types from your file
// import { topics, Topic, ContentSection } from './topcis';

// // --- HELPER FUNCTION: FIND BREADCRUMBS ---
// const findBreadcrumbs = (nodes: Topic[], targetId: string): string[] | null => {
//   for (const node of nodes) {
//     if (node.id === targetId) return [node.title];
    
//     if (node.subTopics) {
//       const childPath = findBreadcrumbs(node.subTopics, targetId);
//       if (childPath) {
//         return [node.title, ...childPath];
//       }
//     }
//   }
//   return null;
// };

// // --- CODE BLOCK COMPONENT ---
// const CodeBlock = ({ title, code }: { title: string; code: string }) => {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(code);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const highlightCode = (code: string) => {
//     let highlighted = code;
//     highlighted = highlighted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
//     const tokenMap: {[key: string]: string} = {};
//     let tokenIndex = 0;
//     const saveToken = (content: string, className: string) => {
//       const key = `__TOKEN_${tokenIndex++}__`;
//       tokenMap[key] = `<span class="${className}">${content}</span>`;
//       return key;
//     };
    
//     // SQL-specific highlighting
//     highlighted = highlighted.replace(/('.*?'|".*?")/g, m => saveToken(m, "text-[#ce9178]"));
//     highlighted = highlighted.replace(/(--.*$)/gm, m => saveToken(m, "text-[#6A9955] italic"));
//     highlighted = highlighted.replace(/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|DATABASE|INDEX|VIEW|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|ORDER BY|HAVING|LIMIT|DISTINCT|AS|INTO|VALUES|SET|AND|OR|NOT|IN|BETWEEN|LIKE|IS|NULL|EXISTS|UNION|CASE|WHEN|THEN|ELSE|END)\b/gi, m => saveToken(m.toUpperCase(), "text-[#569cd6] font-medium"));
//     highlighted = highlighted.replace(/\b(INT|VARCHAR|TEXT|DATE|DATETIME|TIMESTAMP|DECIMAL|FLOAT|BOOLEAN|CHAR|BLOB|ENUM|SET|BIGINT|SMALLINT|TINYINT|DOUBLE|TIME|YEAR|JSON)\b/gi, m => saveToken(m.toUpperCase(), "text-[#4ec9b0]"));
//     highlighted = highlighted.replace(/\b(PRIMARY KEY|FOREIGN KEY|NOT NULL|UNIQUE|AUTO_INCREMENT|DEFAULT|CHECK|REFERENCES|CASCADE|BEGIN|COMMIT|ROLLBACK|TRANSACTION|SAVEPOINT|CONSTRAINT)\b/gi, m => saveToken(m.toUpperCase(), "text-[#c586c0] font-medium"));
//     highlighted = highlighted.replace(/\b(COUNT|SUM|AVG|MAX|MIN|CONCAT|LENGTH|UPPER|LOWER|SUBSTRING|TRIM|ROUND|NOW|CURDATE|DATE_FORMAT|IF|COALESCE|IFNULL)\b/gi, m => saveToken(m.toUpperCase(), "text-[#dcdcaa]"));
//     highlighted = highlighted.replace(/\b(\d+)\b/g, m => saveToken(m, "text-[#b5cea8]"));
    
//     Object.keys(tokenMap).forEach(key => {
//        highlighted = highlighted.split(key).join(tokenMap[key]);
//     });
//     return highlighted;
//   };

//   return (
//     <div className="mt-6 rounded-lg overflow-hidden border border-[#3e3e42] bg-[#1e1e1e] shadow-xl">
//       <div className="bg-[#252526] px-4 py-2 border-b border-[#3e3e42] flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="flex gap-1.5">
//             <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]"></div>
//             <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]"></div>
//             <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]"></div>
//           </div>
//           <span className="text-xs text-gray-400 font-mono ml-2">{title}.sql</span>
//         </div>
//         <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
//           {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
//         </button>
//       </div>
//       <pre className="p-4 overflow-x-auto text-xs sm:text-[14px] leading-relaxed font-mono text-[#d4d4d4]">
//         <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
//       </pre>
//     </div>
//   );
// };

// // --- MAIN APP COMPONENT ---
// const App = () => {
//   const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);
//   const [expandedFolders, setExpandedFolders] = useState<string[]>(['intro']);
  
//   const breadcrumbs = findBreadcrumbs(topics, selectedTopic.id) || [selectedTopic.title];

//   const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
//   const [sidebarWidth, setSidebarWidth] = useState(240); 
//   const [isResizing, setIsResizing] = useState(false);
//   const sidebarRef = useRef<HTMLDivElement>(null);

//   const startResizing = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsResizing(true);
//   };

//   useEffect(() => {
//     const resize = (e: MouseEvent) => {
//       if (isResizing) {
//         const newWidth = Math.max(200, Math.min(e.clientX, 500));
//         setSidebarWidth(newWidth);
//       }
//     };

//     const stopResizing = () => {
//       setIsResizing(false);
//     };

//     if (isResizing) {
//       window.addEventListener('mousemove', resize);
//       window.addEventListener('mouseup', stopResizing);
//       document.body.style.cursor = 'col-resize';
//       document.body.style.userSelect = 'none'; 
//     } else {
//       document.body.style.cursor = 'default';
//       document.body.style.userSelect = 'auto';
//     }

//     return () => {
//       window.removeEventListener('mousemove', resize);
//       window.removeEventListener('mouseup', stopResizing);
//     };
//   }, [isResizing]);

//   const handleTopicClick = (topic: Topic) => {
//     if (topic.subTopics && topic.subTopics.length > 0) {
//       setExpandedFolders(prev => 
//         prev.includes(topic.id) 
//           ? prev.filter(id => id !== topic.id) 
//           : [...prev, topic.id]
//       );
//       // If it has sections, we can still select it as a page
//       if (topic.sections) {
//         setSelectedTopic(topic);
//         setIsMobileMenuOpen(false); 
//       }
//     } else {
//       setSelectedTopic(topic);
//       setIsMobileMenuOpen(false); 
//     }
//   };

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   const renderSidebarItem = (topic: Topic, depth = 0) => {
//     const isExpanded = expandedFolders.includes(topic.id);
//     const isSelected = selectedTopic.id === topic.id;
//     const hasChildren = topic.subTopics && topic.subTopics.length > 0;
    
//     const paddingLeft = (isSidebarOpen || isMobileMenuOpen) ? `${depth * 1 + 1}rem` : '0.5rem';

//     return (
//       <div key={topic.id} className="w-full">
//         <button
//           onClick={() => handleTopicClick(topic)}
//           title={!isSidebarOpen && !isMobileMenuOpen ? topic.title : ''}
//           className={`
//             w-full flex items-center gap-2 py-2.5 px-2 text-sm transition-colors border-l-2
//             ${isSelected 
//               ? 'bg-[#37373d] text-white border-emerald-500' 
//               : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200 border-transparent'
//             }
//           `}
//           style={{ paddingLeft }}
//         >
//           <div className={`flex items-center justify-center ${( !isSidebarOpen && !isMobileMenuOpen ) && 'w-full'}`}>
//             {hasChildren ? (
//               isExpanded ? (
//                 <FolderOpen className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-gray-500'}`} />
//               ) : (
//                 <Folder className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-gray-500'}`} />
//               )
//             ) : (
//               <FileCode className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-emerald-400'}`} />
//             )}
//           </div>
          
//           {(isSidebarOpen || isMobileMenuOpen) && (
//             <>
//               <span className="truncate flex-1 text-left">{topic.title}</span>
//               {hasChildren && (
//                 <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
//               )}
//             </>
//           )}
//         </button>

//         {hasChildren && isExpanded && (isSidebarOpen || isMobileMenuOpen) && (
//           <div className="border-l border-[#3e3e42] ml-4">
//             {topic.subTopics!.map(child => renderSidebarItem(child, depth + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen bg-[#0d1117] text-[#cccccc] overflow-hidden font-sans select-none">
      
//       {isMobileMenuOpen && (
//         <div 
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* --- SIDEBAR --- */}
//       <div 
//         ref={sidebarRef}
//         style={{ width: (isSidebarOpen && !isMobileMenuOpen) ? sidebarWidth : undefined }}
//         className={`
//           flex flex-col bg-[#252526] border-r border-[#1e1e1e] transition-all ease-in-out duration-300
//           fixed md:relative inset-y-0 left-0 z-50
//           ${isMobileMenuOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0'}
//           ${(!isSidebarOpen && !isMobileMenuOpen) ? 'md:w-16' : ''}
//         `}
//       >
//         {isSidebarOpen && (
//           <div
//             className="hidden md:block absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-emerald-500/50 transition-colors z-50"
//             onMouseDown={startResizing}
//           />
//         )}

//         <div className={`p-4 border-b border-[#1e1e1e] flex items-center ${(isSidebarOpen || isMobileMenuOpen) ? 'justify-between' : 'justify-center'}`}>
//           <div className="flex items-center gap-3">
//             <Database className="w-6 h-6 text-emerald-500 shrink-0" />
//             {(isSidebarOpen || isMobileMenuOpen) && (
//               <div className="animate-in fade-in duration-300">
//                 <h1 className="font-bold text-gray-100 tracking-tight">SQL <span className="text-emerald-500">Notes</span></h1>
//               </div>
//             )}
//           </div>
//           <button 
//             onClick={() => setIsMobileMenuOpen(false)}
//             className="md:hidden text-gray-400 hover:text-white"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
//            {topics.map(topic => renderSidebarItem(topic))}
//         </nav>

//         <div className="border-t border-[#1e1e1e] bg-[#252526] relative z-20">
//           <button 
//             onClick={toggleSidebar}
//             className={`hidden md:flex w-full hover:bg-[#37373d] text-gray-500 p-4 transition-colors items-center ${(isSidebarOpen) ? 'justify-end' : 'justify-center'}`}
//           >
//              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
//           </button>
//         </div>
//       </div>

//       {/* --- MAIN CONTENT --- */}
//       <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#1e1e1e]">
        
//         <div className="md:hidden h-14 border-b border-[#2d2d2d] bg-[#252526] flex items-center px-4 shrink-0">
//           <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-300 hover:text-white">
//             <Menu className="w-6 h-6" />
//           </button>
//           <span className="ml-4 font-bold text-gray-200">SQL Notes</span>
//         </div>

//         <div className="h-14 border-b border-[#2d2d2d] bg-[#1e1e1e] flex items-center justify-between px-4 sm:px-8 shrink-0">
//           <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 overflow-hidden">
//              <span>Notes</span>
//              <ChevronRight className="w-3 h-3 shrink-0" />
//              <span className="hidden sm:inline">SQL</span>
             
//              {breadcrumbs.map((item, index) => {
//                const isLast = index === breadcrumbs.length - 1;
//                return (
//                  <React.Fragment key={index}>
//                    <ChevronRight className="w-3 h-3 shrink-0" />
//                    <span className={`${isLast ? "text-gray-300 truncate" : "hidden sm:inline"}`}>
//                      {item}
//                    </span>
//                  </React.Fragment>
//                );
//              })}
//           </div>

//           <div className="hidden sm:flex items-center gap-3 bg-[#252526] px-3 py-1.5 rounded-full border border-[#3e3e42]">
//              <div className="flex -space-x-2">
//                 {selectedTopic.contributors.map((c, i) => (
//                   <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-[#252526] flex items-center justify-center text-[8px] font-bold text-white" title={c}>
//                     {c.charAt(0)}
//                   </div>
//                 ))}
//              </div>
//              <div className="flex flex-col">
//                <span className="text-[10px] text-gray-500 font-medium uppercase leading-none">Contributors</span>
//              </div>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 scroll-smooth">
//           <div className="max-w-4xl mx-auto pb-20">
//             {selectedTopic.sections ? (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-100 tracking-tight pb-4 border-b border-[#3e3e42]">
//                   {selectedTopic.title}
//                 </h2>

//                 {/* --- RENDER ALL SECTIONS LOOP --- */}
//                 {selectedTopic.sections.map((section, idx) => (
//                   <div key={idx} className="mb-12 relative">
//                     {/* Optional separator line between sections */}
//                     {idx > 0 && <div className="absolute -top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3e3e42] to-transparent"></div>}

//                     {section.sectionTitle && (
//                       <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-emerald-400">
//                         {section.sectionTitle}
//                       </h3>
//                     )}

//                     <div className="space-y-4 mb-8">
//                       {section.description.map((paragraph, i) => (
//                         <p key={i} className="text-[#cccccc] leading-7 text-base sm:text-lg">
//                           {paragraph}
//                         </p>
//                       ))}
//                     </div>

//                     {/* Conditional Rendering for Key Concepts */}
//                     {section.keyPoints && section.keyPoints.length > 0 && (
//                       <div className="mb-8">
//                         <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
//                           <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
//                           Key Concepts
//                         </h4>
//                         <ul className="space-y-3">
//                           {section.keyPoints.map((point, i) => (
//                             <li key={i} className="flex items-start gap-3 text-gray-300 bg-[#252526] p-3 rounded-lg border border-[#3e3e42] hover:border-emerald-500/50 transition-colors text-sm sm:text-base">
//                               <span className="text-emerald-400 font-mono mt-0.5">{`0${i + 1}`}</span>
//                               <span>{point}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}

//                     {/* Conditional Rendering for Code Example */}
//                     {section.codeExample && (
//                       <div>
//                         <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
//                           <Code className="w-4 h-4" /> Implementation
//                         </h4>
//                         <CodeBlock
//                           title={section.codeExample.title}
//                           code={section.codeExample.code}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center text-gray-500 mt-10 sm:mt-20 text-center">
//                 <FolderOpen className="w-16 h-16 sm:w-20 sm:h-20 mb-4 opacity-20" />
//                 <p className="text-base sm:text-lg">Select a sub-topic from the sidebar to view details.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #1e1e1e;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #3e3e42;
//           border-radius: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #505054;
//         }
//         @keyframes slide-in-from-bottom-4 {
//           from {
//             transform: translateY(1rem);
//             opacity: 0;
//           }
//           to {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }
//         .slide-in-from-bottom-4 {
//           animation: slide-in-from-bottom-4 0.5s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default App;



"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
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
  X,
  Layers,
  Terminal,      
  Eye,           
  EyeOff,        
  AlertTriangle, 
  PlayCircle,    
  HelpCircle,
  Lightbulb,
  LayoutTemplate // Added for Scenario Icon
} from 'lucide-react';

// Import data
import { topics, Topic, PracticeSection, PracticeItem } from './topcis';

// --- HELPER: BREADCRUMBS ---
const findBreadcrumbs = (nodes: Topic[], targetId: string): string[] | null => {
  for (const node of nodes) {
    if (node.id === targetId) return [node.title];
    if (node.subTopics) {
      const childPath = findBreadcrumbs(node.subTopics, targetId);
      if (childPath) return [node.title, ...childPath];
    }
  }
  return null;
};

// --- HELPER: SYNTAX HIGHLIGHTING ---
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
  
  highlighted = highlighted.replace(/('.*?'|".*?")/g, m => saveToken(m, "text-[#ce9178]"));
  highlighted = highlighted.replace(/(--.*$)/gm, m => saveToken(m, "text-[#6A9955] italic"));
  highlighted = highlighted.replace(/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|DATABASE|INDEX|VIEW|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|ORDER BY|HAVING|LIMIT|DISTINCT|AS|INTO|VALUES|SET|AND|OR|NOT|IN|BETWEEN|LIKE|IS|NULL|EXISTS|UNION|CASE|WHEN|THEN|ELSE|END)\b/gi, m => saveToken(m.toUpperCase(), "text-[#569cd6] font-medium"));
  highlighted = highlighted.replace(/\b(INT|VARCHAR|TEXT|DATE|DATETIME|TIMESTAMP|DECIMAL|FLOAT|BOOLEAN|CHAR|BLOB|ENUM|SET|BIGINT|SMALLINT|TINYINT|DOUBLE|TIME|YEAR|JSON)\b/gi, m => saveToken(m.toUpperCase(), "text-[#4ec9b0]"));
  highlighted = highlighted.replace(/\b(PRIMARY KEY|FOREIGN KEY|NOT NULL|UNIQUE|AUTO_INCREMENT|DEFAULT|CHECK|REFERENCES|CASCADE|BEGIN|COMMIT|ROLLBACK|TRANSACTION|SAVEPOINT|CONSTRAINT)\b/gi, m => saveToken(m.toUpperCase(), "text-[#c586c0] font-medium"));
  highlighted = highlighted.replace(/\b(COUNT|SUM|AVG|MAX|MIN|CONCAT|LENGTH|UPPER|LOWER|SUBSTRING|TRIM|ROUND|NOW|CURDATE|DATE_FORMAT|IF|COALESCE|IFNULL)\b/gi, m => saveToken(m.toUpperCase(), "text-[#dcdcaa]"));
  highlighted = highlighted.replace(/\b(\d+)\b/g, m => saveToken(m, "text-[#b5cea8]"));
  
  Object.keys(tokenMap).forEach(key => {
      highlighted = highlighted.split(key).join(tokenMap[key]);
  });
  return highlighted;
};

// --- COMPONENT: STANDARD CODE BLOCK ---
const CodeBlock = ({ title, code }: { title: string; code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-[#3e3e42] bg-[#1e1e1e] shadow-xl">
      <div className="bg-[#252526] px-4 py-2 border-b border-[#3e3e42] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-xs text-gray-400 font-mono ml-2">{title}</span>
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

// --- COMPONENT: MAC-STYLE WINDOW (For Scenario Context) ---
const MacWindowCodeBlock = ({ title, code }: { title: string; code: string }) => {
  return (
    <div className="rounded-lg overflow-hidden border border-[#3e3e42] bg-[#1e1e1e] shadow-2xl mb-6">
      <div className="bg-[#252526] px-4 py-3 border-b border-[#3e3e42] flex items-center relative">
        <div className="flex gap-2 absolute left-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="w-full text-center">
             <span className="text-xs text-gray-400 font-mono font-medium">{title}</span>
        </div>
      </div>
      <pre className="p-5 overflow-x-auto text-sm leading-relaxed font-mono text-[#d4d4d4]">
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
      </pre>
    </div>
  );
};

// --- COMPONENT: PRACTICE AREA ---
const PracticeArea = ({ practiceBlocks }: { practiceBlocks: PracticeSection[] }) => {
  const [unlockedAnswers, setUnlockedAnswers] = useState<Set<string>>(new Set());
  const [warningId, setWarningId] = useState<string | null>(null);
  const [viewingAnswerId, setViewingAnswerId] = useState<string | null>(null);

  // Find active item
  const activeItem = practiceBlocks
    .flatMap(block => block.items)
    .find(item => item.id === (warningId || viewingAnswerId));

  const handleShowClick = (id: string) => {
    if (unlockedAnswers.has(id)) {
      setViewingAnswerId(id);
    } else {
      setWarningId(id);
    }
  };

  const confirmReveal = () => {
    if (warningId) {
      const newSet = new Set(unlockedAnswers);
      newSet.add(warningId);
      setUnlockedAnswers(newSet);
      setViewingAnswerId(warningId);
      setWarningId(null);
    }
  };

  const closeAnswer = () => setViewingAnswerId(null);

  return (
    <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-8 pb-3 border-b border-[#3e3e42]">
        <Terminal className="w-6 h-6 text-emerald-500" />
        <h2 className="text-2xl font-bold text-gray-100 tracking-tight">Practice Arena</h2>
      </div>

      {practiceBlocks.map((block, blockIdx) => (
        <div key={blockIdx} className="mb-12">
          {block.title && (
             <h3 className="text-lg font-semibold text-emerald-400 mb-6 flex items-center gap-2">
               <PlayCircle className="w-4 h-4" />
               {block.title}
             </h3>
          )}
          
          <div className="grid gap-8">
            {block.items.map((item) => {
              const isUnlocked = unlockedAnswers.has(item.id);

              // --- TYPE 1: SIMPLE PRACTICE ---
              if (item.type === 'simple') {
                return (
                  <div key={item.id} className="bg-[#252526] border border-[#3e3e42] rounded-xl p-6 hover:border-[#505054] transition-all shadow-lg">
                    <div className="flex flex-col gap-4">
                      <div className="flex-1">
                        <div className="space-y-3">
                           <div className="flex items-center gap-2 text-sm text-emerald-500 font-semibold mb-2">
                              <HelpCircle className="w-4 h-4" />
                              Questions
                           </div>
                           <ul className="space-y-3 pl-1">
                              {item.questions.map((q, idx) => (
                                <li key={idx} className="flex gap-3 text-gray-200 leading-relaxed bg-[#1e1e1e] p-3 rounded-lg border border-[#3e3e42]">
                                   <span className="text-emerald-500/70 font-mono text-sm">{idx + 1}.</span>
                                   <span>{q}</span>
                                </li>
                              ))}
                           </ul>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleShowClick(item.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isUnlocked ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-[#3e3e42] text-gray-300'}`}
                        >
                          {isUnlocked ? <Lightbulb className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {isUnlocked ? 'View Solution' : 'Show Solution'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // --- TYPE 2: SCENARIO PRACTICE (MAC WINDOW) ---
              if (item.type === 'scenario') {
                 return (
                  <div key={item.id} className="bg-[#252526]/50 border border-[#3e3e42] rounded-xl p-6 hover:border-[#505054] transition-all shadow-lg">
                     {/* Scenario Header */}
                     <div className="flex items-center gap-2 mb-4 text-gray-200 font-semibold">
                        <LayoutTemplate className="w-5 h-5 text-purple-400" />
                        {item.title}
                     </div>

                     {/* The Mac Window Context */}
                     <MacWindowCodeBlock title={item.context.title} code={item.context.code} />

                     {/* Question List */}
                     <div className="bg-[#1e1e1e] rounded-lg p-5 border border-[#3e3e42]">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Challenge Questions</h4>
                        <ul className="space-y-3">
                            {item.questions.map((q, idx) => (
                              <li key={idx} className="flex gap-3 text-gray-300 leading-relaxed">
                                  {/* Check if the question string already has numbering, else add it */}
                                  {!q.match(/^\d+\./) && <span className="text-purple-400 font-mono text-sm shrink-0">{idx + 1}.</span>}
                                  <span>{q}</span>
                              </li>
                            ))}
                        </ul>
                     </div>

                     <div className="flex justify-end mt-6">
                        <button
                          onClick={() => handleShowClick(item.id)}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                          ${isUnlocked 
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20' 
                            : 'bg-[#3e3e42] text-gray-300 hover:bg-[#4e4e52] hover:text-white'}`}
                        >
                          {isUnlocked ? <Lightbulb className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {isUnlocked ? 'View Solutions' : 'Reveal Solutions'}
                        </button>
                      </div>
                  </div>
                 )
              }
              return null;
            })}
          </div>
        </div>
      ))}

      {/* WARNING MODAL */}
      {warningId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
             <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-100">Wait a moment!</h3>
             </div>
             <p className="text-gray-400 mb-8 leading-relaxed text-center px-2">
               Are you sure you want to see the answer? <br/>
               <span className="text-gray-300 font-medium">Solving the problem yourself first is the best way to master SQL.</span>
             </p>
             <div className="flex flex-col-reverse sm:flex-row gap-3">
               <button onClick={() => setWarningId(null)} className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-[#2d2d2d] transition-colors">I'll try again</button>
               <button onClick={confirmReveal} className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/20 transition-all">Show Answer</button>
             </div>
          </div>
        </div>
      )}

      {/* ANSWER MODAL (POPUP) */}
      {viewingAnswerId && activeItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh] relative">
                <div className="flex items-center justify-between p-6 border-b border-[#3e3e42]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                            <Check className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-100">Solution</h3>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">{activeItem.answer.title}</p>
                        </div>
                    </div>
                    <button onClick={closeAnswer} className="text-gray-400 hover:text-white bg-[#2d2d2d] p-2 rounded-full hover:bg-[#3e3e42]"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <CodeBlock title={activeItem.answer.title} code={activeItem.answer.code} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['intro']);
  const breadcrumbs = findBreadcrumbs(topics, selectedTopic.id) || [selectedTopic.title];
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [sidebarWidth, setSidebarWidth] = useState(240); 
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const resize = (e: MouseEvent) => isResizing && setSidebarWidth(Math.max(200, Math.min(e.clientX, 500)));
    const stopResizing = () => setIsResizing(false);
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none'; 
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
    return () => { window.removeEventListener('mousemove', resize); window.removeEventListener('mouseup', stopResizing); };
  }, [isResizing]);

  const handleTopicClick = (topic: Topic) => {
    if (topic.subTopics && topic.subTopics.length > 0) {
      setExpandedFolders(prev => prev.includes(topic.id) ? prev.filter(id => id !== topic.id) : [...prev, topic.id]);
      if (topic.sections || topic.practice) { setSelectedTopic(topic); setIsMobileMenuOpen(false); }
    } else { setSelectedTopic(topic); setIsMobileMenuOpen(false); }
  };

  const renderSidebarItem = (topic: Topic, depth = 0) => {
    const isExpanded = expandedFolders.includes(topic.id);
    const isSelected = selectedTopic.id === topic.id;
    const hasChildren = topic.subTopics && topic.subTopics.length > 0;
    const paddingLeft = (isSidebarOpen || isMobileMenuOpen) ? `${depth * 1 + 1}rem` : '0.5rem';

    return (
      <div key={topic.id} className="w-full">
        <button onClick={() => handleTopicClick(topic)} title={!isSidebarOpen && !isMobileMenuOpen ? topic.title : ''} className={`w-full flex items-center gap-2 py-2.5 px-2 text-sm transition-colors border-l-2 ${isSelected ? 'bg-[#37373d] text-white border-emerald-500' : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200 border-transparent'}`} style={{ paddingLeft }}>
          <div className={`flex items-center justify-center ${( !isSidebarOpen && !isMobileMenuOpen ) && 'w-full'}`}>
            {hasChildren ? (isExpanded ? <FolderOpen className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-gray-500'}`} /> : <Folder className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-gray-500'}`} />) : <FileCode className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-emerald-400'}`} />}
          </div>
          {(isSidebarOpen || isMobileMenuOpen) && (<><span className="truncate flex-1 text-left">{topic.title}</span>{hasChildren && <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />}</>)}
        </button>
        {hasChildren && isExpanded && (isSidebarOpen || isMobileMenuOpen) && <div className="border-l border-[#3e3e42] ml-4">{topic.subTopics!.map(child => renderSidebarItem(child, depth + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#0d1117] text-[#cccccc] overflow-hidden font-sans select-none">
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in" onClick={() => setIsMobileMenuOpen(false)} />}
      <div style={{ width: (isSidebarOpen && !isMobileMenuOpen) ? sidebarWidth : undefined }} className={`flex flex-col bg-[#252526] border-r border-[#1e1e1e] transition-all duration-300 fixed md:relative inset-y-0 left-0 z-50 ${isMobileMenuOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0'} ${(!isSidebarOpen && !isMobileMenuOpen) ? 'md:w-16' : ''}`}>
        {isSidebarOpen && <div className="hidden md:block absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-emerald-500/50 z-50" onMouseDown={(e) => {e.preventDefault(); setIsResizing(true)}} />}
        <div className={`p-4 border-b border-[#1e1e1e] flex items-center ${(isSidebarOpen || isMobileMenuOpen) ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center gap-3"><Database className="w-6 h-6 text-emerald-500 shrink-0" />{(isSidebarOpen || isMobileMenuOpen) && <h1 className="font-bold text-gray-100 tracking-tight">SQL <span className="text-emerald-500">Notes</span></h1>}</div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto custom-scrollbar">{topics.map(topic => renderSidebarItem(topic))}</nav>
        <div className="border-t border-[#1e1e1e] bg-[#252526] relative z-20"><button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`hidden md:flex w-full hover:bg-[#37373d] text-gray-500 p-4 transition-colors items-center ${(isSidebarOpen) ? 'justify-end' : 'justify-center'}`}>{isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}</button></div>
      </div>
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#1e1e1e]">
        <div className="md:hidden h-14 border-b border-[#2d2d2d] bg-[#252526] flex items-center px-4 shrink-0"><button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-300 hover:text-white"><Menu className="w-6 h-6" /></button><span className="ml-4 font-bold text-gray-200">SQL Notes</span></div>
        <div className="h-14 border-b border-[#2d2d2d] bg-[#1e1e1e] flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 overflow-hidden"><span>Notes</span><ChevronRight className="w-3 h-3 shrink-0" /><span className="hidden sm:inline">SQL</span>{breadcrumbs.map((item, index) => <React.Fragment key={index}><ChevronRight className="w-3 h-3 shrink-0" /><span className={`${index === breadcrumbs.length - 1 ? "text-gray-300 truncate" : "hidden sm:inline"}`}>{item}</span></React.Fragment>)}</div>
          <div className="hidden sm:flex items-center gap-3 bg-[#252526] px-3 py-1.5 rounded-full border border-[#3e3e42]"><div className="flex -space-x-2">{selectedTopic.contributors.map((c, i) => <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-[#252526] flex items-center justify-center text-[8px] font-bold text-white" title={c}>{c.charAt(0)}</div>)}</div><span className="text-[10px] text-gray-500 font-medium uppercase leading-none">Contributors</span></div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto pb-20">
            {selectedTopic.sections ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-100 tracking-tight pb-4 border-b border-[#3e3e42]">{selectedTopic.title}</h2>
                {selectedTopic.sections.map((section, idx) => (
                  <div key={idx} className="mb-12 relative">
                    {idx > 0 && <div className="absolute -top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3e3e42] to-transparent"></div>}
                    {section.sectionTitle && <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-emerald-400">{section.sectionTitle}</h3>}
                    <div className="space-y-4 mb-8">{section.description.map((paragraph, i) => <p key={i} className="text-[#cccccc] leading-7 text-base sm:text-lg">{paragraph}</p>)}</div>
                    {section.keyPoints && section.keyPoints.length > 0 && <div className="mb-8"><h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Key Concepts</h4><ul className="space-y-3">{section.keyPoints.map((point, i) => <li key={i} className="flex items-start gap-3 text-gray-300 bg-[#252526] p-3 rounded-lg border border-[#3e3e42] hover:border-emerald-500/50 transition-colors text-sm sm:text-base"><span className="text-emerald-400 font-mono mt-0.5">{`0${i + 1}`}</span><span>{point}</span></li>)}</ul></div>}
                    {section.codeExample && <div><h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Code className="w-4 h-4" /> Implementation</h4><CodeBlock title={section.codeExample.title} code={section.codeExample.code} /></div>}
                  </div>
                ))}
              </div>
            ) : null}
            {selectedTopic.practice && selectedTopic.practice.length > 0 && <PracticeArea practiceBlocks={selectedTopic.practice} />}
            {!selectedTopic.sections && (!selectedTopic.practice || selectedTopic.practice.length === 0) && <div className="h-full flex flex-col items-center justify-center text-gray-500 mt-10 sm:mt-20 text-center"><FolderOpen className="w-16 h-16 sm:w-20 sm:h-20 mb-4 opacity-20" /><p className="text-base sm:text-lg">Select a sub-topic from the sidebar to view details.</p></div>}
          </div>
        </div>
      </div>
      <style jsx global>{` .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; } .custom-scrollbar::-webkit-scrollbar-track { background: #1e1e1e; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3e3e42; border-radius: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #505054; } @keyframes slide-in-from-bottom-4 { from { transform: translateY(1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } } .slide-in-from-bottom-4 { animation: slide-in-from-bottom-4 0.5s ease-out; } `}</style>
    </div>
  );
};

export default App;