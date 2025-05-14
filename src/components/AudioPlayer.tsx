"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPause, FaPlay, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { Variants } from "framer-motion";
import { useAudio } from "~/context/AudioContext";

interface AudioPlayerProps {
    audioSrc: string;
    autoPlay?: boolean;
    className?: string;
    variants?: Variants;
    trackName?: string;
}

export function AudioPlayer({ audioSrc, autoPlay = false, className = "", variants, trackName = "Background Music" }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const { isAudioEnabled, autoPlay: contextAutoPlay } = useAudio();

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = isMuted ? 0 : volume;

        const handleEnded = () => {
            audio.currentTime = 0;
            audio.play().catch(console.error);
        };

        audio.addEventListener("ended", handleEnded);

        if (autoPlay || contextAutoPlay) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch(error => {
                        console.log("Audio autoplay was prevented:", error);
                        setIsPlaying(false);
                    });
            }
        }

        return () => {
            if (audio) {
                audio.pause();
                audio.removeEventListener("ended", handleEnded);
            }
        };
    }, [audioSrc, autoPlay, volume, isMuted, contextAutoPlay, isAudioEnabled]);
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isAudioEnabled && !isPlaying && !audio.dataset.userPaused) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch(console.error);
            }
        }
    }, [isAudioEnabled, isPlaying]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            audio.dataset.userPaused = "true";
        } else {
            delete audio.dataset.userPaused;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio play was prevented:", error);
                });
            }
        }

        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);

        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        if (audioRef.current) {
            audioRef.current.volume = newMutedState ? 0 : volume;
        }
    };

    const skipTrack = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            if (!isPlaying) {
                togglePlayPause();
            }
        }
    };

    return (
        <motion.div
            className={`audio-player z-[60] ${className}`}
            variants={variants}
        >
            <audio
                ref={audioRef}
                src={audioSrc}
                loop
            />
            <div className="bg-card border border-border/30 p-1.5 rounded-full shadow-sm flex items-center gap-2 relative ml-2">
                <div className="flex items-center gap-1">
                    <motion.button
                        onClick={skipTrack}
                        className="w-6 h-6 rounded-full text-muted-foreground flex items-center justify-center hover:text-foreground transition-colors"
                        aria-label="Previous track"
                        whileHover={{ scale: 1.1, color: "#fff" }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <MdSkipPrevious size={16} />
                    </motion.button>

                    <motion.button
                        onClick={togglePlayPause}
                        className={`w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors ${isPlaying ? 'shadow-inner' : 'shadow-sm'}`}
                        aria-label={isPlaying ? "Pause" : "Play"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isPlaying ? (
                            <FaPause size={10} />
                        ) : (
                            <FaPlay size={10} className="ml-0.5" />
                        )}
                    </motion.button>

                    <motion.button
                        onClick={skipTrack}
                        className="w-6 h-6 rounded-full text-muted-foreground flex items-center justify-center hover:text-foreground transition-colors"
                        aria-label="Next track"
                        whileHover={{ scale: 1.1, color: "#fff" }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <MdSkipNext size={16} />
                    </motion.button>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <motion.div
                        className="text-xs text-muted-foreground whitespace-nowrap w-16 overflow-hidden"
                        animate={isPlaying ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.7 }}
                        transition={isPlaying ? {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        } : {}}
                    >
                        {trackName.length > 10 ? (
                            <motion.div
                                animate={isPlaying && trackName.length > 10 ? {
                                    x: [-5, -trackName.length * 4, -5]
                                } : {}}
                                transition={{
                                    duration: trackName.length * 0.5,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "linear",
                                    delay: 1,
                                    repeatDelay: 1
                                }}
                            >
                                {trackName}
                            </motion.div>
                        ) : trackName}
                    </motion.div>

                    <div className="relative group">
                        <motion.button
                            onClick={toggleMute}
                            className="w-6 h-6 rounded-full text-muted-foreground flex items-center justify-center hover:text-foreground transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted || volume === 0 ? (
                                <FaVolumeMute size={14} />
                            ) : (
                                <FaVolumeUp size={14} />
                            )}
                        </motion.button>

                        <div className="absolute opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto top-full right-0 pt-2 z-20 transition-opacity">
                            <div className="bg-card border border-border/30 shadow-md rounded-md p-2 flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 h-2 accent-primary"
                                    aria-label="Volume"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
