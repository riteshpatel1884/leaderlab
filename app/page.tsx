// 'use client';

// import { useState, useEffect } from 'react';
// import Navbar from './component/navbar/navbar';
// import Footer from './component/footer/footer';
// import Link from 'next/link';

// export default function Home() {
//   const [isDark, setIsDark] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   // Load theme preference on mount
//   useEffect(() => {
//     setMounted(true);
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setIsDark(true);
//     } else if (savedTheme === 'light') {
//       setIsDark(false);
//     } else {
//       // Check system preference if no saved preference
//       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//       setIsDark(prefersDark);
//     }
//   }, []);

//   // Save theme preference whenever it changes
//   useEffect(() => {
//     if (mounted) {
//       localStorage.setItem('theme', isDark ? 'dark' : 'light');
//     }
//   }, [isDark, mounted]);

//   const subjects = [
//     {
//       name: "SQL",
//       icon: "🗄️",
//       color: "from-blue-500 to-cyan-500",
//       description: "Interview-style evaluation · 20 questions",
//       href: "/subjects/sql",
//     },
//     {
//       name: "OOPS",
//       icon: "🎯",
//       color: "from-purple-500 to-pink-500",
//       description: "Coming soon",
//        disabled: true,
//        href: "/subjects/sql",
//     },
//     {
//       name: "Operating Systems",
//       icon: "💻",
//       color: "from-orange-500 to-red-500",
//        description: "Coming soon",
//        disabled: true,
//        href: "/subjects/sql",
//     },
//     {
//       name: "Computer Networks",
//       icon: "🌐",
//       color: "from-green-500 to-emerald-500",
//       description: "Coming soon",
//        disabled: true,
//        href: "/subjects/sql",
//     },
//     {
//       name: "DSA (Logic)",
//       icon: "🧮",
//       color: "from-yellow-500 to-orange-500",
//       description: "Coming soon",
//        disabled: true,
//        href: "/subjects/sql",
//     },
//     {
//       name: "System Design",
//       icon: "🏗️",
//       color: "from-slate-600 to-slate-700",
//       description: "Coming soon",
//       disabled: true,
//       href: "/subjects/sql",
//     },
//   ];

//   // Prevent flash of wrong theme
//   if (!mounted) {
//     return null;
//   }

//   return (
//     <div className={isDark ? 'dark' : ''}>
//       <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-500 font-sans selection:bg-brand-primary selection:text-white overflow-x-hidden">
        
//         <Navbar/>

//         {/* Hero Section */}
//         <section className="pt-30 px-6 relative">
//           <div className="max-w-6xl mx-auto text-center relative z-10">
//             <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05]">
//               Stop practicing in <br/>
//               <span className="relative inline-block">
//                 <span className="text-brand-primary">
//                   silence.
//                 </span>
//                 <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M2 10C50 2 100 2 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-brand-primary"/>
//                 </svg>
//               </span>
//             </h1>
            
//             <p className="text-xl md:text-2xl lg:text-3xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed font-light">
//               Write your answer, explain your logic, and get the <span className="text-text-primary font-semibold underline decoration-brand-primary/50 decoration-2 underline-offset-4">brutal feedback</span> your friends are too nice to give you.
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//              <Link href="/subjects/sql">
//               <button className="group px-8 cursor-pointer py-5 bg-brand-primary text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-brand-primary/30 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3">
//                 Start Free Evaluation
//                 <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                 </svg>
//               </button></Link>
//               <Link href="#">
//               <button className="group cursor-pointer px-8 py-5 bg-surface border-2 border-border-subtle hover:border-brand-primary/50 text-text-primary rounded-2xl font-semibold text-lg hover:bg-bg-secondary transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3">
//                 <svg className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                 </svg>
//                 See Example Report
//               </button></Link>
//             </div>
//           </div>

//           {/* Animated Background Grid */}
//           <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]"></div>
//         </section>

//         {/* Advanced Feedback Visualization Section */}
//         <section id="features" className="py-32 px-6 pt-15 bg-gradient-to-b from-transparent via-bg-secondary/50 to-transparent">
//           <div className="max-w-7xl mx-auto">
//             <div className="text-center mb-20">
//               <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
//                 See exactly <span className="text-brand-primary">what's wrong</span>
//               </h2>
//               <p className="text-xl text-text-secondary max-w-2xl mx-auto">
//                 Not just "correct" or "incorrect". Get granular analysis of every weak point in your explanation.
//               </p>
//             </div>

