import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Sparkles, 
    ArrowRight, 
    Zap, 
    Menu, 
    Github, 
    Info, 
    Zap as ZapIcon, 
    Camera, 
    Mic2, 
    Wand2, 
    Film,
    RefreshCcw
} from 'lucide-react';
import { StyleSelector } from './components/StyleSelector';
import { ImageUpload } from './components/ImageUpload';
import { ResultView } from './components/ResultView';
import { VoiceLab } from './components/VoiceLab';
import { PromptLab } from './components/PromptLab';
import { MotionLab } from './components/MotionLab';
import { transformImageToAnime, AnimeStyle } from './services/geminiService';
import { cn } from './lib/utils';

type StudioTab = 'photo' | 'prompt' | 'voice' | 'motion';

export default function App() {
  const [activeTab, setActiveTab] = useState<StudioTab>('photo');
  const [selectedStyle, setSelectedStyle] = useState<AnimeStyle>('shinkai');
  const [inputImage, setInputImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (base64: string, mimeType: string) => {
    setInputImage({ base64, mimeType });
    setError(null);
  };

  const handleClear = () => {
    setInputImage(null);
    setResultImage(null);
    setError(null);
  };

  const handleTransform = async () => {
    if (!inputImage) return;

    setIsTransforming(true);
    setResultImage(null);
    setError(null);

    try {
      const result = await transformImageToAnime(inputImage.base64, inputImage.mimeType, selectedStyle);
      setResultImage(result.imageUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while transforming your image.');
    } finally {
      setIsTransforming(false);
    }
  };

  const TABS: { id: StudioTab; name: string; icon: React.ReactNode; color: string }[] = [
    { id: 'photo', name: 'Photo Lab', icon: <Camera size={18} />, color: 'text-anime-pink' },
    { id: 'prompt', name: 'Prompt Lab', icon: <Wand2 size={18} />, color: 'text-anime-purple' },
    { id: 'voice', name: 'Voice Lab', icon: <Mic2 size={18} />, color: 'text-anime-pink' },
    { id: 'motion', name: 'Motion Lab', icon: <Film size={18} />, color: 'text-anime-blue' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-t-0 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-anime-pink to-anime-blue rounded-lg flex items-center justify-center font-black italic text-2xl shadow-[0_0_15px_rgba(255,0,229,0.4)]">
              A
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter uppercase">
              Anime<span className="text-anime-blue">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/70">
            <a href="#studio-section" className="hover:text-white transition-colors">Labs</a>
            <a href="#" className="hover:text-white transition-colors">Gallery</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <button className="p-2 md:hidden">
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:block">
            <button className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all font-display text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Launch Studio
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-black">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-anime-pink/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-anime-purple/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-anime-pink text-[10px] font-display font-bold uppercase tracking-[0.2em] mb-6">
              <Sparkles className="w-3 h-3" />
              Revolutionizing Otaku Art
            </div>
            <h1 className="font-display text-7xl md:text-9xl font-black leading-[0.8] mb-8 tracking-tighter uppercase italic whitespace-pre-wrap">
              Image. <br />
              Voice. <br />
              <span className="anime-gradient-text">Universe</span>.
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-md leading-relaxed mb-10">
              Transform moments into cinematic masterpieces. Powered by the world's most advanced visual reasoning AI.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById('studio-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary group flex items-center gap-2"
              >
                Enter Studio
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-3 rounded-full font-display font-semibold transition-all duration-300 border border-white/20 hover:bg-white/10">
                View Gallery
              </button>
            </div>
          </motion.div>

          {/* New Multimodal Grid Teaser */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden glass-panel group relative">
                <img src="https://images.unsplash.com/photo-1578632738908-4521c726eebf?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Visual" />
                <div className="absolute bottom-4 left-4"><Camera className="text-anime-pink w-6 h-6" /></div>
            </div>
            <div className="space-y-4 pt-12">
                <div className="aspect-square rounded-3xl overflow-hidden glass-panel flex flex-col items-center justify-center gap-2">
                    <Mic2 className="text-white animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Voice Lab</span>
                </div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden glass-panel group relative">
                    <img src="https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Visual" />
                    <div className="absolute bottom-4 left-4"><Film className="text-anime-blue w-6 h-6" /></div>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Studio Section */}
      <section id="studio-section" className="py-32 px-4 bg-zinc-950/50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Tab Sidebar/Header */}
          <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="max-w-md">
              <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 italic leading-none">
                Creative <span className="text-anime-pink">Labs</span>
              </h2>
              <p className="text-white/40 text-sm">
                Switch between specialized AI engines to build your multimodal universe.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all relative overflow-hidden",
                    activeTab === tab.id 
                      ? "bg-white text-black shadow-lg shadow-white/10" 
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className={cn(activeTab === tab.id ? "text-black" : tab.color)}>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 md:p-12 rounded-[40px] border-white/5 relative overflow-hidden min-h-[600px] flex items-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-anime-blue/5 blur-[80px] -z-10" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                {activeTab === 'photo' && (
                  <div className="w-full">
                    <AnimatePresence mode="wait">
                        {resultImage || isTransforming ? (
                            <ResultView
                            key="result"
                            originalImage={inputImage?.base64 || ''}
                            resultImage={resultImage || ''}
                            isTransforming={isTransforming}
                            onReset={handleClear}
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                    <h3 className="font-display font-bold text-xl flex items-center gap-2">
                                        <span className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-sm">1</span>
                                        Choose Style
                                    </h3>
                                    <StyleSelector selectedStyle={selectedStyle} onSelect={setSelectedStyle} />
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                    <h3 className="font-display font-bold text-xl flex items-center gap-2">
                                        <span className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-sm">2</span>
                                        Upload Photo
                                    </h3>
                                    <ImageUpload 
                                        preview={inputImage?.base64 || null} 
                                        onImageSelect={handleImageSelect}
                                        onClear={handleClear}
                                    />
                                    </div>
                                    <button
                                    disabled={!inputImage || isTransforming}
                                    onClick={handleTransform}
                                    className={cn(
                                        "w-full btn-primary py-5 text-xl group relative overflow-hidden",
                                        (!inputImage || isTransforming) && "opacity-50 cursor-not-allowed grayscale"
                                    )}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isTransforming ? <RefreshCcw className="animate-spin" /> : <><Sparkles className="group-hover:rotate-12 transition-transform" /> Render Masterpiece</>}
                                        </span>
                                    </button>
                                    {error && <p className="text-red-400 text-sm italic">{error}</p>}
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                  </div>
                )}

                {activeTab === 'prompt' && <PromptLab />}
                {activeTab === 'voice' && <VoiceLab />}
                {activeTab === 'motion' && <MotionLab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-12 px-4 glass-panel border-b-0 border-r-0 border-l-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <ZapIcon className="w-5 h-5 text-anime-pink" />
            <span className="font-display font-black text-lg uppercase">AnimeAI Studio</span>
            <span className="text-white/20 text-sm ml-4 italic">Multimodal Frontier</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="p-2 rounded-full hover:bg-white/5 transition-colors"><Github className="w-5 h-5 text-white/50" /></a>
            <a href="#" className="p-2 rounded-full hover:bg-white/5 transition-colors"><Info className="w-5 h-5 text-white/50" /></a>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-white/30">Terms & Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
