import type { ReactNode } from "react";
import { AboutPage } from "@/components/about/AboutPage";
import { AreaPage, AreasPage } from "@/components/catalog/AreasPage";
import { HomesPage } from "@/components/catalog/HomesPage";
import { ContactPage } from "@/components/contact/ContactPage";
import { FAQ } from "@/components/faq/FAQ";
import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Image } from "@/components/ui/Image";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";
import type { PageMatch } from "@/lib/pages";

function BackHome() {
  const label = useContent().pages.backHome;
  return (
    <a
      href="/"
      className="inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-medium text-white"
    >
      ← {label}
    </a>
  );
}

function Frame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="min-h-svh bg-background">
      <Header solid />
      <main className="page-container py-10 md:py-14">
        <BackHome />
        <div className="mt-8">
        <SectionEyebrow index="" label={eyebrow} />
        <h1 className="mt-4 max-w-3xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.12] font-medium tracking-[-0.02em] text-foreground">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-foreground-muted">{description}</p>
        </div>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function InnerPages({ match }: { match: Exclude<PageMatch, { id: "home" }> }) {
  const content = useContent();
  const { pages, process, brand } = content;

  if (match.id === "homes") return <HomesPage />;

  if (match.id === "areas") return <AreasPage />;

  if (match.id === "area") return <AreaPage slug={match.slug} />;

  if (match.id === "sell") {
    const copy = pages.sell;
    return (
      <Frame eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
        <div className="relative mt-10 aspect-[16/7] overflow-hidden rounded-[1.5rem] ring-1 ring-white/10">
          <Image src="/section2.png" alt={copy.imageAlt} fill sizes="90vw" className="object-cover" />
        </div>
        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {process.map((step) => (
            <li key={step.number} className="rounded-2xl border border-white/10 p-6">
              <p className="text-[10px] tracking-[0.18em] text-electric-soft uppercase">
                {step.tag} · {step.number}
              </p>
              <h2 className="mt-3 font-serif text-2xl text-foreground">{step.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{step.description}</p>
            </li>
          ))}
        </ol>
        <a
          href={brand.phoneHref}
          className="mt-10 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black"
        >
          {brand.phone}
        </a>
      </Frame>
    );
  }

  if (match.id === "about") return <AboutPage />;

  if (match.id === "contact") return <ContactPage />;

  if (match.id === "faq") {
    return (
      <div className="min-h-svh bg-background">
        <Header solid />
        <div className="page-container pt-10">
          <BackHome />
        </div>
        <FAQ heading="h1" />
        <SiteFooter />
      </div>
    );
  }

  return (
    <Frame eyebrow={brand.name} title={pages.notFound.title} description={pages.notFound.description} />
  );
}
