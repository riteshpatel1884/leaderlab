'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-primary/30">
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
                <a 
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group shadow-sm hover:shadow-lg hover:shadow-indigo-500/10"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-semibold text-sm">Back to Home</span>
        </a>
            </div>
            
          </div>
        </div>
      </div>
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24">
        {/* Hero Section */}
        <section className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            The <span className="text-brand-primary italic">Illusion</span> of <br />
            Competence.
          </h1>
          
          <div className="space-y-6 text-xl md:text-2xl text-zinc-400 font-light leading-relaxed">
            <p>
              Reading answers feels productive. <br className="hidden md:block" />
              Watching tutorials feels productive.
            </p>
            <p className="text-white font-medium">
              But interviews don’t care what looks familiar to you - they care what you can <span className="text-brand-primary underline underline-offset-8">explain clearly</span>, under pressure.
            </p>
          </div>
        </section>

        {/* The Gap Section */}
        <section className="mt-32">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-20" />
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-brand-primary font-bold mb-4">
                The Mission
              </h2>
              <p className="text-3xl font-semibold leading-snug">
                LeaderLab exists to fix that gap.
              </p>
            </div>
            <div className="space-y-6 text-zinc-400">
              <p className="text-lg">
                This platform was built around a simple belief:
              </p>
              <blockquote className="text-2xl text-white font-bold border-l-4 border-brand-primary pl-6 py-2">
                "If you can’t explain it, you don’t understand it well enough."
              </blockquote>
            </div>
          </div>
        </section>

        {/* The Difference Section */}
        <section className="mt-32 bg-zinc-900/40 border border-zinc-800 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">How we operate</h2>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              LeaderLab doesn’t give you multiple-choice shortcuts or instant solutions. 
              It asks you to write real answers, the same way you would in an interview - 
              and then evaluates them the way interviewers do.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Not politely.', 'Not generously.', 'Honestly.'].map((word, i) => (
                <div 
                  key={word}
                  className={`p-4 rounded-xl text-center font-bold text-lg ${
                    i === 2 ? 'bg-brand-primary text-white' : 'bg-zinc-800/50 text-zinc-300'
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="mt-32 text-center space-y-8">
          <p className="text-zinc-500 font-medium">Ready to stop pretending and start practicing?</p>
          <a href="/subjects/sql"><button className="px-8 cursor-pointer py-4 bg-white text-black rounded-full font-bold hover:bg-brand-primary hover:text-white hover:bg-zinc-900/40 transition-all duration-300 transform hover:scale-105">
            Start Your First Lab
          </button></a>
        </footer>
      </main>
    </div>
  );
};

export default AboutPage;