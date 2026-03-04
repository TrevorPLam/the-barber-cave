'use client';

/**
 * @file Hero call-to-action buttons (client island)
 * @description Client component containing the interactive CTA buttons for the Hero section.
 * Isolated as a client island so the rest of Hero remains a server component.
 */

import Button from '@/components/Button';
import { EXTERNAL_LINKS } from '@/data/constants';

/**
 * Renders the call-to-action buttons for the hero section.
 *
 * @returns A flex row of primary and secondary CTA buttons.
 */
export default function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      <Button
        variant="accent"
        href={EXTERNAL_LINKS.booking}
        target="_blank"
        rel="noopener noreferrer"
      >
        Book Your Appointment
      </Button>
      <Button
        variant="secondary"
        href="#work"
      >
        View Our Work
      </Button>
    </div>
  );
}
