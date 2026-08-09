import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import contactImage from "@/assets/contact-eco.png";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z.string().trim().min(5, "Please write a short message").max(1000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EcoShopper" },
      {
        name: "description",
        content: "Suggest a product, report a rating or ask about sustainability data — we read every message.",
      },
      { property: "og:title", content: "Contact EcoShopper" },
      { property: "og:description", content: "Get in touch with the EcoShopper team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setSending(false);
    if (error) {
      toast.error("Could not send your message. Please try again.");
      return;
    }
    toast.success("Thanks! Your message is on its way.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="hero-wash border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl sm:text-4xl">Contact us</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Spotted a product we should rate, or a score that looks wrong? Tell us.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 lg:grid-cols-2">
        <form onSubmit={submit} noValidate className="surface-card space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              maxLength={100}
              aria-invalid={Boolean(errors["name"])}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            {errors["name"] && <p className="text-sm text-destructive">{errors["name"]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              maxLength={255}
              aria-invalid={Boolean(errors["email"])}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            {errors["email"] && <p className="text-sm text-destructive">{errors["email"]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={6}
              value={form.message}
              maxLength={1000}
              aria-invalid={Boolean(errors["message"])}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
            />
            {errors["message"] && <p className="text-sm text-destructive">{errors["message"]}</p>}
          </div>

          <Button type="submit" disabled={sending} className="w-full rounded-full">
            {sending ? "Sending…" : "Send message"}
          </Button>
        </form>

        <img
          src={contactImage}
          alt="Illustration of a person sending a message beside a large green leaf"
          loading="lazy"
          width={1024}
          height={768}
          className="mx-auto w-full max-w-md"
        />
      </section>
    </Layout>
  );
}
