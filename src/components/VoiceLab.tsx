import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, Play, Pause, Mic2, Sparkles, Send } from 'lucide-react';
import { generateAnimeSpeech } from '../services/geminiService';
import { cn } from '../lib/utils';

const VOICES: { id: 'Kore' | 'Zephyr' | 'Puck' | 'Charon'; name: string; desc: string }[] = [
  { id: 'Kore', name: 'Heroine', desc: 'Bright, energetic, and youthful' },
  { id: 'Zephyr', name: 'Protagonist', desc: 'Cool, deep, and determined' },
  { id: 'Puck', name: 'Mascot', desc: 'Playful, high-pitched, and cute' },
  { id: 'Charon', name: 'Antagonist', desc: 'Dark, smooth, and charismatic' }
];

export function VoiceLab() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<typeof VOICES[0]['id']>('Kore');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!text) return;
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateAnimeSpeech(text, selectedVoice);
      setAudioUrl(result.audioUrl);
      // Auto-play when ready
    } catch (err: any) {
      setError(err.message || 'Failed to generate voice.');
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
            Character Voice
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {VOICES.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVoice(v.id)}
                className={cn(
                  "p-4 rounded-2xl text-left transition-all border-2",
                  selectedVoice === v.id 
                    ? "bg-white/10 border-white" 
                    : "bg-white/5 border-transparent hover:bg-white/10"
                )}
              >
                <div className={cn(
                  "font-display font-black text-xs uppercase tracking-widest",
                  selectedVoice === v.id ? "text-white" : "text-anime-blue"
                )}>{v.name}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1 leading-tight">{v.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-display font-bold text-xl flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-anime-blue/20 text-anime-blue flex items-center justify-center text-sm italic font-black">2</span>
            Dialogue Line
          </h3>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. I will never give up on my dreams! Believe it!"
              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-anime-pink transition-colors resize-none"
            />
            <div className="absolute bottom-4 right-4 text-[10px] text-white/20 font-bold uppercase tracking-widest">
              Anime TTS Engine
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!text || isGenerating}
          className={cn(
            "w-full btn-primary py-5 flex items-center justify-center gap-2",
            (!text || isGenerating) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isGenerating ? "Synthesizing..." : "Give Voice"}
          <Send className="w-5 h-5" />
        </button>

        {error && <p className="text-red-400 text-sm italic">{error}</p>}
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-anime-pink/5 blur-[100px] -z-10 rounded-full" />
        
        <div className="glass-panel w-full aspect-[4/3] rounded-[40px] flex flex-col items-center justify-center gap-6 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-anime-pink/30 to-transparent" />
          
          <div className={cn(
            "w-24 h-24 rounded-full bg-gradient-to-br from-anime-pink to-anime-purple flex items-center justify-center shadow-2xl shadow-anime-pink/20 transition-all duration-500",
            isGenerating && "animate-pulse scale-110",
            audioUrl && "shadow-[0_0_40px_rgba(255,0,122,0.4)]"
          )}>
            <Volume2 className="w-10 h-10 text-white" />
          </div>

          <div className="text-center">
            <h4 className="font-display font-black text-2xl uppercase tracking-tighter">
              {isGenerating ? "Processing Voice" : audioUrl ? "Voice Ready" : "Studio Silent"}
            </h4>
            <p className="text-sm text-white/40 mt-1">
              {isGenerating ? "Applying character emotion..." : audioUrl ? "Ready for playback" : "Enter dialogue to start"}
            </p>
          </div>

          {audioUrl && (
            <div className="w-full px-12 mt-4">
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                controls 
                className="w-full h-10 accent-anime-pink rounded-full overflow-hidden invert"
              />
            </div>
          )}

          {/* Visualizing Waves when playing */}
          {audioUrl && (
            <div className="flex gap-1 h-8 items-center mt-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['40%', '100%', '40%'] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-anime-pink rounded-full"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
