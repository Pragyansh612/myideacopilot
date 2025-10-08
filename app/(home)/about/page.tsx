import { AboutHero } from "@/components/about/about-hero"
import { OurStory } from "@/components/about/our-story"
import { OurMission } from "@/components/about/our-mission"
import { OurValues } from "@/components/about/our-values"
// import { OurTeam } from "@/components/about/our-team"
// import { JoinUs } from "@/components/about/join-us"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <OurStory />
      <OurMission />
      <OurValues />
      {/* <OurTeam /> */}
      {/* <JoinUs /> */}
    </main>
  )
}