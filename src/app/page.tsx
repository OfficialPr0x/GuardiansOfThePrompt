import { Navbar } from "@/components/landing/navbar";
import { HeroShell } from "@/components/landing/hero-shell";
import { RealmMap } from "@/components/landing/realm-map";
import { 
  HowItWorks, 
  WhyItMatters, 
  TrustSection, 
  Manifesto, 
  CTASection 
} from "@/components/landing/info-sections";
import { Footer } from "@/components/landing/footer";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative min-h-screen bg-space-deep select-none">
        <Navbar />
        <HeroShell />
        <div className="relative z-10">
          <HowItWorks />
          <RealmMap />
          <WhyItMatters />
          <TrustSection />
          <Manifesto />
          <CTASection />
        </div>
        <Footer />
        
        {/* Global Ambient Glows */}
        <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-cosmic-purple/10 blur-[150px] rounded-full animate-pulse-glow" />
            <div className="absolute bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-neon-pink/5 blur-[150px] rounded-full animate-pulse-glow" style={{ animationDelay: "3s" }} />
        </div>
      </main>
    </SmoothScroll>
  );
}
