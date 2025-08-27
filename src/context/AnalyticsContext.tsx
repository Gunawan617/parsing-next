"use client";
"use client";
// contexts/AnalyticsContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface AnalyticsContextType {
  trackPageView: (url: string) => Promise<void>;
  trackEvent: (eventName: string, data?: any) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const trackPageView = async (url: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          referrer: document.referrer || undefined,
          user_agent: navigator.userAgent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('✅ Page view tracked:', url);
      }
    } catch (error) {
      console.error('❌ Failed to track page view:', error);
    }
  };

  const trackEvent = async (eventName: string, data?: any) => {
    console.log('📊 Event tracked:', eventName, data);
    // Bisa ditambahkan ke API analytics nanti
  };

  return (
    <AnalyticsContext.Provider value={{ trackPageView, trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};