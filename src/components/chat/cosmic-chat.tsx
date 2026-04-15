"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Smoke reveal: each character materializes from cosmic blur
const smokeVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(5px)", y: 3 },
  visible: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      delay: i * 0.006,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

// Recursively processes ALL children (including nested inline elements) char by char
function SmokeChildren({ children, counter }: { children: React.ReactNode; counter: { count: number } }) {
  return (
    <>
      {React.Children.map(children, (child) => {
        // String nodes: animate each character
        if (typeof child === "string") {
          const words = child.split(/(\s+)/);
          return words.map((word, wi) => {
            if (/^\s+$/.test(word)) return <span key={wi}>{word}</span>;
            return (
              <span key={wi} className="inline-block whitespace-nowrap">
                {[...word].map((char, ci) => {
                  const idx = counter.count++;
                  return (
                    <motion.span
                      key={ci}
                      variants={smokeVariants}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
            );
          });
        }
        // React elements (strong, em, code, etc): clone and recurse into children
        if (React.isValidElement(child)) {
          const props = child.props as Record<string, unknown>;
          if (props.children) {
            return React.cloneElement(child as React.ReactElement<{ children: React.ReactNode }>, {
              children: <SmokeChildren counter={counter}>{props.children as React.ReactNode}</SmokeChildren>
            });
          }
          return child;
        }
        return child;
      })}
    </>
  );
}

// Animated markdown: full formatting with per-character smoke reveal
function AnimatedMarkdown({ text }: { text: string }) {
  // Mutable counter shared across all block renders — resets each render pass
  const counter = { count: 0 };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-text-primary/95 text-lg"><SmokeChildren counter={counter}>{children}</SmokeChildren></p>,
        h1: ({ children }) => <h1 className="text-3xl font-bold text-cosmic-purple mb-6 mt-4"><SmokeChildren counter={counter}>{children}</SmokeChildren></h1>,
        h2: ({ children }) => <h2 className="text-2xl font-bold text-neon-blue mb-4 mt-4"><SmokeChildren counter={counter}>{children}</SmokeChildren></h2>,
        h3: ({ children }) => <h3 className="text-xl font-bold text-neon-pink mb-3 mt-4"><SmokeChildren counter={counter}>{children}</SmokeChildren></h3>,
        li: ({ children }) => <li className="text-text-primary/90 text-lg mb-1"><SmokeChildren counter={counter}>{children}</SmokeChildren></li>,
        strong: ({ children }) => <strong className="font-bold text-cosmic-violet underline decoration-cosmic-purple/40">{children}</strong>,
        em: ({ children }) => <em className="italic text-neon-blue/90">{children}</em>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-6 space-y-2 ml-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-2 ml-2">{children}</ol>,
        code: ({ children }) => (
          <code className="bg-white/10 px-2 py-0.5 rounded text-neon-pink text-sm border border-white/10 mx-1 font-mono">
            {children}
          </code>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

// Static markdown: instant render for older messages
function StyledMarkdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-text-primary/95 text-lg">{children}</p>,
        h1: ({ children }) => <h1 className="text-3xl font-bold text-cosmic-purple mb-6 mt-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-bold text-neon-blue mb-4 mt-4">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-bold text-neon-pink mb-3 mt-4">{children}</h3>,
        strong: ({ children }) => <strong className="font-bold text-cosmic-violet underline decoration-cosmic-purple/40">{children}</strong>,
        em: ({ children }) => <em className="italic text-neon-blue/90">{children}</em>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-6 space-y-2 ml-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-2 ml-2">{children}</ol>,
        li: ({ children }) => <li className="text-text-primary/90 text-lg mb-1">{children}</li>,
        code: ({ children }) => (
          <code className="bg-white/10 px-2 py-0.5 rounded text-neon-pink text-sm border border-white/10 mx-1 font-mono">
            {children}
          </code>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

const MemoizedMessage = React.memo(({ msg, isLatestAssistant }: { msg: { role: string; content: string }; isLatestAssistant: boolean }) => (
  <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[90%] p-5 rounded-2xl ${
      msg.role === 'user' 
        ? 'bg-cosmic-purple text-white rounded-tr-none shadow-lg' 
        : 'bg-white/10 text-text-primary rounded-tl-none border border-white/10 backdrop-blur-md'
    }`}>
      {msg.role === 'assistant' ? (
        isLatestAssistant ? <AnimatedMarkdown text={msg.content} /> : <StyledMarkdown text={msg.content} />
      ) : (
        <span className="text-lg">{msg.content}</span>
      )}
    </div>
  </div>
));

MemoizedMessage.displayName = "MemoizedMessage";

function ChatInput({ onSendMessage, disabled }: { onSendMessage: (text: string) => void; disabled: boolean }) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount and capture any keystrokes
  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if modifier keys, function keys, or already focused
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length > 1 && e.key !== 'Backspace') return;
      if (document.activeElement === inputRef.current) return;
      
      inputRef.current?.focus();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput("");
      // Re-focus after sending
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mt-auto p-2">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Speak to the universe..."
        autoFocus
        className="w-full bg-white/5 border border-white/15 rounded-xl px-6 py-4 pr-16 text-white text-lg outline-none focus:border-cosmic-purple transition-all placeholder:text-white/30"
      />
      <button
        type="submit"
        disabled={disabled}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-cosmic-purple hover:text-white transition-all disabled:opacity-30 disabled:scale-95"
      >
        <Send size={24} />
      </button>
    </form>
  );
}

export function CosmicChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Disable background scrolling using position:fixed (more reliable than overflow:hidden)
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.dataset.scrollY = String(scrollY);
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || '0');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    }
    return () => {
      const scrollY = parseInt(document.body.dataset.scrollY || '0');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Cosmic connection failed");

      const data = await response.json();
      if (data.content) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      }
    } catch (error) {
       setMessages((prev) => [...prev, { role: "assistant", content: "A solar flare disrupted our connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-20 h-20 group"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="absolute inset-0 bg-cosmic-purple/20 blur-xl rounded-full group-hover:bg-cosmic-purple/40 transition-colors" />
        <Image
          src="https://res.cloudinary.com/doajstql7/image/upload/v1776269123/ChatGPT_Image_Apr_15__2026__11_07_51_AM-removebg-preview_yvxtnz.png"
          alt="Chat Trigger"
          width={80}
          height={80}
          className="relative z-10 w-full h-full object-contain"
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Pure Background Image - No Blurs, No Frames */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0"
              onClick={() => setIsOpen(false)}
            >
               <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: "url('https://res.cloudinary.com/doajstql7/image/upload/v1775712618/BackgroundGOTP_cxw1sl.png')",
                    filter: "blur(5px)"
                  }}
               />
               {/* 20% Dark Overlay */}
               <div className="absolute inset-0 bg-black/20" />
            </motion.div>

            {/* Content Wrapper */}
            <div className="relative z-10 w-full h-full flex items-center px-6 md:px-12">
              
              {/* Character (Left) */}
              <motion.div
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.8 }}
                className="hidden md:flex w-1/2 h-full items-center justify-center relative"
              >
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vh] h-[140vh] bg-cosmic-purple/20 blur-[160px] rounded-full" />
                 <motion.img
                    src="https://res.cloudinary.com/doajstql7/image/upload/v1776275610/ChatGPT_Image_Apr_15_2026_01_53_23_PM_wgbomi.png"
                    alt="Cosmic Messenger"
                    className="h-[220vh] w-auto object-contain relative z-20 scale-150 -translate-x-[5%]"
                    style={{ 
                      filter: "drop-shadow(0 0 120px rgba(108,43,255,0.7))",
                      clipPath: "inset(10px)"
                    }}
                  />
              </motion.div>

              {/* Chat Bubble (Right) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 100 }}
                transition={{ delay: 0.2 }}
                className="w-full md:w-1/2 flex items-center justify-center md:justify-start"
              >
                <div className="w-full max-w-xl glass-panel-glow pointer-events-auto relative shadow-2xl z-50">
                  {/* Close button inside the bubble area */}
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-space-surface border border-white/20 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:border-cosmic-purple transition-all z-[60] shadow-xl"
                  >
                    <X size={24} />
                  </button>

                  <div className="flex flex-col h-[75vh] min-h-[500px] p-2 overflow-hidden">
                    <div 
                      className="overflow-y-scroll mb-4 space-y-6 p-6 custom-scrollbar" 
                      style={{ overscrollBehavior: 'contain', height: 'calc(75vh - 80px)' }}
                      ref={scrollRef}
                      onWheel={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <div className="text-cosmic-purple font-bold italic text-2xl animate-pulse">
                             <AnimatedMarkdown text="Greetings, traveler from the stars! Seek and you shall discover..." />
                          </div>
                        </div>
                      )}
                      
                      {messages.map((msg, i) => {
                        // Find the index of the last assistant message
                        const lastAssistantIdx = messages.reduce((acc, m, idx) => m.role === 'assistant' ? idx : acc, -1);
                        return (
                          <MemoizedMessage key={i} msg={msg} isLatestAssistant={msg.role === 'assistant' && i === lastAssistantIdx} />
                        );
                      })}
                      
                      {isTyping && messages[messages.length-1]?.role === 'user' && (
                         <div className="flex justify-start">
                            <div className="bg-white/10 p-5 rounded-2xl rounded-tl-none border border-white/10 backdrop-blur-sm shadow-inner">
                               <motion.div 
                                 animate={{ opacity: [0.3, 1, 0.3] }}
                                 transition={{ repeat: Infinity, duration: 1.5 }}
                                 className="flex gap-2"
                               >
                                 <div className="w-2.5 h-2.5 bg-cosmic-purple rounded-full shadow-[0_0_8px_rgba(108,43,255,0.8)]" />
                                 <div className="w-2.5 h-2.5 bg-cosmic-purple rounded-full shadow-[0_0_8px_rgba(108,43,255,0.8)]" />
                                 <div className="w-2.5 h-2.5 bg-cosmic-purple rounded-full shadow-[0_0_8px_rgba(108,43,255,0.8)]" />
                               </motion.div>
                            </div>
                         </div>
                      )}
                    </div>

                    <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
