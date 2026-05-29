"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, FastForward, Rewind, Volume2, VolumeX, Minimize2 } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import { cn } from "../lib/utils";

const TRACKS = [
  {
    title: "DanaMusic Relaxing Flute Meditation",
    src: "/DanaMusic_Relaxing_Flute_Meditation.mp3",
  },
  {
    title: "Onetent Morning Relaxing",
    src: "/Onetent_Morning_Relaxing.mp3",
  },
  {
    title: "SigmaMusicArt Meditation Yoga Relaxing",
    src: "/SigmaMusicArt_Meditation_Yoga_Relaxing.mp3",
  }
];

function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="music-glass"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

const LiquidGlassPanel = ({ children, className, roundedClass = "rounded-[32px]", ...props }: any) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden group/liquid",
        roundedClass,
        className
      )}
      {...props}
    >
      <div 
        className={cn("absolute top-0 left-0 z-0 h-full w-full bg-gradient-to-br from-green-950/40 via-emerald-950/20 to-black/60 shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(100,255,100,0.15),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.1),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.05)] transition-all", roundedClass)} 
      />
      <div
        className={cn("absolute top-0 left-0 isolate -z-10 h-full w-full opacity-40 mix-blend-overlay", roundedClass)}
        style={{ backdropFilter: 'url("#music-glass")' }}
      />
      <div className="absolute inset-0 -z-20 backdrop-blur-[24px]" />
      
      <div className="relative z-10 w-full h-full text-white/90">
        {children}
      </div>
    </div>
  );
};

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [previousVolume, setPreviousVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    if (isMuted || volume[0] === 0) {
      setVolume(previousVolume[0] === 0 ? [50] : previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume([0]);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (newVolume[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleProgressChange = (newProgress: number[]) => {
    if (audioRef.current && duration) {
       const newTime = (newProgress[0] / 100) * duration;
       audioRef.current.currentTime = newTime;
       setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative z-50 flex items-center justify-center p-4">
      <audio 
        ref={audioRef}
        src={TRACKS[currentTrackIndex].src}
        onLoadedData={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={playNext}
      />
      <GlassFilter />
      <AnimatePresence initial={false} mode="wait">
        {!isOpen ? (
          <motion.div
            key="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
          >
            <LiquidGlassPanel roundedClass="rounded-full" className="w-20 h-20 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300">
              <button 
                className="w-full h-full flex items-center justify-center outline-none"
                onClick={() => setIsOpen(true)}
              >
                <div className="absolute inset-0 bg-white/5 rounded-full hover:bg-white/10 transition-colors" />
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" className="w-8 h-8 text-white/80"><path d="M287-167q-47-47-47-113t47-113q47-47 113-47 23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47q-66 0-113-47Z"/></svg>
              </button>
            </LiquidGlassPanel>
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", bounce: 0.35, duration: 0.8 }}
            className="w-full max-w-sm sm:max-w-xl mx-auto"
          >
            <LiquidGlassPanel className="p-4 sm:px-6 sm:py-5 min-w-[340px] shadow-2xl">
              <div className="flex flex-col gap-6 w-full">
                {/* Track Info */}
                <div className="text-center px-4 mt-2">
                  <h3 className="text-white/90 font-normal tracking-wide text-sm truncate" style={{ fontFamily: 'system-ui' }}>
                    {TRACKS[currentTrackIndex].title}
                  </h3>
                </div>

                {/* Top Section */}
                <div className="flex items-center justify-between pl-2">
                  {/* Volume */}
                  <div className="flex items-center h-8 w-[85px] sm:w-[100px] group/volume cursor-pointer">
                    <button 
                      className="flex items-center justify-center text-white/40 group-hover/volume:text-white/80 transition-all duration-300 group-hover/volume:scale-105 shrink-0"
                      onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                    >
                      {isMuted || volume[0] === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <div className="flex h-full items-center overflow-hidden w-0 opacity-0 group-hover/volume:w-full group-hover/volume:opacity-100 group-hover/volume:ml-3 transition-all duration-300 origin-left ease-out">
                      <Slider.Root className="relative flex items-center select-none touch-none w-[53px] sm:w-[68px] h-8 cursor-pointer group shrink-0" value={volume} onValueChange={handleVolumeChange} max={100} step={1}>
                        <Slider.Track className="bg-white/10 relative grow rounded-full h-[6px] overflow-hidden shadow-inner">
                          <Slider.Range className="absolute bg-white/40 h-full rounded-full transition-colors" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)] rounded-full focus:outline-none transition-transform duration-200" />
                      </Slider.Root>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-5">
                    <button 
                      className="text-white/70 hover:text-white transition-colors duration-200 outline-none hover:scale-105 active:scale-95"
                      onClick={playPrevious}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5 12L20 18.5V5.5L11.5 12Z" />
                        <path d="M3.5 12L12 18.5V5.5L3.5 12Z" />
                      </svg>
                    </button>
                    <button 
                      className="text-[#e2f0d9] hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-200 outline-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <rect x="6" y="5" width="4" height="14" rx="1" />
                          <rect x="14" y="5" width="4" height="14" rx="1" />
                        </svg>
                      ) : (
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 4.5L20 12L6 19.5V4.5Z" />
                        </svg>
                      )}
                    </button>
                    <button 
                      className="text-white/70 hover:text-white transition-colors duration-200 outline-none hover:scale-105 active:scale-95"
                      onClick={playNext}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 12L4 5.5V18.5L12.5 12Z" />
                        <path d="M20.5 12L12 5.5V18.5L20.5 12Z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Empty placeholder for balance */}
                  <div className="w-[85px] sm:w-[100px] flex justify-end">
                    <button 
                      className="h-8 w-8 flex items-center justify-center text-white/40 hover:text-white/80 transition-all hover:scale-105"
                      onClick={() => setIsOpen(false)}
                      title="Resize Player"
                    >
                      <Minimize2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between gap-4 font-mono text-[13px] text-white/60 px-1">
                  <span>{formatTime(currentTime)}</span>
                  <Slider.Root 
                    className="relative flex items-center select-none touch-none w-full h-8 cursor-pointer group" 
                    value={[currentProgress]} 
                    onValueChange={handleProgressChange} 
                    max={100} 
                    step={0.1}
                  >
                    <Slider.Track className="bg-white/10 relative grow rounded-full h-[6px] overflow-hidden shadow-inner">
                      <Slider.Range className="absolute bg-white/40 h-full rounded-full transition-colors" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)] rounded-full focus:outline-none transition-transform duration-200" />
                  </Slider.Root>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </LiquidGlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

