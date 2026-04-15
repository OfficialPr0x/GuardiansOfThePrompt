"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function HeroShell() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Shell */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/doajstql7/image/upload/v1775704979/BackgroundGOTP_lrgfja.png"
          alt="PromptVerse Cosmic Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-space-deep" />
      </div>

      {/* Floating Islands Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Leftmost Island (Adventuria) */}
        <motion.div
          className="absolute left-[24%] top-[44%] -translate-x-1/2 -translate-y-1/2 w-[14%] min-w-[150px] max-w-[300px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0] 
          }}
          transition={{
            opacity: { duration: 1 },
            scale: { duration: 1 },
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <Image
            src="https://res.cloudinary.com/doajstql7/image/upload/q_auto/f_auto/v1775704979/AdventuriaGOTP_vccxda.png"
            alt="Adventuria Island"
            width={400}
            height={400}
            className="w-full h-auto drop-shadow-[0_0_30px_rgba(108,43,255,0.4)] drop-shadow-[0_0_15px_rgba(55,200,255,0.2)]"
          />
        </motion.div>

        {/* Bottom Left Island (Maker Realm) */}
        <motion.div
          className="absolute left-[12%] top-[71%] -translate-x-1/2 -translate-y-1/2 w-[14%] min-w-[150px] max-w-[300px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0] 
          }}
          transition={{
            opacity: { duration: 1, delay: 0.2 },
            scale: { duration: 1, delay: 0.2 },
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <Image
            src="https://res.cloudinary.com/doajstql7/image/upload/v1775704979/MakerRealmGOTP_x5i4ii.png"
            alt="Maker Realm Island"
            width={400}
            height={400}
            className="w-full h-auto drop-shadow-[0_0_30px_rgba(255,79,216,0.3)] drop-shadow-[0_0_15px_rgba(108,43,255,0.2)]"
          />
        </motion.div>

        {/* Center Island (DreamScape) */}
        <motion.div
          className="absolute left-[50%] top-[58%] -translate-x-1/2 -translate-y-1/2 w-[22%] min-w-[200px] max-w-[400px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0] 
          }}
          transition={{
            opacity: { duration: 1, delay: 0.4 },
            scale: { duration: 1, delay: 0.4 },
            y: {
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <Image
            src="https://res.cloudinary.com/doajstql7/image/upload/v1775704979/DreamScapeGOTP_yvq2ui.png"
            alt="DreamScape Island"
            width={500}
            height={500}
            className="w-full h-auto drop-shadow-[0_0_40px_rgba(55,200,255,0.4)] drop-shadow-[0_0_20px_rgba(108,43,255,0.2)]"
          />
        </motion.div>

        {/* Bottom Right Island */}
        <motion.div
          className="absolute left-[88%] top-[73%] -translate-x-1/2 -translate-y-1/2 w-[14%] min-w-[150px] max-w-[300px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0] 
          }}
          transition={{
            opacity: { duration: 1, delay: 0.6 },
            scale: { duration: 1, delay: 0.6 },
            y: {
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <Image
            src="https://res.cloudinary.com/doajstql7/image/upload/v1775704979/MakerRealmGOTP_x5i4ii.png"
            alt="New Island"
            width={400}
            height={400}
            className="w-full h-auto drop-shadow-[0_0_30px_rgba(108,43,255,0.3)] drop-shadow-[0_0_15px_rgba(255,79,216,0.2)]"
          />
        </motion.div>

        {/* Top Right Island (StoryWorld) */}
        <motion.div
          className="absolute left-[76%] top-[44%] -translate-x-1/2 -translate-y-1/2 w-[14%] min-w-[150px] max-w-[300px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0] 
          }}
          transition={{
            opacity: { duration: 1, delay: 0.8 },
            scale: { duration: 1, delay: 0.8 },
            y: {
              duration: 5.2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <Image
            src="https://res.cloudinary.com/doajstql7/image/upload/v1775704979/StoryWorldGOTP_wjjls3.png"
            alt="StoryWorld Island"
            width={400}
            height={400}
            className="w-full h-auto drop-shadow-[0_0_30px_rgba(108,43,255,0.4)] drop-shadow-[0_0_15px_rgba(55,200,255,0.2)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
