import { Github, Shield, Heart, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 relative">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-12" />

      <div className="text-center space-y-8">
        <div className="flex flex-wrap justify-center items-center gap-6">
          <a
            href="https://github.com/MandipKumarKanu/resume-craft"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-link group"
          >
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>{" "}
            <span>Open Source</span>
            <div className="absolute inset-0 rounded-full bg-white/5 scale-0 group-hover:scale-100 transition-transform" />
          </a>

          <div className="glass-link">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>Privacy First</span>
          </div>

          <div className="glass-link">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Lightning Fast</span>
          </div>
        </div>

        <div className="glass-card-info max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <h3 className="text-sm font-semibold text-white mb-2">
                Privacy & Security
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Your files are processed securely and automatically deleted
                after{" "}
                <span className="text-emerald-400 font-semibold">
                  1 Hour
                </span>
                . We use end-to-end encryption and never store your personal
                data. Your privacy is our priority.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <span>Crafted with</span>
          <Heart className="w-4 h-4 text-red-400 animate-pulse" />
          <span>by developer, for developers</span>
        </div>

        <div className="text-xs text-gray-500 border-t border-white/10 pt-6">
          <p>&copy; 2025 ResumeForge. All rights reserved.</p>
        </div>
      </div>

      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-96 h-24 bg-gradient-to-t from-purple-500/10 to-transparent blur-3xl" />
    </footer>
  );
};

export default Footer;
