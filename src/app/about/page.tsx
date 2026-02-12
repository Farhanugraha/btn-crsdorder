import { AboutHero, AboutContent } from '@/components/about';

export default function AboutPage() {
  return (
    <div className="container mx-auto min-h-screen px-4 py-8 md:py-12">
      <div className="flex flex-col gap-10 md:flex-row md:gap-12 lg:gap-16">
        <div className="w-full md:w-[35%] lg:w-[30%]">
          <AboutHero />
        </div>

        <div className="w-full md:w-[65%] lg:w-[70%]">
          <AboutContent />
        </div>
      </div>
    </div>
  );
}
