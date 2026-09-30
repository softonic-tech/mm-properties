import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Image } from "@/components/ui/Image";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";

export function AboutPage() {
  const { pages } = useContent();
  const about = pages.about;

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
          <SectionEyebrow index="" label={about.eyebrow} />
          <h1 className="mt-4 font-serif text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[1.02] font-medium tracking-[-0.03em] text-balance text-foreground">
            {about.title}
          </h1>
        </div>

        <div className="mt-10 grid items-stretch gap-5 lg:mt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <article className="relative min-h-[28rem] overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
            <Image src={about.image} alt={about.imageAlt} fill priority className="object-cover object-[center_68%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
            <div className="relative flex h-full min-h-[28rem] flex-col justify-end p-6 md:p-9">
              <p className="text-[11px] tracking-[0.18em] text-white/70 uppercase">{about.contactLabel}</p>
              <address className="mt-4 text-sm leading-7 text-white/80 not-italic">
                {about.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <a href={`mailto:${about.email}`} className="mt-4 text-sm text-white hover:text-white/70">
                {about.email}
              </a>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 md:p-9">
            <div className="flex flex-col gap-5">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-[15px] leading-[1.75] text-foreground-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-8 font-serif text-2xl leading-snug text-foreground">{about.close}</p>
            <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6">
              {about.phones.map((phone) => (
                <a key={phone.href} href={phone.href} className="font-serif text-2xl leading-none text-foreground hover:text-white/70">
                  {phone.label}
                </a>
              ))}
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
