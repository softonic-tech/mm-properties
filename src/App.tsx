import { useEffect } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Hero } from "@/components/hero/Hero";
import { Experience } from "@/components/experience/Experience";
import { Paths } from "@/components/paths/Paths";
import { Process } from "@/components/process/Process";
import { ReportSection } from "@/components/report/ReportSection";
import { FeatureHome } from "@/components/feature/FeatureHome";
import { ListingsSection } from "@/components/listings/ListingsSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { FAQ } from "@/components/faq/FAQ";
import { ContactSection } from "@/components/contact/ContactSection";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { OfferDialog } from "@/components/offer/OfferDialog";
import { LanguageProvider } from "@/content/language";

const VISIT_KEY = "mm-visit-logged";

export default function App() {
  const isAdmin = window.location.pathname === "/admin";

  useEffect(() => {
    if (isAdmin || sessionStorage.getItem(VISIT_KEY)) return;
    const locale = localStorage.getItem("mm-locale") === "es" ? "es" : "en";
    sessionStorage.setItem(VISIT_KEY, "1");
    void fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
  }, [isAdmin]);

  if (isAdmin) return <AdminPage />;

  return (
    <LanguageProvider>
    <main>
      <Hero />
      <Experience />
      <Paths />
      <Process />
      <ReportSection />
      <FeatureHome />
      <ListingsSection />
      <TestimonialsSection />
      <FAQ />
      <ContactSection />
      <WhatsAppButton />
      <OfferDialog />
    </main>
    </LanguageProvider>
  );
}
