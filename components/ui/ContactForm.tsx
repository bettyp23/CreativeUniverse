"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

/** A short contact form that delivers to your inbox through Formspree. */
export function ContactForm({ formId }: { formId: string }) {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="contact" aria-labelledby="contact-title">
      <h3 id="contact-title" className="about__heading">{site.contact.heading}</h3>
      <p className="contact__intro">{site.contact.intro}</p>

      <form className="contact__form" onSubmit={onSubmit}>
        <label className="contact__field">
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label className="contact__field">
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="contact__field">
          Message
          <textarea name="message" required />
        </label>
        <input className="contact__trap" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden />

        <button className="pill-link contact__send" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="contact__status" role="status">
          {status === "sent" && "Thanks! Your message is on its way."}
          {status === "error" && "Something went wrong. Please try again in a moment."}
        </p>
      </form>
    </section>
  );
}
