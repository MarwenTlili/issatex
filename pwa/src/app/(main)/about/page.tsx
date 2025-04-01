import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Factory,
  Globe,
  Heart,
  Leaf,
  MapPin,
  MessageSquare,
  Users,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src="/images/placeholder.svg?height=800&width=1600"
          alt="Textile manufacturing process"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Our Story
          </h1>
          <p className="text-xl text-white max-w-2xl">
            Crafting premium textiles with passion and precision since 2009
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Weaving Excellence Into Every Thread
              </h2>
              <p className="text-muted-foreground mb-6">
                Founded in 2009, our textile company has grown from a small
                family workshop to a global leader in premium fabric production.
                Our journey has been defined by an unwavering commitment to
                quality, innovation, and sustainability.
              </p>
              <p className="text-muted-foreground mb-6">
                We combine traditional craftsmanship with cutting-edge
                technology to create textiles that meet the highest standards of
                quality and durability. Our fabrics are used by leading fashion
                houses, interior designers, and manufacturers worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button>Our Process</Button>
                <Button variant="outline">Contact Us</Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/placeholder.svg?height=800&width=600"
                alt="Textile factory"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do, from sourcing raw
              materials to delivering finished products to our customers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Leaf className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainability</h3>
              <p className="text-muted-foreground">
                We're committed to environmentally responsible practices
                throughout our production process, from sourcing raw materials
                to minimizing waste.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Heart className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality</h3>
              <p className="text-muted-foreground">
                We never compromise on quality. Every fabric we produce
                undergoes rigorous testing to ensure it meets our exacting
                standards.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Users className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-muted-foreground">
                We value our relationships with employees, suppliers, customers,
                and the communities where we operate. We believe in fair trade
                and ethical practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Process */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Manufacturing Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From raw fiber to finished fabric, we control every step of the
              manufacturing process to ensure the highest quality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">01</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Sourcing</h3>
                    <p className="text-muted-foreground">
                      We carefully select the finest raw materials from
                      sustainable sources around the world.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">02</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Spinning</h3>
                    <p className="text-muted-foreground">
                      Our state-of-the-art spinning facilities transform raw
                      fibers into yarn of exceptional quality.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">03</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Weaving</h3>
                    <p className="text-muted-foreground">
                      Master weavers and advanced looms work in harmony to
                      create fabrics with perfect consistency.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">04</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Finishing</h3>
                    <p className="text-muted-foreground">
                      Our specialized finishing processes enhance the
                      appearance, feel, and performance of our textiles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/images/placeholder.svg?height=1000&width=800"
                alt="Textile manufacturing process"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-muted px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Leadership Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the experienced professionals who guide our company's vision
              and operations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-background rounded-lg overflow-hidden shadow-sm"
              >
                <div className="relative h-80">
                  <Image
                    src={`/images/placeholder.svg?height=400&width=300&text=Team Member ${i}`}
                    alt={`Team member ${i}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">Jane Doe</h3>
                  <p className="text-primary mb-4">Chief Executive Officer</p>
                  <p className="text-muted-foreground mb-4">
                    With over 20 years of experience in the textile industry,
                    Jane leads our company with vision and expertise.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Global Presence
              </h2>
              <p className="text-muted-foreground mb-6">
                With manufacturing facilities and offices across three
                continents, we serve customers in over 50 countries. Our global
                network allows us to combine local expertise with international
                standards.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Headquarters</h3>
                    <p className="text-muted-foreground">New York, USA</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Factory className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Manufacturing Facilities</h3>
                    <p className="text-muted-foreground">
                      Italy, China, Turkey
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Sales Offices</h3>
                    <p className="text-muted-foreground">
                      USA, UK, Germany, Japan, Australia
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/placeholder.svg?height=800&width=800&text=World Map"
                alt="Global presence map"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Let's Work Together
              </h2>
              <p className="mb-8 text-primary-foreground/90">
                Whether you're looking for custom fabrics for your fashion line,
                upholstery materials for your furniture business, or technical
                textiles for industrial applications, we're here to help.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>Mon-Fri: 9AM-5PM EST</span>
                </div>
              </div>
            </div>
            <div>
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Contact Our Sales Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
