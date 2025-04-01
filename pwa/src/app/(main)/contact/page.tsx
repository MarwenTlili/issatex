import type { Metadata } from "next";
import ContactForm from "./contact-form";
import ContactInfo from "./contact-info";
import MapLocation from "./map-location";

export const metadata: Metadata = {
  title: "Contact Us | Textile Company",
  description:
    "Get in touch with our team for inquiries about our textile products and services.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We'd love to hear from you. Please fill out the form below or use our
          contact information.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <ContactInfo />
        <ContactForm />
      </div>

      <div className="mt-16">
        <MapLocation />
      </div>
    </div>
  );
}