//             {/* Interactive Feedback Demo */}
//             <div className="grid lg:grid-cols-2 gap-8 items-start">
//               {/* Left: User Answer Simulation */}
//               <div className="bg-surface border border-border-subtle rounded-3xl p-8 shadow-2xl hover:shadow-brand-primary/10 transition-all">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
//                       Q
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-lg">Your Answer</h3>
//                       <p className="text-xs text-text-secondary">SQL - Database Normalization</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-bg-secondary rounded-2xl p-6 mb-6 border-2 border-border-subtle">
//                   <p className="text-text-primary leading-relaxed mb-4">
//                     "Normalization is when you <span className="bg-yellow-200 dark:bg-yellow-900/40 px-1 rounded">organize database tables</span> to reduce redundancy. It helps with <span className="bg-yellow-200 dark:bg-yellow-900/40 px-1 rounded">data integrity</span>."
//                   </p>
//                   <div className="flex items-center gap-2 text-xs text-text-secondary">
//                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Submitted 2 seconds ago
//                   </div>
//                 </div>

//                 {/* Analysis Indicators */}
//                 <div className="space-y-3">
//                 </div>
//               </div>

//               {/* Right: Detailed Feedback */}
//               <div className="space-y-4">
//                 {/* Good Point */}
//                 <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-2 border-green-200 dark:border-green-800/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-green-500/10 transition-all group">
//                   <div className="flex items-start gap-4">
//                     <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
//                       <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <h4 className="font-bold text-green-900 dark:text-green-200">Strong Start</h4>
//                         <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold">GOOD</span>
//                       </div>
//                       <p className="text-green-800 dark:text-green-300 text-sm leading-relaxed">
//                         You correctly identified <strong>data integrity</strong> as a key benefit. This shows you understand the "why" behind normalization.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Warning Issue */}
//                 <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10 border-2 border-orange-200 dark:border-orange-800/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-orange-500/10 transition-all group">
//                   <div className="flex items-start gap-4 mb-4">
//                     <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
//                       <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <h4 className="font-bold text-orange-900 dark:text-orange-200">Weak Explanation</h4>
//                         <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold">IMPROVE</span>
//                       </div>
//                       <p className="text-orange-800 dark:text-orange-300 text-sm leading-relaxed mb-3">
//                         "Organize database tables" is too vague. Interviewers want <strong>specific mechanisms</strong>.
//                       </p>
//                       <div className="bg-white/50 dark:bg-orange-950/50 rounded-xl p-3 border border-orange-300 dark:border-orange-700">
//                         <p className="text-xs font-semibold text-orange-900 dark:text-orange-200 mb-1">💡 Be specific:</p>
//                         <p className="text-xs text-orange-800 dark:text-orange-300">"Split tables based on functional dependencies to eliminate redundancy."</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Critical Issue */}
//                 <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/10 border-2 border-red-200 dark:border-red-800/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-red-500/10 transition-all group">
//                   <div className="flex items-start gap-4 mb-4">
//                     <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
//                       <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <h4 className="font-bold text-red-900 dark:text-red-200">Critical Gap</h4>
//                         <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">MUST FIX</span>
//                       </div>
//                       <p className="text-red-800 dark:text-red-300 text-sm leading-relaxed mb-3">
//                         You didn't specify any <strong>normal forms (1NF, 2NF, 3NF, BCNF). </strong> An interviewer would immediately ask which one.
//                       </p>
//                       <div className="bg-white/50 dark:bg-red-950/50 rounded-xl p-3 border border-red-300 dark:border-red-700">
//                         <p className="text-xs font-semibold text-red-900 dark:text-red-200 mb-1">💡 What to add:</p>
//                         <p className="text-xs text-red-800 dark:text-red-300">"Specifically, 1NF eliminates repeating groups, 2NF removes partial dependencies, and 3NF removes transitive dependencies."</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Bento Grid Features */}
//         <section id="how-it-works" className="py-24 px-6 pt-0">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-16">
//               <h2 className="text-4xl md:text-6xl font-extrabold mb-6">Get judged. <span className="text-brand-primary">Fix it. Repeat.</span></h2>  
//               <p className="text-text-secondary text-xl">From explanation to correction.</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {/* Card 1 */}
//               <div className="md:col-span-2 bg-surface p-8 rounded-3xl border border-border-subtle shadow-sm hover:shadow-xl hover:border-brand-primary/30 transition-all group">
//                 <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all">
//                   <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-2xl font-bold mb-3">Open-Ended Input</h3>
//                 <p className="text-text-secondary text-lg leading-relaxed">
//                   No multiple choice. No hints. You get a text box and a cursor. You write your explanation exactly how you would say it in the room. This tests <strong className="text-text-primary">recall, not recognition</strong>.
//                 </p>
//               </div>

