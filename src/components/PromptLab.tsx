import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, Download, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { generateAnimeFromText, AnimeStyle } from '../services/geminiService';
import { StyleSelector } from './StyleSelector';
import { cn } from '../lib/utils';

export function PromptLab() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<AnimeStyle>('shinkai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    setResultImage(null);
    try {
      const result = await generateAnimeFromText(prompt, selectedStyle);
      setResultImage(result.imageUrl);
    } catch (err: any) {
      setError(err.message || 'Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-display font-bold text-xl flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-anime-blue/20 text-anime-blue flex items-center justify-center text-sm italic font-black">1</span>
            Describe your Vision
          </h3>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A legendary samurai standing on a floating island above a sea of stars..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-anime-purple transition-colors resize-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-display font-bold text-xl flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-anime-blue/20 text-anime-blue flex items-center justify-center text-sm italic font-black">2</span>
            Aesthetic Filter
          </h3>
          <StyleSelector selectedStyle={selectedStyle} onSelect={setSelectedStyle} />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt || isGenerating}
          className={cn(
            "w-full btn-primary py-5 text-xl",
            (!prompt || isGenerating) && "opacity-50 cursor-not-allowed grayscale"
          )}
        >
          {isGenerating ? "Summoning Art..." : "Generate Masterpiece"}
        </button>

        {error && (
          <div className="flex items-start gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="aspect-square w-full glass-panel rounded-[40px] relative overflow-hidden group border-white/5">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/40 backdrop-blur-3xl"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-24 rounded-full border-2 border-dashed border-anime-purple shadow-[0_0_50px_rgba(157,0,255,0.3)]"
                  />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-anime-purple w-10 h-10 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="font-display font-black text-2xl uppercase tracking-widest text-anime-purple">Forging Art</p>
                  <p className="text-sm text-white/40 mt-1 font-mono">Synthesizing cinematic layers...</p>
                </div>
              </motion.div>
            ) : resultImage ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full w-full"
              >
                <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <a
                    href={resultImage}
                    download="anime_studio_text_gen.png"
                    className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-2xl"
                  >
                    <Download className="w-6 h-6" />
                  </a>
                  <button className="p-4 bg-anime-pink text-white rounded-full hover:scale-110 transition-transform shadow-2xl">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center p-12 text-center text-white/20">
                <Sparkles className="w-16 h-16 mb-4 opacity-10" />
                <p className="font-display font-medium text-lg italic tracking-tight">Your scene will manifest here</p>
                <p className="text-xs uppercase tracking-[0.2em] mt-2 opacity-50">Studio Canvas Ready</p>
              </div>
            )}
          </AnimatePresence>
        </div>
        
        {resultImage && !isGenerating && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-center mt-4 text-white/30 uppercase tracking-[0.3em] font-bold"
          >
            Resolution: 4K Masterpiece Rendered
          </motion.p>
        )}
      </div>
    </div>
  );
}
