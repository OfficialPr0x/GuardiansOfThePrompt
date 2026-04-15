"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Globe, Rocket, ShieldCheck, Zap } from "lucide-react";

export function HowItWorks() {
  const steps = [
    { title: "Enter the Verse", desc: "Choose your identity, explore worlds, and meet your AI companion.", icon: Globe },
    { title: "Start Missions", desc: "Short, rewarding tasks that produce visible creative outcomes.", icon: Rocket },
    { title: "Build & Create", desc: "Generate stories, designs, worlds, prototypes, and digital tools.", icon: Zap },
    { title: "Unlock Abilities", desc: "Earn XP, badges, and tools as you master AI command.", icon: ShieldCheck },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-space-surface/50 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Learning that feels like play.</h2>
          <p className="text-text-muted">A structured path from beginner to digital creator.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative p-8 glass-panel text-center group"
            >
              <div className="w-16 h-16 bg-cosmic-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-cosmic-purple/20 transition-colors">
                <step.icon className="w-8 h-8 text-cosmic-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-text-muted">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="text-white/20 w-8 h-8" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyItMatters() {
  return (
    <section id="vision" className="py-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h2 className="text-5xl md:text-6xl font-black text-white mb-8 border-b border-white/10 pb-8">
                    The future belongs to creators who <span className="text-neon-pink">understand AI.</span>
                </h2>
                <p className="text-xl text-text-muted leading-relaxed">
                    Tomorrow&apos;s leaders won&apos;t just consume technology. They&apos;ll know how to direct it, question it, shape it, and build with it. PromptVerse helps young people develop that mindset early—through creativity, confidence, and guided experimentation.
                </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {["Creative confidence", "AI literacy", "Digital fluency", "Builder mindset", "Future readiness"].map((pill) => (
                    <div key={pill} className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/80">
                        {pill}
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
}

export function TrustSection() {
    const cards = [
        { title: "Creative over passive", desc: "Kids create, design, and solve—not endlessly scroll through content." },
        { title: "Guided learning", desc: "Structured missions create momentum and confidence without overwhelm." },
        { title: "Skill-building", desc: "Direct training in storytelling, systems thinking, and digital fluency." },
        { title: "Safe progression", desc: "Age-sensitive content design and moderated pathways through the verse." },
    ];

    return (
        <section id="parents" className="py-24 bg-space-deep relative px-6">
            <div className="max-w-7xl mx-auto glass-panel p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 blur-[100px]" />
                <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-neon-blue font-bold uppercase tracking-widest text-sm mb-4 block">Responsibility First</span>
                        <h2 className="text-4xl font-bold text-white mb-6">Built for imagination. <br/>Designed with safety.</h2>
                        <p className="text-text-muted mb-8">We believe technology should be an empowering force. Our platform is built from the ground up to encourage active creation over passive consumption.</p>
                        <div className="space-y-4">
                            {["Built for youth creativity", "Designed for future-ready learning", "Encourages active use of technology"].map(t => (
                                <div key={t} className="flex items-center gap-3 text-white/80 font-medium">
                                    <CheckCircle2 className="text-neon-blue w-5 h-5" />
                                    <span>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cards.map((c, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-colors">
                                <h4 className="text-white font-bold mb-2">{c.title}</h4>
                                <p className="text-xs text-text-muted">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Manifesto() {
    return (
        <section className="py-40 text-center relative px-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <div className="absolute -inset-10 bg-cosmic-purple/10 blur-[120px] rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-12 relative z-10">
                        We are building the next generation of <br/>
                        <span className="text-cosmic-purple italic underline underline-offset-8">AI-native creators.</span>
                    </h2>
                    <div className="space-y-6 text-xl text-text-muted/80 font-medium relative z-10">
                        <p>Most kids are being handed the most powerful tools in history with no map.</p>
                        <p className="text-white font-bold text-2xl">PromptVerse is that map.</p>
                        <p>We believe creativity should be discoverable. <br/> Technology should empower imagination.</p>
                        <p className="text-neon-pink">This is where future guardians begin.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export function CTASection() {
    return (
        <section id="join" className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-5xl mx-auto glass-panel-glow p-12 md:p-20 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cosmic-purple to-transparent opacity-50" />
                
                <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Enter the PromptVerse</h2>
                <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto">
                    Be among the first families, creators, and educators to explore a new kind of AI learning universe.
                </p>

                <form className="max-w-md mx-auto flex flex-col gap-4">
                    <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-cosmic-purple transition-colors outline-none"
                        required
                    />
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-cosmic-purple transition-colors outline-none"
                        required
                    />
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white/50 focus:border-cosmic-purple transition-colors outline-none appearance-none">
                        <option value="">Select your role</option>
                        <option value="parent">Parent</option>
                        <option value="educator">Educator</option>
                        <option value="student">Student</option>
                        <option value="supporter">Supporter</option>
                    </select>
                    <button type="submit" className="glow-button-pink w-full mt-4 text-lg">
                        Join the Waitlist
                    </button>
                    <p className="text-[10px] text-text-muted mt-4 uppercase tracking-widest">
                        By joining, you agree to our mission of creative empowerment.
                    </p>
                </form>
            </div>
        </section>
    );
}
