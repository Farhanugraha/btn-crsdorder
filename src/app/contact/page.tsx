import {
  HeroSection,
  WelcomeSection,
  ContactChannels,
  CommonIssues,
  QuickTips,
  CTASection,
  ClosingMessage
} from '@/components/contact';

export default function ContactPage() {
  return (
    <div className="space-y-12 pb-12">
      <HeroSection />

      <div className="mx-auto max-w-6xl space-y-12 px-4">
        <WelcomeSection />
        <ContactChannels />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <CommonIssues />
          <QuickTips />
        </div>

        <CTASection />
        <ClosingMessage />
      </div>
    </div>
  );
}
