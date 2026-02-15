import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { SystemGallery } from "@/components/system-gallery"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <SystemGallery />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
