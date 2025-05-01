"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { motion } from "framer-motion";
import { BiSend } from "react-icons/bi";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
          <p className="text-muted-foreground">
            Your message has been sent successfully. I&apos;ll get back to you
            as soon as possible.
          </p>
          <Button
            className="mt-4"
            onClick={() => setSubmitted(false)}
            variant="outline"
          >
            Send another message
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="name">
          Name <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          type="text"
          id="name"
          className="w-full px-4 py-2 rounded-md bg-background border border-input focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="email">
          Email <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-2 rounded-md bg-background border border-input focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="subject">
          Subject <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="subject"
          required
          className="w-full px-4 py-2 rounded-md bg-background border border-input focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="message">
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          className="w-full px-4 py-2 rounded-md bg-background border border-input focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
        ) : (
          <>
            <BiSend size={18} />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
