import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Film, Play, Sparkles, AlertCircle, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { generateAnimeVideo } from '../services/geminiService';
import { cn } from '../lib/utils';

// Declare aistudio types
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export function MotionLab() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setNeedsKey(!hasKey);
    } catch (e) {
      console.error("Failed to check API key status", e);
    }
  };

  const handleOpenKeyDialog = async () => {
    try {
      await window.aistudio.openSelectKey();
      setNeedsKey(false);
    } catch (e) {
      console.error("Failed to open key dialog", e);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setProgress('Initializing Cinematic Engine...');

    try {
      const result = await generateAnimeVideo(prompt, (status) => {
        setProgress(status);
      });
      setVideoUrl(result.videoUrl);
    } catch (err: any) {
      if (err.message === "BILLING_REQUIRED") {
        setNeedsKey(true);
        setError("A paid API key is required for high-quality video generation (Veo).");
      } else {
        setError(err.message || 'Video generation failed.');
      }
    } finally {
      setIsGenerating(false);
      setProgress('');
    }
  };

  if (needsKey) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 glass-panel rounded-[40px] border-white/10 bg-anime-blue/5">
        <div className="w-20 h-20 rounded-full bg-anime-blue/20 flex items-center justify-center">
          <CreditCard className="w-10 h-10 text-anime-blue" />
        </div>
        <div className="max-w-md">
          <h3 className="font-display font-black text-2xl uppercase italic tracking-tighter mb-2">Connect Veo Engine</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            High-fidelity cinematic motion (VEO 3.1) requires a paid Gemini API key with billing enabled.
          </p>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-anime-blue uppercase font-bold tracking-widest mt-4 inline-block hover:underline"
          >
            Learn about Billing →
          </a>
        </div>
        <button
          onClick={handleOpenKeyDialog}
          className="btn-primary px-10 py-4 flex items-center gap-2 group"
        >
          Select Paid API Key
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-display font-bold text-xl flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-anime-blue/20 text-anime-blue flex items-center justify-center text-sm italic font-black">1</span>
            Motion Script
          </h3>
          <p className="text-sm text-white/40 leading-relaxed italic">
            Describe the movement you want to see. Our engine will calculate physics and light paths across 48 dimensions.
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A character looking at the rainy neon city, soft wind blowing hair, cinematic lens flare..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-anime-blue transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt || isGenerating}
          className={cn(
            "w-full btn-primary py-5 bg-gradient-to-r from-anime-blue to-anime-purple shadow-anime-blue/20 flex items-center justify-center gap-2",
            (!prompt || isGenerating) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isGenerating ? "Rendering Motion..." : "Generate Cinematic"}
          <Film className={cn("w-5 h-5", isGenerating && "animate-pulse")} />
        </button>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-3 items-start">
          <Clock className="w-5 h-5 text-anime-blue shrink-0 mt-0.5" />
          <div className="text-xs text-white/50 leading-relaxed">
            <span className="font-bold text-white block mb-1 uppercase tracking-widest text-[10px]">Note: Veo Rendering</span>
            High-quality video synthesis (VEO Engine) can take up to 2 minutes per sequence. Please keep this tab open during rendering.
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="aspect-video w-full glass-panel rounded-[40px] flex flex-col items-center justify-center overflow-hidden border-white/5 relative min-h-[300px]">
          {isGenerating ? (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl flex flex-col items-center justify-center gap-6 p-12 text-center">
               <motion.div
                animate={{ 
                  scale: [1, 1.1, 1], 
                  rotate: [0, 5, -5, 0],
                  opacity: [0.5, 1, 0.5] 
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full border-2 border-anime-blue/30 border-t-anime-blue animate-spin duration-[3s]" />
                <Film className="w-10 h-10 text-anime-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </motion.div>
              <div className="space-y-2">
                <h4 className="font-display font-black text-2xl uppercase text-anime-blue italic tracking-tighter">{progress || 'Synthesizing'}</h4>
                <div className="flex items-center justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-anime-blue"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-12 space-y-4 opacity-20">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-white mx-auto flex items-center justify-center">
                <Play className="w-6 h-6 fill-white" />
              </div>
              <p className="font-display font-black text-lg uppercase tracking-widest italic">Cinema View</p>
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-anime-blue/10 blur-2xl rounded-full -z-10" />
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-anime-purple/10 blur-3xl rounded-full -z-10" />
      </div>
    </div>
  );
}
