// hooks/useAnalytics.ts
import { useEffect, useRef } from 'react';

interface VisitData {
  url: string;
  referrer?: string;
  user_agent?: string;
}

export const useAnalytics = (url: string) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    
    const trackVisit = async () => {
      try {
        const visitData: VisitData = {
          url: url,
          referrer: document.referrer || undefined,
          user_agent: navigator.userAgent,
        };

        const response = await fetch('http://localhost:8000/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData),
        });

        const data = await response.json();
        
        if (data.success || data.message === "Logged") {
          console.log('✅ Visit tracked successfully');
          hasTracked.current = true;
        } else {
          console.error('❌ Failed to track visit:', data.message);
        }
      } catch (error) {
        console.error('❌ Failed to track visit:', error);
      }
    };

    trackVisit();
  }, [url]);
};