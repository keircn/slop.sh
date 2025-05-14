import {
  Presence,
  Activity,
  RawActivityData,
  RawPresenceData,
  rawActivitySchema,
  rawPresenceSchema,
  activitySchema,
  presenceSchema,
} from '~/types/Presence';

export const transformActivity = (activity: RawActivityData): Activity => {
  const validatedRaw = rawActivitySchema.parse(activity);

  const transformed = {
    applicationId: validatedRaw.applicationId || '',
    details: validatedRaw.details || '',
    emoji: validatedRaw.emoji || '',
    name: validatedRaw.name || '',
    state: validatedRaw.state || '',
    title: validatedRaw.title || '',
    type: validatedRaw.type || '',
    timestamps: {
      start: validatedRaw.timestamps?.start
        ? new Date(validatedRaw.timestamps.start)
        : null,
      end: validatedRaw.timestamps?.end
        ? new Date(validatedRaw.timestamps.end)
        : null,
    },
    assets: {
      largeImage: validatedRaw.assets?.largeImage || null,
      smallImage: validatedRaw.assets?.smallImage || null,
      largeText: validatedRaw.assets?.largeText || null,
      smallText: validatedRaw.assets?.smallText || null,
    },
  };

  return activitySchema.parse(transformed);
};

export const transformPresence = (data: RawPresenceData): Presence => {
  const validatedRaw = rawPresenceSchema.parse(data);

  let platformArray: string[] = [];

  if (validatedRaw.platform) {
    if (Array.isArray(validatedRaw.platform)) {
      platformArray = validatedRaw.platform;
    } else if (
      typeof validatedRaw.platform === 'object' &&
      validatedRaw.platform !== null
    ) {
      platformArray = Object.entries(validatedRaw.platform).map(
        ([key, value]) => `${key}:${value}`
      );
    }
  }

  const transformed = {
    _id: validatedRaw._id || '',
    tag: validatedRaw.tag || '',
    pfp: validatedRaw.pfp || '',
    platform: platformArray,
    status: validatedRaw.status || 'offline',
    activities: (validatedRaw.activities || []).map(transformActivity),
    badges: validatedRaw.badges || [],
    customStatus: {
      name: validatedRaw.customStatus?.name || '',
      createdTimestamp: validatedRaw.customStatus?.createdTimestamp || 0,
      emoji: validatedRaw.customStatus?.emoji || null,
    },
  };

  return presenceSchema.parse(transformed);
};

export function normalizePresenceData(presenceData: RawPresenceData): Presence {
  try {
    const data = JSON.parse(JSON.stringify(presenceData));

    if (data.activities && Array.isArray(data.activities)) {
      data.activities = data.activities.map((activity: RawActivityData) => {
        if (activity.timestamps) {
          if (activity.timestamps.start) {
            activity.timestamps.start = new Date(activity.timestamps.start);
          } else {
            activity.timestamps.start = undefined;
          }

          if (activity.timestamps.end) {
            activity.timestamps.end = new Date(activity.timestamps.end);
          } else {
            activity.timestamps.end = undefined;
          }
        }

        return {
          applicationId: activity.applicationId || '',
          assets: {
            largeImage: activity.assets?.largeImage || null,
            largeText: activity.assets?.largeText || null,
            smallImage: activity.assets?.smallImage || null,
            smallText: activity.assets?.smallText || null,
          },
          details: activity.details || '',
          emoji: activity.emoji || '',
          name: activity.name || '',
          state: activity.state || '',
          title: activity.title || activity.name || '',
          timestamps: activity.timestamps || { start: null, end: null },
          type: activity.type || '',
        };
      });
    } else {
      data.activities = [];
    }

    if (data.platform && !Array.isArray(data.platform)) {
      if (data.platform === null || data.platform === undefined) {
        data.platform = [];
      } else if (typeof data.platform === 'object') {
        data.platform = Object.keys(data.platform).filter(
          (key) => data.platform[key] === true
        );
      } else {
        data.platform = [String(data.platform)];
      }
    }

    data._id = data._id || '';
    data.tag = data.tag || '';
    data.pfp = data.pfp || '';
    data.status = data.status || 'offline';
    data.badges = data.badges || [];
    data.customStatus = data.customStatus || { name: '', createdTimestamp: 0 };

    return presenceSchema.parse(data);
  } catch (error) {
    console.error('Failed to normalize presence data:', error);
    throw new Error('Invalid presence data format');
  }
}

export function connectToDiscordWebSocket(
  url: string,
  userId: string
): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    try {
      const socket = new WebSocket(url);

      socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ userId }));
        resolve(socket);
      });

      socket.addEventListener('error', () => {
        reject(new Error('WebSocket connection failed'));
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function createKeepAlive(
  socket: WebSocket,
  interval = 10000
): () => void {
  const pingInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send('ping');
    }
  }, interval);

  return () => clearInterval(pingInterval);
}
