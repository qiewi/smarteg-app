import Header from '@/components/common/Header'
import HeroSection from '@/components/landing/HeroSection'
import FeatureSection from '@/components/landing/FeatureSection'
import Footer from '@/components/common/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  )
}
