'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { AudioContextType } from '~/types/Audio';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [isAudioEnabled, setAudioEnabled] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (hasInteracted && isAudioEnabled) {
      setAutoPlay(true);
    }
  }, [hasInteracted, isAudioEnabled]);

  return (
    <AudioContext.Provider
      value={{
        isAudioEnabled,
        setAudioEnabled,
        hasInteracted,
        setHasInteracted,
        autoPlay,
        setAutoPlay,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
