import { z } from "zod";

const activityAssetsSchema = z.object({
  largeImage: z.string().nullable(),
  largeText: z.string().nullable(),
  smallImage: z.string().nullable(),
  smallText: z.string().nullable(),
});

const activityTimestampsSchema = z.object({
  start: z.date().nullable(),
  end: z.date().nullable(),
});

export const activitySchema = z.object({
  applicationId: z.string(),
  assets: activityAssetsSchema,
  details: z.string(),
  emoji: z.string(),
  name: z.string(),
  state: z.string(),
  title: z.string(),
  timestamps: activityTimestampsSchema,
  type: z.string(),
});

export const presenceSchema = z.object({
  _id: z.string(),
  tag: z.string(),
  pfp: z.string(),
  platform: z.array(z.string()),
  status: z.string(),
  activities: z.array(activitySchema),
  badges: z.array(z.string()),
  customStatus: z.object({
    name: z.string(),
    createdTimestamp: z.number(),
    emoji: z.string(),
  }),
});

const rawActivityAssetsSchema = z.object({
  largeImage: z.string().nullable().optional(),
  largeText: z.string().nullable().optional(),
  smallImage: z.string().nullable().optional(),
  smallText: z.string().nullable().optional(),
});

const rawActivityTimestampsSchema = z.object({
  start: z.union([z.number(), z.string()]).optional(),
  end: z.union([z.number(), z.string()]).optional(),
});

export const rawActivitySchema = z.object({
  applicationId: z.string().optional(),
  assets: rawActivityAssetsSchema.optional(),
  details: z.string().optional(),
  emoji: z.string().optional(),
  name: z.string().optional(),
  state: z.string().optional(),
  title: z.string().optional(),
  timestamps: rawActivityTimestampsSchema.optional(),
  type: z.string().optional(),
});

export const rawPresenceSchema = z.object({
  _id: z.string().optional(),
  tag: z.string().optional(),
  pfp: z.string().optional(),
  platform: z.union([z.record(z.string()), z.null()]).optional(),
  status: z.string().optional(),
  activities: z.array(rawActivitySchema).optional(),
  badges: z.array(z.string()).optional(),
  customStatus: z
    .object({
      name: z.string().optional(),
      createdTimestamp: z.number().optional(),
      emoji: z.string().optional(),
    })
    .optional(),
});

export type Activity = z.infer<typeof activitySchema>;
export type Presence = z.infer<typeof presenceSchema>;
export type RawActivityData = z.infer<typeof rawActivitySchema>;
export type RawPresenceData = z.infer<typeof rawPresenceSchema>;
