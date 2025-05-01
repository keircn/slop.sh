import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import slugify from "slugify";
import { rateLimit } from "~/lib/rate-limit";
import { homedir } from "os";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const messagesDir = join(homedir + "/.slop/messages");

export async function POST(req: Request) {
  try {
    await limiter.check(10, "CACHE_TOKEN");

    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { message: "Subject and message are required" },
        { status: 400 },
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 },
      );
    }

    await mkdir(messagesDir, { recursive: true });

    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, "-");
    const slug = slugify(subject, { lower: true, strict: true });
    const filename = `${timestamp}-${slug}.md`;

    const markdown = `---
date: ${date.toISOString()}
subject: ${subject}
name: ${name || "Anonymous"}
email: ${email || "Not provided"}
---

${message}
`;

    await writeFile(join(messagesDir, filename), markdown);

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Rate limit exceeded") {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 },
    );
  }
}
