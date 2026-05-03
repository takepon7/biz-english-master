import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ScenariosSection } from "@/components/landing/ScenariosSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";

export default async function Page() {
  const { userId } = await auth();
  if (userId) {
    redirect("/practice");
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <ScenariosSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
