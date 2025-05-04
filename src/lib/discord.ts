import {
  Presence,
  Activity,
  RawActivityData,
  RawPresenceData,
  rawActivitySchema,
  rawPresenceSchema,
  activitySchema,
  presenceSchema,
} from "~/types/Presence";

export const transformActivity = (activity: RawActivityData): Activity => {
  const validatedRaw = rawActivitySchema.parse(activity);

  const transformed = {
    applicationId: validatedRaw.applicationId || "",
    details: validatedRaw.details || "",
    emoji: validatedRaw.emoji || "",
    name: validatedRaw.name || "",
    state: validatedRaw.state || "",
    title: validatedRaw.title || "",
    type: validatedRaw.type || "",
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
      typeof validatedRaw.platform === "object" &&
      validatedRaw.platform !== null
    ) {
      platformArray = Object.entries(validatedRaw.platform).map(
        ([key, value]) => `${key}:${value}`,
      );
    }
  }

  const transformed = {
    _id: validatedRaw._id || "",
    tag: validatedRaw.tag || "",
    pfp: validatedRaw.pfp || "",
    platform: platformArray,
    status: validatedRaw.status || "offline",
    activities: (validatedRaw.activities || []).map(transformActivity),
    badges: validatedRaw.badges || [],
    customStatus: {
      name: validatedRaw.customStatus?.name || "",
      createdTimestamp: validatedRaw.customStatus?.createdTimestamp || 0,
      emoji: validatedRaw.customStatus?.emoji || "",
    },
  };

  return presenceSchema.parse(transformed);
};
