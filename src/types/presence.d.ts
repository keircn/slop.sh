export interface Activity {
  applicationId: string;
  assets: {
    largeImage: string | null;
    largeText: string | null;
    smallImage: string | null;
    smallText: string | null;
  };
  details: string;
  emoji: string;
  name: string;
  state: string;
  title: string;
  timestamps: {
    start: Date | null;
    end: Date | null;
  };
  type: string;
}

export interface Presence {
  _id: string;
  tag: string;
  pfp: string;
  platform: string[];
  status: string;
  activities: Activity[];
  badges: string[];
  customStatus: {
    name: string;
    createdTimestamp: number;
    emoji: string;
  };
}

export interface RawActivityData {
  applicationId?: string;
  assets?: {
    largeImage?: string | null;
    largeText?: string | null;
    smallImage?: string | null;
    smallText?: string | null;
  };
  details?: string;
  emoji?: string;
  name?: string;
  state?: string;
  title?: string;
  timestamps?: {
    start?: number | string;
    end?: number | string;
  };
  type?: string;
}

export interface RawPresenceData {
  _id?: string;
  tag?: string;
  pfp?: string;
  platform?: Record<string, string> | null;
  status?: string;
  activities?: RawActivityData[];
  badges?: string[];
  customStatus?: {
    name?: string;
    createdTimestamp?: number;
    emoji?: string;
  };
}
