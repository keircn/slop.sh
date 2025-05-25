'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPause, FaPlay, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { useAudio } from '~/context/AudioContext';
import { AudioPlayerProps } from '~/types/Audio';

export function AudioPlayer({
  audioSrc,
  autoPlay = false,
  className = '',
  variants,
  trackName = 'Clara',
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [gain, setGain] = useState(2);
  const [isMuted, setIsMuted] = useState(false);
  const { isAudioEnabled, autoPlay: contextAutoPlay } = useAudio();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        sourceNodeRef.current =
          audioContextRef.current.createMediaElementSource(audio);

        sourceNodeRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }
    };

    audio.volume = isMuted ? 0 : volume;
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : gain;
    }

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    };

    const handlePlay = () => {
      initAudioContext();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);

    if (autoPlay || contextAutoPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('Audio autoplay was prevented:', error);
            setIsPlaying(false);
          });
      }
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
      }
    };
  }, [
    audioSrc,
    autoPlay,
    volume,
    gain,
    isMuted,
    contextAutoPlay,
    isAudioEnabled,
  ]);

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
      audio.dataset.userPaused = 'true';
    } else {
      delete audio.dataset.userPaused;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Audio play was prevented:', error);
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

  const handleGainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGain = parseFloat(e.target.value);
    setGain(newGain);

    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : newGain;
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (audioRef.current) {
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newMutedState ? 0 : gain;
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
      <audio ref={audioRef} src={audioSrc} loop />
      <div className='bg-card border-border/30 relative ml-4 flex items-center gap-2 rounded border p-1.5 shadow-sm'>
        <div className='flex items-center gap-1'>
          <motion.button
            onClick={skipTrack}
            className='text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center rounded-full transition-colors'
            aria-label='Previous track'
            whileHover={{ scale: 1.1, color: '#fff' }}
            whileTap={{ scale: 0.9 }}
          >
            <MdSkipPrevious size={16} />
          </motion.button>

          <motion.button
            onClick={togglePlayPause}
            className={`bg-primary text-primary-foreground hover:bg-primary/90 flex h-7 w-7 items-center justify-center rounded-full transition-colors ${isPlaying ? 'shadow-inner' : 'shadow-sm'}`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <FaPause size={10} />
            ) : (
              <FaPlay size={10} className='ml-0.5' />
            )}
          </motion.button>

          <motion.button
            onClick={skipTrack}
            className='text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center rounded-full transition-colors'
            aria-label='Next track'
            whileHover={{ scale: 1.1, color: '#fff' }}
            whileTap={{ scale: 0.9 }}
          >
            <MdSkipNext size={16} />
          </motion.button>
        </div>

        <div className='hidden items-center gap-2 md:flex'>
          <motion.div
            className='text-muted-foreground w-16 overflow-hidden text-xs whitespace-nowrap'
            animate={isPlaying ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.7 }}
            transition={
              isPlaying
                ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : {}
            }
          >
            {trackName.length > 10 ? (
              <motion.div
                animate={
                  isPlaying && trackName.length > 10
                    ? {
                        x: [-5, -trackName.length * 4, -5],
                      }
                    : {}
                }
                transition={{
                  duration: trackName.length * 0.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'linear',
                  delay: 1,
                  repeatDelay: 1,
                }}
              >
                {trackName}
              </motion.div>
            ) : (
              trackName
            )}
          </motion.div>

          <div className='group relative'>
            <motion.button
              onClick={toggleMute}
              className='text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center rounded-full transition-colors'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <FaVolumeMute size={14} />
              ) : (
                <FaVolumeUp size={14} />
              )}
            </motion.button>

            <div className='pointer-events-none absolute top-full right-0 z-20 pt-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100'>
              <div className='bg-card border-border/30 flex flex-col gap-3 rounded-md border p-3 shadow-md'>
                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground w-12 text-xs'>
                    Volume
                  </span>
                  <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.01'
                    value={volume}
                    onChange={handleVolumeChange}
                    className='accent-primary h-2 w-20'
                    aria-label='Volume'
                  />
                  <span className='text-muted-foreground w-8 text-xs'>
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground w-12 text-xs'>
                    Boost
                  </span>
                  <input
                    type='range'
                    min='0.1'
                    max='5'
                    step='0.1'
                    value={gain}
                    onChange={handleGainChange}
                    className='accent-primary h-2 w-20'
                    aria-label='Audio Gain Boost'
                  />
                  <span className='text-muted-foreground w-8 text-xs'>
                    {gain.toFixed(1)}x
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
