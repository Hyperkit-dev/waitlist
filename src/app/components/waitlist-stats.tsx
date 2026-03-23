'use client';

import React, { useEffect, useState } from 'react';
import { Users, CheckCircle2, Clock } from 'lucide-react';

interface Stats {
  total: number;
  confirmed: number;
  pending: number;
}

export default function WaitlistStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 1 hour (3600000ms)
    const interval = setInterval(fetchStats, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#0e0e11] border border-white/10 rounded-xl p-6 animate-pulse"
            >
              <div className="h-4 bg-slate-700 rounded w-20 mb-3"></div>
              <div className="h-8 bg-slate-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return null; // Silently fail - don't show error to users
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const statsItems = [
    {
      label: 'Total Joined',
      value: stats.total,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      label: 'Confirmed',
      value: stats.confirmed,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto mt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {statsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`bg-[#0e0e11] border ${item.borderColor} rounded-xl p-4 sm:p-5 transition-all hover:border-opacity-50 hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className={`text-2xl font-semibold ${item.color}`}>
                    {formatNumber(item.value)}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xs text-slate-500">
                  {item.value.toLocaleString()} {item.label.toLowerCase()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