//               {/* Card 2 */}
//               <div className="md:row-span-2 bg-surface p-8 rounded-3xl border border-border-subtle shadow-sm hover:shadow-xl hover:border-brand-primary/30 transition-all group">
//                 <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all">
//                   <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-2xl font-bold mb-3">What gets evaluated</h3>
//                 <p className="text-text-secondary text-lg mb-6 leading-relaxed">
//                  Your explanation is judged the way interviewers judge it.
//                 </p>
//                 <ul className="space-y-4">
//                   {[
//                     { icon: '🎯', label: 'Conceptual Clarity', color: 'blue' },
//                     { icon: '🔍', label: 'Missing Edge Cases', color: 'purple' },
//                     { icon: '✂️', label: 'Unnecessary Fluff', color: 'orange' },
//                     { icon: '💪', label: 'Weak or vague reasoning', color: 'red' }
//                   ].map((item) => (
//                     <li key={item.label} className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
//                       <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center text-sm">
//                         {item.icon}
//                       </div>
//                       <span className="text-text-primary font-semibold">{item.label}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Card 3 */}
//               <div className="bg-surface p-8 rounded-3xl border border-border-subtle shadow-sm hover:shadow-xl hover:border-brand-primary/30 transition-all group">
//                 <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all">
//                   <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-2xl font-bold mb-3">Clarity under pressure</h3>
//                 <p className="text-text-secondary leading-relaxed">
//                   Pressure exposes what you don't fully understand.
//                 </p>
//               </div>

