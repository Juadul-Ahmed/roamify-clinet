"use client";

import { useState } from "react";
import {
  TbMail,
  TbPhone,
  TbMessageCircle,
  TbChevronDown,
  TbLoader2,
  TbCircleCheck,
  TbTicket,
  TbCalendarX,
  TbBriefcase,
  TbCreditCard,
  TbUserCog,
} from "react-icons/tb";

const faqs = [
  {
    question: "How do I book a tour?",
    answer:
      "Browse tours on the Explore page, open the one you like, and click Book Now. Choose a date and number of guests, then confirm your booking.",
    icon: TbTicket,
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes. Go to My Bookings, find the reservation you want to cancel, and click Cancel. This cannot be undone, so make sure before confirming.",
    icon: TbCalendarX,
  },
  {
    question: "How do I become a tour organizer?",
    answer:
      "Sign up for an organizer account and you'll get access to a dashboard where you can list tours, manage bookings, and track your listings.",
    icon: TbBriefcase,
  },
  {
    question: "Is payment required to book a tour?",
    answer:
      "Booking reserves your spot at the listed price. Payment details and options depend on the organizer and will be shown during checkout.",
    icon: TbCreditCard,
  },
  {
    question: "How do I update my profile information?",
    answer:
      "Go to Profile from the navigation bar. You can update your display name there. Email changes currently require contacting support.",
    icon: TbUserCog,
  },
];

export default function HelpSupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsSubmitting(false);
    setIsSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Help &amp; Support</h1>
        <p className="mt-1 text-sm text-slate-500">
          Find answers below, or send us a message and we&apos;ll get back to you.
        </p>
      </div>

      {/* Quick contact info */}
      <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-500">
            <TbMail size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Email us</p>
            <p className="text-sm font-medium text-slate-900">support@roamify.com</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-500">
            <TbPhone size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Call us</p>
            <p className="text-sm font-medium text-slate-900">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FAQ */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              const Icon = faq.icon;
              return (
                <div
                  key={i}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${
                    isOpen ? "border-sky-200 ring-1 ring-sky-100" : "border-slate-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isOpen ? "bg-sky-500 text-white" : "bg-sky-50 text-sky-500"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-slate-900">
                      {faq.question}
                    </span>
                    <TbChevronDown
                      size={18}
                      className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-sky-500" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-200 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4 pl-16 text-sm leading-relaxed text-slate-500">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact form */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-slate-900">Send Us a Message</h2>

          {isSent ? (
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center">
              <TbCircleCheck size={36} className="mx-auto mb-3 text-emerald-500" />
              <p className="text-sm font-semibold text-emerald-700">Message sent</p>
              <p className="mt-1 text-xs text-emerald-600">
                We&apos;ll get back to you as soon as we can.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="mt-4 text-xs font-medium text-emerald-700 underline underline-offset-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <TbLoader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <TbMessageCircle size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}