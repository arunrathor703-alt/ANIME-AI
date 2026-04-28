import React from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, Zap, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimeStyle } from '../services/geminiService';

interface StyleSelectorProps {
  selectedStyle: AnimeStyle;
  onSelect: (style: AnimeStyle) => void;
}

const STYLES: { id: AnimeStyle; name: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'shinkai',
    name: 'Shinkai',
    description: 'Ultra-detailed skies & light',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-blue-400 to-cyan-300'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon lights & futuristic rain',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'ghibli',
    name: 'Ghibli',
    description: 'Soft, hand-painted nature',
    icon: <ImageIcon className="w-5 h-5" />,
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'shonen',
    name: 'Shonen',
    description: 'High energy & glowing auras',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-orange-500 to-yellow-400'
  }
];

export function StyleSelector({ selectedStyle, onSelect }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STYLES.map((style, index) => (
        <motion.button
          key={style.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(style.id)}
          className={cn(
            "relative p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col group overflow-hidden",
            selectedStyle === style.id
              ? "bg-anime-pink text-white border-anime-pink shadow-[0_0_20px_rgba(255,0,229,0.3)]"
              : "bg-white/5 border-white/10 hover:border-anime-blue text-gray-300"
          )}
        >
          <span className={cn(
            "text-[10px] font-black opacity-50 uppercase tracking-widest",
            selectedStyle === style.id ? "text-white" : "text-anime-blue"
          )}>
            0{index + 1}.
          </span>
          <span className="font-display font-black text-lg uppercase italic tracking-tighter leading-tight mt-1">
            {style.name}
          </span>
          
          {selectedStyle !== style.id && (
            <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity">
              {style.icon}
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
