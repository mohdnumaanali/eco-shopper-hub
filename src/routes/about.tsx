import { createFileRoute } from "@tanstack/react-router";

import aboutImage from "@/assets/about-eco.jpg";
import { Layout } from "@/components/Layout";

const TEAM = [
  { name: "Ana Silva", role: "Sustainability research" },
  { name: "Marcus Bell", role: "Product & data" },
  { name: "Priya Nair", role: "Design & accessibility" },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EcoShopper — Helping People Shop Sustainably" },
      {
        name: "description",
        content:
          "EcoShopper rates everyday products on materials, packaging and recyclability so greener choices are the easy ones.",
      },
      { property: "og:title", content: "About EcoShopper" },
      { property: "og:description", content: "Our mission: helping people shop sustainably." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <section className="hero-wash border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl sm:text-4xl">Helping people shop sustainably</h1>
            <p className="mt-4 text-muted-foreground">
              Most shoppers want a lower-impact option — they just can't tell which one it is at the shelf.
              EcoShopper turns materials, packaging and end-of-life data into a single 1–5 leaf score, then puts a
              concrete alternative next to it.
            </p>
            <p className="mt-4 text-muted-foreground">
              No greenwashing, no vague claims: every rating names the material and the recycling route.
            </p>
          </div>
          <img
            src={aboutImage}
            alt="Flat lay of plastic-free packaging, glass jars and a bamboo brush with eucalyptus leaves"
            loading="lazy"
            width={1400}
            height={900}
            className="w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl">The team</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {TEAM.map((member) => (
            <div key={member.name} className="surface-card p-6">
              <div
                aria-hidden="true"
                className="grid h-12 w-12 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground"
              >
                {member.name.charAt(0)}
              </div>
              <h3 className="mt-4 text-lg">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
