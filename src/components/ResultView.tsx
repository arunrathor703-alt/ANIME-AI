import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Sparkles, RefreshCcw, Share2 } from 'lucide-react';

interface ResultViewProps {
  originalImage: string;
  resultImage: string;
  isTransforming: boolean;
  onReset: () => void;
}

export function ResultView({ originalImage, resultImage, isTransforming, onReset }: ResultViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-3">
          <p className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-white/40 italic">Original Input</p>
          <div className="aspect-square rounded-[32px] overflow-hidden border border-white/10">
            <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-anime-blue italic animate-pulse">Anime Masterpiece</p>
          <div className="aspect-square rounded-[32px] overflow-hidden glass-panel relative group">
            {isTransforming ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-md">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full border-4 border-anime-pink/20 border-t-anime-pink" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-anime-pink w-8 h-8" />
                </motion.div>
                <div className="text-center px-8">
                  <p className="font-display font-black text-2xl italic uppercase tracking-tighter">Creating Magic</p>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest leading-tight">Applying cinematic layers</p>
                </div>
              </div>
            ) : (
              <>
                <img src={resultImage} alt="Anime Result" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a
                    href={resultImage}
                    download="anime_studio_result.png"
                    className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-2xl"
                  >
                    <Download className="w-6 h-6" />
                  </a>
                  <button className="p-4 bg-anime-pink text-white rounded-full hover:scale-110 transition-transform shadow-2xl">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {!isTransforming && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-4"
        >
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-display font-bold border border-white/10 group"
          >
            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Try Another One
          </button>
        </motion.div>
      )}
    </div>
  );
}