//               {/* Card 4 */}
//               <div className="bg-surface p-8 rounded-3xl border border-border-subtle shadow-sm hover:shadow-xl hover:border-brand-primary/30 transition-all group">
//                 <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all">
//                   <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-2xl font-bold mb-3">Subject Mastery</h3>
//                 <p className="text-text-secondary leading-relaxed">
//                   Core interview subjects, starting with fundamentals like SQL and OOPS.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Subjects Section */}
//         <section id="subjects" className="py-24 pt-0 px-6 bg-bg-secondary/30">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-16">
//               <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
//                 Core <span className="text-brand-primary">Interview Subjects.</span>
//               </h2>
//               <p className="text-text-secondary text-xl">
//                 The areas interviews expose first
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {subjects.map((subject) => {
//                 const Card = (
//                   <div
//                     className={`group bg-surface border border-border-subtle rounded-3xl p-8 transition-all
//                       ${
//                         subject.disabled
//                           ? "opacity-60 cursor-not-allowed"
//                           : "hover:shadow-2xl hover:border-brand-primary/30 hover:-translate-y-1"
//                       }
//                     `}
//                   >
//                     <div
//                       className={`w-16 h-16 bg-gradient-to-br ${subject.color}
//                         rounded-2xl flex items-center justify-center text-3xl mb-4 transition-all
//                         ${subject.disabled ? "" : "group-hover:scale-110 group-hover:rotate-6"}
//                       `}
//                     >
//                       {subject.icon}
//                     </div>

//                     <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>

//                     <p className="text-text-secondary text-sm mb-4">
//                       {subject.description}
//                     </p>

//                     {!subject.disabled && (
//                       <span className="text-brand-primary font-semibold text-sm flex items-center gap-2">
//                         See where you're weak
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M13 7l5 5m0 0l-5 5m5-5H6"
//                           />
//                         </svg>
//                       </span>
//                     )}
//                   </div>
//                 );

//                 if (subject.disabled) {
//                   return <div key={subject.name}>{Card}</div>;
//                 }

//                 return (
//                   <Link key={subject.name} href={subject.href} className="block">
//                     {Card}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="py-32 px-6 pt-0">
//           <div className="max-w-4xl mx-auto text-center">
//             <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-1 rounded-[3rem] shadow-2xl">
//               <div className="bg-surface rounded-[2.85rem] py-20 px-6 sm:px-12 border border-border-subtle relative overflow-hidden">
                
//                 <div className="relative z-10">
//                   {/* <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-bold mb-6 border border-white/20">
//                     INSTANT EVALUATION
//                   </div> */}
//                   <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
//                     Ready to get brutally honest <span className="bg-clip-text text-brand-primary  bg-gradient-to-r from-brand-primary  to-brand-secondary">feedback?</span>
//                   </h2>
//                   <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
//                    Better to fail here than in a real interview room.
//                   </p>
//                   <Link href="/get-started" > 
//                   <button className="group cursor-pointer px-12 py-6 bg-brand-primary text-white rounded-full font-extrabold text-xl hover:shadow-2xl hover:shadow-brand-primary/40 hover:scale-105 transition-all inline-flex items-center gap-3">
//                    Find out what you’d get rejected for.
//                     <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                     </svg>
//                   </button>
//                   </Link>
//                 </div>

//                 {/* Decorative Elements */}
//                 <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
//                 <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <Footer />

//       </div>

//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

//         :root {
//           --color-bg-primary: #FFFFFF;
//           --color-bg-secondary: #F4F6F8;
//           --color-surface: #FFFFFF;
          
//           --color-text-primary: #0F172A;
//           --color-text-secondary: #64748B;
          
//           --color-brand-primary: #4F46E5;
//           --color-brand-secondary: #818CF8;
          
//           --color-border-subtle: #E2E8F0;
//         }

//         .dark {
//           --color-bg-primary: #0B0F19;
//           --color-bg-secondary: #111827;
//           --color-surface: #171E2E;
          
//           --color-text-primary: #F8FAFC;
//           --color-text-secondary: #94A3B8;
          
//           --color-brand-primary: #6366F1;
//           --color-brand-secondary: #A5B4FC;
          
//           --color-border-subtle: #2D3748;
//         }

//         .bg-bg-primary { background-color: var(--color-bg-primary); }
//         .bg-bg-secondary { background-color: var(--color-bg-secondary); }
//         .bg-surface { background-color: var(--color-surface); }
        
//         .text-text-primary { color: var(--color-text-primary); }
//         .text-text-secondary { color: var(--color-text-secondary); }
//         .text-brand-primary { color: var(--color-brand-primary); }
        
//         .bg-brand-primary { background-color: var(--color-brand-primary); }
        
//         .border-border-subtle { border-color: var(--color-border-subtle); }
        
//         .from-brand-primary { --tw-gradient-from: var(--color-brand-primary); }
//         .to-brand-secondary { --tw-gradient-to: var(--color-brand-secondary); }

//         body {
//           font-family: 'Plus Jakarta Sans', sans-serif;
//         }

//         @keyframes gradient {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }

//         .animate-gradient {
//           animation: gradient 3s ease infinite;
//         }

//         ::-webkit-scrollbar {
//           width: 8px;
//         }
//         ::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         ::-webkit-scrollbar-thumb {
//           background-color: var(--color-text-secondary);
//           opacity: 0.2;
//           border-radius: 20px;
//           border: 3px solid transparent;
//           background-clip: content-box;
//         }
//         ::-webkit-scrollbar-thumb:hover {
//           background-color: var(--color-brand-primary);
//         }

//         html {
//           scroll-behavior: smooth;
//         }
//       `}</style>
//     </div>
//   );
// }



'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Navbar from './component/navbar/navbar';
import Footer from './component/footer/footer';
import Link from 'next/link';
// Import Server Actions
import { submitFeedback,submitContribution,submitIssue } from './action';

// --- TYPES ---
interface Subject {
  name: string;
  icon: string;
  color: string;
  description: string;
  href: string;
  disabled?: boolean;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

// --- TOAST COMPONENT ---
const Toast = ({ show, message, type, onClose }: ToastState & { onClose: () => void }) => {
  if (!show) return null;

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-top-4 duration-300 border ${
      type === 'success' 
        ? 'bg-surface border-green-500/50 text-green-600 dark:text-green-400' 
        : 'bg-surface border-red-500/50 text-red-600 dark:text-red-400'
    }`}>
      {type === 'success' ? (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <p className="font-semibold">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// --- INTERACTION WIDGET ---
const InteractionWidget = ({ subjects }: { subjects: Subject[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'menu' | 'feedback' | 'issue' | 'contribution'>('menu');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Reset view when closing
  useEffect(() => {
    if (!isOpen) setActiveView('menu');
  }, [isOpen]);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const issueTypes = [
    { label: "Technical Bug", value: "TECHNICAL_BUG" },
    { label: "Question Error", value: "QUESTION_ERROR" },
    { label: "UI/UX Problem", value: "UI_UX_PROBLEM" },
    { label: "Evaluation Issue", value: "EVALUATION_ISSUE" },
    { label: "Other", value: "OTHER" }
  ];

  // Generic Submit Handler connecting to Server Actions
  const handleGenericSubmit = async (e: FormEvent<HTMLFormElement>, actionType: 'feedback' | 'issue' | 'contribution') => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    let result;

    try {
      if (actionType === 'feedback') result = await submitFeedback(formData);
      else if (actionType === 'issue') result = await submitIssue(formData);
      else if (actionType === 'contribution') result = await submitContribution(formData);
      
      if (result && result.success) {
        setToast({ show: true, message: result.message, type: 'success' });
        setIsOpen(false); // Close modal on success
      } else {
        setToast({ show: true, message: result?.message || "Something went wrong", type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: "Network error occurred", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast {...toast} onClose={() => setToast(prev => ({ ...prev, show: false }))} />

      {/* Floating Action Button */}
      <button 
        onClick={toggleOpen}
        className={`fixed bottom-6 cursor-pointer right-6 z-40 p-4 bg-brand-primary text-white rounded-full shadow-2xl hover:scale-110 hover:shadow-brand-primary/50 transition-all duration-300 group ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-surface text-text-primary text-xs font-bold rounded-lg border border-border-subtle opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Feedback & Support
        </span>
      </button>

      {/* Centered Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="bg-surface border border-border-subtle rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-bg-secondary p-5 flex items-center justify-between border-b border-border-subtle">
              <h3 className="font-bold text-xl text-text-primary flex items-center gap-2">
                {activeView === 'menu' && 'How can we help?'}
                {activeView === 'feedback' && 'Share Feedback'}
                {activeView === 'issue' && 'Report an Issue'}
                {activeView === 'contribution' && 'Contribute Question'}
              </h3>
              <div className="flex gap-2">
                {activeView !== 'menu' && (
                  <button onClick={() => setActiveView('menu')} className="text-text-secondary hover:text-text-primary text-sm font-semibold px-3 py-1.5 rounded-lg bg-bg-primary border border-border-subtle hover:bg-bg-secondary transition-colors">
                    Back
                  </button>
                )}
                <button onClick={toggleOpen} className="p-1.5  rounded-full hover:bg-bg-primary text-text-secondary hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              
              {/* MENU VIEW */}
              {activeView === 'menu' && (
                <div className="space-y-4">
                  <button onClick={() => setActiveView('feedback')} className="w-full cursor-pointer flex items-center gap-5 p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-brand-primary/50 hover:bg-bg-primary transition-all group text-left">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-sm">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-text-primary">Give Feedback</div>
                      <div className="text-sm text-text-secondary">Share your thoughts or suggestions</div>
                    </div>
                  </button>

                  <button onClick={() => setActiveView('issue')} className="w-full cursor-pointer flex items-center gap-5 p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-brand-primary/50 hover:bg-bg-primary transition-all group text-left">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform shadow-sm">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-text-primary">Report Issue</div>
                      <div className="text-sm text-text-secondary">Flag bugs, errors, or typos</div>
                    </div>
                  </button>

                  <button onClick={() => setActiveView('contribution')} className="w-full cursor-pointer flex items-center gap-5 p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-brand-primary/50 hover:bg-bg-primary transition-all group text-left">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform shadow-sm">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-text-primary">Contribute</div>
                      <div className="text-sm text-text-secondary">Submit a new question to the library</div>
                    </div>
                  </button>
                </div>
              )}

              {/* FEEDBACK FORM */}
              {activeView === 'feedback' && (
                <form onSubmit={(e) => handleGenericSubmit(e, 'feedback')} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Your Message</label>
                    <textarea 
                      name="feedback"
                      required
                      className="w-full h-40 bg-bg-primary border border-border-subtle rounded-xl p-4 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none text-base"
                      placeholder="Tell us what you think..."
                    ></textarea>
                  </div>
                  <button disabled={isLoading} className="w-full cursor-pointer py-4 bg-brand-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait">
                    {isLoading ? 'Sending...' : 'Send Feedback'}
                    {!isLoading && (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </form>
              )}

              {/* ISSUE FORM */}
              {activeView === 'issue' && (
                <form onSubmit={(e) => handleGenericSubmit(e, 'issue')} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Issue Type</label>
                    <select 
                      name="issueType"
                      required
                      defaultValue=""
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl p-4 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all appearance-none cursor-pointer text-base"
                    >
                      <option value="" disabled>Select an issue type...</option>
                      {issueTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Description</label>
                    <textarea 
                      name="description"
                      required
                      className="w-full h-32 bg-bg-primary border border-border-subtle rounded-xl p-4 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none text-base"
                      placeholder="Describe what happened..."
                    ></textarea>
                  </div>
                  <button disabled={isLoading} className="w-full cursor-pointer py-4 bg-brand-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-wait">
                    {isLoading ? 'Submitting...' : 'Submit Report'}
                  </button>
                </form>
              )}

              {/* CONTRIBUTION FORM */}
              {activeView === 'contribution' && (
                <form onSubmit={(e) => handleGenericSubmit(e, 'contribution')} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text"
                      name="fullName"
                      required
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl p-4 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-base"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Subject</label>
                    <select 
                      name="subjectId"
                      required
                      defaultValue=""
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl p-4 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all appearance-none cursor-pointer text-base"
                    >
                      <option value="" disabled>Select Subject...</option>
                      {/* Show ALL subjects, even disabled ones, so people can contribute */}
                      {subjects.map((s: Subject) => (
                        <option key={s.name} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Resource Link</label>
                    <input 
                      type="url"
                      name="link"
                      required
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl p-4 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-base"
                      placeholder="https://..."
                    />
                  </div>
                  <button disabled={isLoading} className="w-full cursor-pointer py-4 bg-brand-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-wait">
                     {isLoading ? 'Submitting...' : 'Submit Contribution'}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};
// --- END INTERACTION WIDGET ---

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    } else if (savedTheme === 'light') {
      setIsDark(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, mounted]);

  const subjects: Subject[] = [
    {
      name: "SQL",
      icon: "🗄️",
      color: "from-blue-500 to-cyan-500",
      description: "Interview-style evaluation · 20 questions",
      href: "/subjects/sql",
    },
    {
      name: "OOPS",
      icon: "🎯",
      color: "from-purple-500 to-pink-500",
      description: "Coming soon",
       disabled: true,
       href: "/subjects/oops",
    },
    {
      name: "Operating Systems",
      icon: "💻",
      color: "from-orange-500 to-red-500",
       description: "Coming soon",
       disabled: true,
       href: "/subjects/os",
    },
    {
      name: "Computer Networks",
      icon: "🌐",
      color: "from-green-500 to-emerald-500",
      description: "Coming soon",
       disabled: true,
       href: "/subjects/cn",
    },
    {
      name: "DSA (Logic)",
      icon: "🧮",
      color: "from-yellow-500 to-orange-500",
      description: "Coming soon",
       disabled: true,
       href: "/subjects/dsa",
    },
    {
      name: "System Design",
      icon: "🏗️",
      color: "from-slate-600 to-slate-700",
      description: "Coming soon",
      disabled: true,
      href: "/subjects/system-design",
    },
  ];

  if (!mounted) return null;

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-500 font-sans selection:bg-brand-primary selection:text-white overflow-x-hidden relative">
        <Navbar/>
        
        {/* Hero Section */}
        <section className="pt-30 px-6 relative">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05]">
              Stop practicing in <br/>
              <span className="relative inline-block">
                <span className="text-brand-primary">
                  silence.
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C50 2 100 2 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-brand-primary"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Write your answer, explain your logic, and get the <span className="text-text-primary font-semibold underline decoration-brand-primary/50 decoration-2 underline-offset-4">brutal feedback</span> your friends are too nice to give you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Link href="/subjects/sql">
              <button className="group px-8 cursor-pointer py-5 bg-brand-primary text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-brand-primary/30 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3">
                Start Free Evaluation
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button></Link>
              <Link href="#">
              <button className="group cursor-pointer px-8 py-5 bg-surface border-2 border-border-subtle hover:border-brand-primary/50 text-text-primary rounded-2xl font-semibold text-lg hover:bg-bg-secondary transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3">
                <svg className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                See Example Report
              </button></Link>
            </div>
          </div>

          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]"></div>
        </section>

       

        {/* Subjects Grid */}
        <section id="subjects" className="py-24 pt-10 px-6 bg-bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Core <span className="text-brand-primary">Interview Subjects.</span></h2>
              <p className="text-text-secondary text-xl">The areas interviews expose first</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div key={subject.name} className={`group bg-surface border border-border-subtle rounded-3xl p-8 transition-all ${subject.disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-2xl hover:border-brand-primary/30 hover:-translate-y-1"}`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center text-3xl mb-4 transition-all ${!subject.disabled && "group-hover:scale-110 group-hover:rotate-6"}`}>{subject.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
                  <p className="text-text-secondary text-sm mb-4">{subject.description}</p>
                  {!subject.disabled && (
                     <Link href={subject.href} className="text-brand-primary font-semibold text-sm flex items-center gap-2">
                        See where you're weak <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                     </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 pt-0">
           <div className="max-w-4xl mx-auto text-center">
             <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-1 rounded-[3rem] shadow-2xl">
               <div className="bg-surface rounded-[2.85rem] py-20 px-6 sm:px-12 border border-border-subtle">
                 <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Ready to get brutally honest feedback?</h2>
                 <Link href="/get-started">
                   <button className="px-12 py-6 bg-brand-primary text-white rounded-full font-extrabold text-xl hover:shadow-2xl hover:scale-105 transition-all">Find out what you’d get rejected for.</button>
                 </Link>
               </div>
             </div>
           </div>
        </section>

        <Footer />
        <InteractionWidget subjects={subjects} />
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        :root {
          --color-bg-primary: #FFFFFF;
          --color-bg-secondary: #F4F6F8;
          --color-surface: #FFFFFF;
          --color-text-primary: #0F172A;
          --color-text-secondary: #64748B;
          --color-brand-primary: #4F46E5;
          --color-brand-secondary: #818CF8;
          --color-border-subtle: #E2E8F0;
        }
        .dark {
          --color-bg-primary: #0B0F19;
          --color-bg-secondary: #111827;
          --color-surface: #171E2E;
          --color-text-primary: #F8FAFC;
          --color-text-secondary: #94A3B8;
          --color-brand-primary: #6366F1;
          --color-brand-secondary: #A5B4FC;
          --color-border-subtle: #2D3748;
        }
        .bg-bg-primary { background-color: var(--color-bg-primary); }
        .bg-bg-secondary { background-color: var(--color-bg-secondary); }
        .bg-surface { background-color: var(--color-surface); }
        .text-text-primary { color: var(--color-text-primary); }
        .text-text-secondary { color: var(--color-text-secondary); }
        .text-brand-primary { color: var(--color-brand-primary); }
        .bg-brand-primary { background-color: var(--color-brand-primary); }
        .border-border-subtle { border-color: var(--color-border-subtle); }
        .from-brand-primary { --tw-gradient-from: var(--color-brand-primary); }
        .to-brand-secondary { --tw-gradient-to: var(--color-brand-secondary); }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}