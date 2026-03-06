'use client';

import { Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Butuh Bantuan Segera?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Tim support kami siap membantu menyelesaikan kendala Anda
          dengan cepat dan efisien.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <a href="tel:(0856)9281-4722">
            <Button
              size="lg"
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Phone className="h-4 w-4" />
              Telepon Sekarang
            </Button>
          </a>
          <a href="mailto:primaryobbama@gmail.com">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-2"
            >
              <Mail className="h-4 w-4" />
              Kirim Email
            </Button>
          </a>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Responsif • Profesional • Solutif
        </p>
      </div>
    </div>
  );
};
