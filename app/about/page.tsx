import { AboutHero } from "@/components/about-hero"
import { AboutContent } from "@/components/about-content"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-professional font-professional">
      <AboutHero />
      <AboutContent />
      <Footer />
    </div>
  )
}
