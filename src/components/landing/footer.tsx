import React from "react";
import Link from "next/link";
import { Shield, Code, Globe, User, Video } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-space-deep border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 bg-cosmic-purple rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(108,43,255,0.5)]">
               <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white">
              Guardians<span className="text-cosmic-purple">.</span>
            </span>
          </Link>
          <p className="text-sm text-text-muted leading-relaxed">
            The next generation won&apos;t just use AI. They&apos;ll build with it. We are mapping the future of creative AI learning for kids and teens.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <Link href="#" className="text-text-muted hover:text-white transition-colors"><Globe className="w-5 h-5"/></Link>
            <Link href="#" className="text-text-muted hover:text-white transition-colors"><Video className="w-5 h-5"/></Link>
            <Link href="#" className="text-text-muted hover:text-white transition-colors"><Code className="w-5 h-5"/></Link>
            <Link href="#" className="text-text-muted hover:text-white transition-colors"><User className="w-5 h-5"/></Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Universe</h4>
                <ul className="space-y-4 text-sm text-text-muted">
                    <li><Link href="#realms" className="hover:text-white transition-colors font-medium">Realms</Link></li>
                    <li><Link href="#how-it-works" className="hover:text-white transition-colors font-medium">Missions</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors font-medium">Avatars</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors font-medium">Guardian Rankings</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Community</h4>
                <ul className="space-y-4 text-sm text-text-muted">
                    <li><Link href="#parents" className="hover:text-white transition-colors font-medium">For Parents</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors font-medium">For Educators</Link></li>
                    <li><Link href="#vision" className="hover:text-white transition-colors font-medium">Manifesto</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors font-medium">Newsroom</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h4>
                <ul className="space-y-4 text-sm text-text-muted">
                    <li><Link href="#" className="hover:text-white transition-colors font-medium">Safety Center</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors font-medium">Privacy Policy</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors font-medium">Terms of Entry</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors font-medium">Contact Us</Link></li>
                </ul>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs text-text-muted font-medium">
            © 2026 Guardians of the Prompt / PromptVerse. All creative rights reserved.
        </p>
        <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted">
            <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                Verse Server Active
            </span>
            <span>Version 1.0.4-Beta</span>
        </div>
      </div>
    </footer>
  );
}
