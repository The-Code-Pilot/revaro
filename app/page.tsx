import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { FAQ } from "@/components/marketing/faq";
import { Features } from "@/components/marketing/features";
import { FinalCTA } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Pricing } from "@/components/marketing/pricing";
import { ProductPreview } from "@/components/marketing/product-preview";
import { SocialProof } from "@/components/marketing/social-proof";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductPreview />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
