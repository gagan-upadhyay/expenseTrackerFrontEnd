'use client';

import ContactCard from "@/src/components/cards/contactCard";
import { useTheme } from "@/src/context/themeContext";
export default function ContactPage() {
    const {theme} = useTheme();
  return (
    <main className={`${theme==='light' ? 'text-gray-900':'text-neutral-300'} min-h-screen px-2 py-5`}>
      <section className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg mb-6">
          Have questions, feedback, or need support? We’re here to help. Reach out and we’ll get back to you as soon as possible.
        </p>

        <div className="space-y-4">
          <ContactCard
            theme={theme}
            title="General Inquiries"
            email="gagan.aws.ac@gmail.com"
            description="For questions about features, pricing, or partnerships."
          />
          <ContactCard
            theme={theme}
            title="Technical Support"
            email="gagan.aws.ac@gmail.com"
            description="Need help with your account or found a bug?"
          />
          <ContactCard
            theme={theme}
            title="Security & Privacy"
            email="gagan.aws.ac@gmail.com"
            description="Report vulnerabilities or ask about data protection."
          />
        </div>
      </section>
    </main>
  );
}