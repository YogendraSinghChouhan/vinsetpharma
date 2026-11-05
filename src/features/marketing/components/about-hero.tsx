import Image from "next/image";
import { BlisterPocket } from "@/components/brand/blister-pocket";
import { Container } from "@/components/layout/container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/config/site";
import { ABOUT, FOUNDER, PAGE_META } from "../content";

export function AboutHero() {
  return (
    <header className="border-b border-border/80 bg-surface-tint/40">
      <Container className="py-10 sm:py-14 lg:py-16">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.home}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{PAGE_META.about.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* Text column: contents on mobile (so children interleave with portrait), flex column on desktop */}
          <div className="contents lg:col-span-7 lg:flex lg:flex-col lg:gap-6">
            {/* 1. Page Title */}
            <h1 className="order-1 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {PAGE_META.about.title}
            </h1>

            {/* 2. Intro sentence */}
            <p className="order-2 text-base leading-relaxed text-foreground/90 font-medium sm:text-lg">
              {ABOUT.header.intro}
            </p>

            {/* 3. Leadership introduction & principles */}
            <div className="order-4 flex flex-col gap-4">
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {FOUNDER.intro}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {FOUNDER.principles}
              </p>

              {/* Optional message / bio blocks (render nothing when null) */}
              {FOUNDER.message ? (
                <blockquote className="rounded-xl border-l-2 border-primary/60 bg-surface-tint/60 p-4 pl-5 text-base italic text-foreground">
                  <p>“{FOUNDER.message.text}”</p>
                  <footer className="mt-2 text-sm not-italic font-medium text-muted-foreground">
                    — {FOUNDER.message.attribution}
                  </footer>
                </blockquote>
              ) : null}

              {FOUNDER.bio ? (
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {FOUNDER.bio}
                </p>
              ) : null}
            </div>
          </div>

          {/* Leadership portrait frame with name plate */}
          <figure className="order-3 mx-auto w-full max-w-[420px] lg:col-span-5 lg:mx-0 lg:max-w-none">
            <BlisterPocket depth="subtle" className="p-2 sm:p-2.5">
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-muted/40">
                <Image
                  src={FOUNDER.image.src}
                  alt={FOUNDER.image.alt}
                  width={FOUNDER.image.width}
                  height={FOUNDER.image.height}
                  priority
                  className="h-full w-full object-cover object-[50%_20%]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 420px, 460px"
                />
              </div>
              <figcaption className="px-3 pt-3 pb-2 text-left">
                <div className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {FOUNDER.image.personName}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {FOUNDER.image.personRole}
                </div>
              </figcaption>
            </BlisterPocket>
          </figure>
        </div>
      </Container>
    </header>
  );
}
