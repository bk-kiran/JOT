import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Differentiators from '@/components/Differentiators';
import UseCases from '@/components/UseCases';
import FeaturesGrid from '@/components/FeaturesGrid';
import WaitlistCTA from '@/components/WaitlistCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <Differentiators />
      <UseCases />
      <FeaturesGrid />
      <WaitlistCTA />
      <Footer />
    </main>
  );
}
