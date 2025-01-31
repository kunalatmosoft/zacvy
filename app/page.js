import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Testimonials from "@/components/Testimonials"
import Pricing from "@/components/Pricing"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <br/>
      <br/>
      <br/>
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  )
}

