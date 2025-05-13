"use client";

import { PageTransition } from "~/components/PageTransition";
import { ContactForm } from "~/components/ContactForm";
import { SocialLinks } from "~/components/SocialLinks";
import { Card } from "~/components/ui/card";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <PageTransition>
      <main className="relative min-h-screen w-full pt-8">
        <div className="container mx-auto flex flex-col items-center justify-center mt-16 pb-16">
          <div className="max-w-3xl w-full relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h1 className="text-3xl font-bold mb-6">Contact Me</h1>
                <div className="space-y-8">
                  <SocialLinks />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-4 text-sm text-muted-foreground">
                        or send me a message
                      </span>
                    </div>
                  </div>
                  <ContactForm />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
