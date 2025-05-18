'use client';

import { PageTransition } from '~/components/PageTransition';
import { ContactForm } from '~/components/ContactForm';
import { SocialLinks } from '~/components/SocialLinks';
import { Card } from '~/components/ui/card';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <PageTransition>
      <main className='relative min-h-screen w-full pt-8'>
        <div className='container mx-auto mt-16 flex flex-col items-center justify-center pb-16'>
          <div className='relative z-10 w-full max-w-3xl'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='space-y-6 flex flex-col items-center w-full'
            >
              <Card className='p-6 w-full'>
                <h1 className='mb-6 text-3xl font-bold'>Contact Me</h1>
                <div className='space-y-8'>
                  <SocialLinks />
                  <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='border-border w-full border-t' />
                    </div>
                    <div className='relative flex justify-center'>
                      <span className='bg-card text-muted-foreground px-4 text-sm'>
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
