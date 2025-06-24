import { useState, useEffect } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import customAxios from '../config/axios';

const AnimatedTitle = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [count, setCount] = useState(0);
  const title = "ResumeForge";
  const subtitle = "AI-Powered • Professional • Instant";

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await customAxios.get('/api/getcount');
        setCount(response.data.count || 0);
      } catch (error) {
        console.log('API not available, using fallback animation');
        const interval = setInterval(() => {
          setCount(prev => {
            if (prev < 1247) return prev + Math.floor(Math.random() * 8) + 1;
            return 1247;
          });
        }, 50);

        setTimeout(() => clearInterval(interval), 3000);
        return () => clearInterval(interval);
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="text-center mb-12 relative">
      <div className="relative mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="holographic-text text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
            {title.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block animate-text-reveal"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #8b5cf6, #3b82f6)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradient-shift 3s ease-in-out infinite, text-reveal 0.8s ease-out forwards'
                }}
              >
                {char}
              </span>
            ))}
          </div>
          
          <div 
            className="relative group cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Wand2 className="w-8 h-8 text-purple-400 hover:text-purple-300 transition-all duration-300 hover:rotate-12 hover:scale-110" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            
            {showTooltip && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap z-20 animate-fade-in">
                ✨ Magic happens here!
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
              </div>
            )}
          </div>
        </div>

        <div className="text-lg md:text-xl text-blue-200/80 font-medium mb-2 typing-text">
          {subtitle}
        </div>
        
        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Transform your career with AI-powered resume creation. From ordinary PDFs to extraordinary LaTeX masterpieces in seconds.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="glass-card-stats group">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs text-gray-300 font-medium">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">
            96%
          </div>
        </div>

        <div className="glass-card-stats group">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-300 font-medium">Total Processed</span>
          </div>
          <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">
            {count.toLocaleString()}+
          </div>
        </div>

        <div className="glass-card-stats group">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs text-gray-300 font-medium">Avg. Time</span>
          </div>
          <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">
            &lt;30s
          </div>
        </div>
      </div>

      <div className="absolute -top-10 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-float" />
      <div className="absolute -top-5 right-20 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-float-delayed" />
      <div className="absolute top-20 left-1/4 w-12 h-12 bg-emerald-500/20 rounded-full blur-xl animate-bounce-slow" />
    </div>
  );
};

export default AnimatedTitle;
