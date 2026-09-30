import { InquiryForm } from "@/components/contact/InquiryForm";
import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialMark } from "@/components/layout/SocialMarks";
import { Image } from "@/components/ui/Image";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";

export function ContactPage() {
  const { brand, contact, offer, pages } = useContent();

  return (
    <div className="min-h-svh bg-background">
      <Header solid />
      <main className="page-container py-10 md:py-14">
        <a
          href="/"
          className="inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-medium text-white"
        >
          ← {pages.backHome}
        </a>

        <div className="mt-8 max-w-3xl">
          <SectionEyebrow index="" label={contact.eyebrow} />
          <h1 className="mt-4 font-serif text-[clamp(2.5rem,5.4vw,4.4rem)] leading-[1.05] font-medium tracking-[-0.02em] text-foreground">
            {contact.pageTitle}
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-foreground-muted">{contact.pageText}</p>
        </div>

        <div className="mt-10 grid items-stretch gap-5 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          <article className="relative min-h-[28rem] overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
            <Image src={contact.image} alt={contact.imageAlt} fill className="object-cover object-[center_68%]" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/15" />
            <div className="relative flex h-full min-h-[28rem] flex-col justify-end p-6 md:p-9">
              <p className="text-[11px] tracking-[0.18em] text-white/70 uppercase">{contact.tagline}</p>
              <a
                href={brand.phoneHref}
                aria-label={brand.phoneAria}
                className="mt-4 font-serif text-[2.6rem] leading-none text-white md:text-5xl"
              >
                {brand.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="mt-4 text-sm text-white/80 hover:text-white">
                {contact.email}
              </a>
              <address className="mt-8 text-sm leading-7 text-white/75 not-italic">
                {contact.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <div className="mt-8 flex flex-nowrap items-center gap-2.5 overflow-x-auto pb-1">
                {contact.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="social-float-item inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_10px_28px_rgba(0,0,0,0.35)] transition-transform hover:scale-110"
                  >
                    <SocialMark label={social.label} className="size-full" />
                  </a>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 md:p-9">
            <p className="text-[11px] tracking-[0.18em] text-foreground-subtle uppercase">{contact.writeLabel}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground-muted">{offer.formIntro}</p>
            <div className="mt-7">
              <InquiryForm includeNote roomy submitLabel={offer.send} />
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
