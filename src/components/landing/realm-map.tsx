"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Compass, Code, Zap, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const REALMS = [
  {
    id: "storyworld",
    name: "StoryWorld",
    description: "Create stories, characters, universes, and adventures with AI.",
    skills: ["Writing", "Storytelling", "Worldbuilding"],
    icon: BookOpen,
    image: "/images/landing/storyworld.png",
    color: "from-cosmic-purple/40",
  },
  {
    id: "adventuria",
    name: "Adventuria",
    description: "Explore quests, discovery, missions, and interactive learning journeys.",
    skills: ["Exploration", "Curiosity", "Decision-making"],
    icon: Compass,
    image: "/images/landing/adventuria.png",
    color: "from-neon-blue/40",
  },
  {
    id: "maker",
    name: "Maker Realm",
    description: "Build games, apps, inventions, and digital prototypes.",
    skills: ["Building", "Systems Thinking", "Coding"],
    icon: Code,
    image: "/images/landing/maker-realm.png",
    color: "from-neon-pink/40",
  },
  {
    id: "dreamscape",
    name: "DreamScape",
    description: "Turn imagination into visual worlds, ideas, and alternate realities.",
    skills: ["Creativity", "Concept Design", "Ideation"],
    icon: Zap,
    image: "/images/landing/dreamscape.png",
    color: "from-cosmic-violet/40",
  },
  {
    id: "creativehub",
    name: "Creative Hub",
    description: "Design anything—from digital art to branding, videos, and expressive projects.",
    skills: ["Design", "Media", "Expression"],
    icon: Palette,
    image: "/images/landing/creative-hub.png",
    color: "from-orange-500/40",
  },
];

function RealmCard({ realm, index }: { realm: typeof REALMS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group cosmic-card overflow-hidden"
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br transition-opacity duration-500 opacity-20 group-hover:opacity-40",
        realm.color,
        "to-transparent"
      )} />
      
      <div className="relative z-10">
        <div className="relative aspect-square mb-6 overflow-hidden rounded-xl">
           <Image
            src={realm.image}
            alt={realm.name}
            fill
            className="object-contain transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-deep via-transparent to-transparent opacity-60" />
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-cosmic-purple/30 transition-colors">
            <realm.icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{realm.name}</h3>
        </div>

        <p className="text-text-muted mb-6 text-sm leading-relaxed">
          {realm.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {realm.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-text-muted transition-colors group-hover:border-white/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function RealmMap() {
  return (
    <section id="realms" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-cosmic-purple text-sm font-bold uppercase tracking-[0.3em] mb-4 block"
          >
            Explore the Universe
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Every realm unlocks a new <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-cosmic-purple">
              creative power.
            </span>
          </motion.h2>
          <motion.p
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="text-text-muted max-w-2xl mx-auto"
          >
            PromptVerse is divided into five unique creative regions, each designed to develop essential skills for the artificial intelligence era.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REALMS.map((realm, i) => (
            <RealmCard key={realm.id} realm={realm} index={i} />
          ))}
        </div>
      </div>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-cosmic-purple/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/5 blur-[120px] rounded-full" />
    </section>
  );
}
