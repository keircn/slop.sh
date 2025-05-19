export interface AudioContextType {
  isAudioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  hasInteracted: boolean;
  setHasInteracted: (interacted: boolean) => void;
  autoPlay: boolean;
  setAutoPlay: (autoPlay: boolean) => void;
}

export interface AudioPlayerProps {
  audioSrc: string;
  autoPlay?: boolean;
  className?: string;
  variants?: Variants;
  trackName?: string;
}

export interface AudioProviderProps {
  children: ReactNode;
}
