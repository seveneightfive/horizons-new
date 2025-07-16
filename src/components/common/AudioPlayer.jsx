import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AudioPlayer = ({ song, onClose }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
        };

        const setAudioTime = () => {
            setProgress(audio.currentTime);
        };

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
        };
    }, []);
    
    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        if(isPlaying) {
          audio.play().catch(e => console.error("Audio play failed:", e));
        } else {
          audio.pause();
        }
      }
    }, [isPlaying]);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <AnimatePresence>
            {song && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white shadow-[0_-5px_20px_rgba(0,0,0,0.2)]"
                >
                    <div className="container mx-auto px-4 py-3 flex items-center gap-4">
                        <audio ref={audioRef} src={song.url} preload="metadata"></audio>
                        <Button onClick={togglePlayPause} size="icon" variant="ghost" className="hover:bg-white/10">
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>
                        <div className="flex-grow flex items-center gap-3">
                            <span className="font-bold w-48 truncate">{song.title}</span>
                            <div className="w-full bg-slate-600 rounded-full h-1.5">
                                <motion.div
                                    className="bg-white h-1.5 rounded-full"
                                    style={{ width: `${(progress / duration) * 100 || 0}%` }}
                                ></motion.div>
                            </div>
                            <span className="text-sm text-slate-400 w-12 text-right">{duration ? formatTime(duration) : '0:00'}</span>
                        </div>
                        <Button onClick={onClose} size="icon" variant="ghost" className="hover:bg-white/10">
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AudioPlayer;