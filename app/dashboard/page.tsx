'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/details');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
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
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-brand-primary/50"
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Welcome back, {user?.firstName || user?.username || 'User'}! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Continue Learning Card */}
          <a href="/subjects" className="group">
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Continue Learning</h3>
              <p className="text-gray-400">Browse subjects and practice questions</p>
            </div>
          </a>

          {/* View Stats Card */}
          <button 
            onClick={fetchUserDetails}
            className="group text-left"
            disabled={loading}
          >
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {loading ? 'Loading...' : 'View My Stats'}
              </h3>
              <p className="text-gray-400">Check your progress and achievements</p>
            </div>
          </button>

          {/* Practice Card */}
          <a href="/subjects/sql" className="group">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quick Practice</h3>
              <p className="text-gray-400">Jump into a random SQL question</p>
            </div>
          </a>
        </div>

        {/* User Details Section - Only shown after fetching */}
        {userData && (
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Your Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Solved */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm font-medium">Total Solved</span>
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white">{userData.totalSolved || 0}</p>
              </div>

              {/* Total Failed */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm font-medium">Total Failed</span>
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white">{userData.totalFailed || 0}</p>
              </div>

              {/* Success Rate */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm font-medium">Success Rate</span>
                  <svg className="w-5 h-5 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white">
                  {userData.totalSolved + userData.totalFailed > 0
                    ? Math.round((userData.totalSolved / (userData.totalSolved + userData.totalFailed)) * 100)
                    : 0}%
                </p>
              </div>

              {/* Member Since */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm font-medium">Member Since</span>
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-white">
                  {new Date(userData.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Subject Progress */}
            {userData.subjectProgress && userData.subjectProgress.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Subject Progress</h3>
                <div className="space-y-4">
                  {userData.subjectProgress.map((subject: any) => (
                    <div key={subject.name} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">{subject.name}</span>
                        <span className="text-gray-400 text-sm">
                          {subject.solved} solved · {subject.failed} failed
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-brand-primary h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${subject.solved + subject.failed > 0 
                              ? (subject.solved / (subject.solved + subject.failed)) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}