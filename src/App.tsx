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
import { LanguageProvider, useContent } from "@/content/language";
import { matchPage } from "@/lib/pages";
import { RouteProvider, usePathname } from "@/lib/router";
import { InnerPages } from "@/pages/InnerPages";
import { AdminSeo, Seo } from "@/components/seo/Seo";
import { trackPage } from "@/lib/track";

export default function App() {
  const isAdmin = window.location.pathname === "/admin";

  if (isAdmin) {
    return (
      <>
        <AdminSeo />
        <AdminPage />
      </>
    );
  }

  return (
    <LanguageProvider>
      <RouteProvider>
        <Site />
      </RouteProvider>
    </LanguageProvider>
  );
}

function Site() {
  const path = usePathname();
  const match = matchPage(path, useContent());

  useEffect(() => {
    trackPage(path);
  }, [path]);

  return (
    <>
      <Seo />
      {match.id === "home" ? (
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
          <OfferDialog />
        </main>
      ) : (
        <InnerPages match={match} />
      )}
      <WhatsAppButton />
    </>
  );
}
