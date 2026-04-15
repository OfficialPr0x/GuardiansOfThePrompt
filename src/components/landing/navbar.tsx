"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "#hero" },
  { name: "Realms", href: "#realms" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "For Parents", href: "#parents" },
  { name: "Vision", href: "#vision" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-space-deep/80 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image 
            src="https://res.cloudinary.com/doajstql7/image/upload/v1775714265/Untitled_design__2_-removebg-preview_id59nn.png"
            alt="Guardians. Logo"
            width={360}
            height={96}
            className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-text-muted hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="#join"
            className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-white px-6 py-2 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(108,43,255,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            Join Waitlist
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-space-surface border-b border-white/10 p-6 md:hidden flex flex-col gap-4"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-text-muted hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="#join"
              className="bg-cosmic-purple text-white text-center py-4 rounded-xl font-bold mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Join Waitlist
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
