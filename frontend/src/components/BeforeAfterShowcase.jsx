import { ArrowRight, Play, Download, Sparkles } from 'lucide-react';

const BeforeAfterShowcase = () => {
  return (
    <div className="relative mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          See the <span className="holographic-text">Magic</span> in Action
        </h2>
        <p className="text-gray-300 text-lg">Watch ordinary resumes transform into professional masterpieces</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        <div className="relative group">
          <div className="relative transform hover:scale-105 transition-all duration-500">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <img 
                src="https://cdn-images.zety.com/templates/zety/enfold-18-duo-blue-navy-1165@1x.png" 
                alt="Before - Original Resume" 
                className="w-64 h-80 object-cover rounded-lg shadow-2xl"
              />
              
              <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Before
              </div>
              
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
                <div className="text-xs text-gray-300">Basic Format</div>
                <div className="text-sm font-semibold">Standard Layout • Limited Styling</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="transform transition-all duration-1000">
            <div className="relative">
              <ArrowRight className="w-12 h-12 text-purple-400 rotate-90 lg:rotate-0" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl animate-pulse" />
            </div>
          </div>
          
          <div className="absolute top-full mt-4 text-center">
            <div className="text-sm text-purple-300 font-medium">AI Transform</div>
            <div className="text-xs text-gray-400">In seconds</div>
          </div>
        </div>

        <div className="relative group">
          <div className="relative transform hover:scale-105 transition-all duration-500">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <img 
                src="https://res.cloudinary.com/dlthjlibc/image/upload/v1740654640/Screenshot_2025-02-27_160731_dkzmst.png" 
                alt="After - LaTeX Resume" 
                className="w-64 h-80 object-cover rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
              />
              
              <div className="absolute top-2 left-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                After
              </div>
              
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                LaTeX Pro
              </div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex gap-2">
                  <button className="glass-button-sm">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="glass-button-sm">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
                <div className="text-xs text-emerald-300">Professional Format</div>
                <div className="text-sm font-semibold">ATS-Optimized • LaTeX Powered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-12">
        <div className="glass-feature-badge">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>AI-Enhanced</span>
        </div>
        <div className="glass-feature-badge">
          <ArrowRight className="w-4 h-4 text-emerald-400" />
          <span>Instant Transform</span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterShowcase;
