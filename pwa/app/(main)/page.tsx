import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Factory,
  Globe,
  Leaf,
  Phone,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Crafting Premium Textiles for a Modern World
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Innovative fabrics designed with sustainability, quality,
                    and style at the forefront.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg">
                    Explore Our Collection
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn About Our Process
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/images/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Textile samples arranged in a modern display"
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Our Story
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  With over 30 years of experience in the textile industry,
                  we've built our reputation on quality, innovation, and
                  sustainability. Our journey began with a simple mission: to
                  create fabrics that inspire and endure.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Leaf className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Sustainable Practices</h3>
                  <p className="text-muted-foreground">
                    Our commitment to the environment drives every decision we
                    make, from sourcing raw materials to production processes.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Factory className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Quality Craftsmanship</h3>
                  <p className="text-muted-foreground">
                    We combine traditional techniques with modern technology to
                    create textiles of exceptional quality and durability.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Global Reach</h3>
                  <p className="text-muted-foreground">
                    Our fabrics are used by designers and manufacturers in over
                    50 countries, bringing our vision to the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Our Collection
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover our range of premium textiles designed for various
                  applications, from fashion to home decor.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                {
                  name: "Organic Cotton",
                  image: "/images/placeholder.svg?height=300&width=300",
                  description:
                    "Soft, sustainable, and versatile cotton fabrics.",
                },
                {
                  name: "Premium Linen",
                  image: "/images/placeholder.svg?height=300&width=300",
                  description:
                    "Breathable and durable linen with a natural texture.",
                },
                {
                  name: "Luxury Silk",
                  image: "/images/placeholder.svg?height=300&width=300",
                  description:
                    "Smooth, lustrous silk for elegant applications.",
                },
                {
                  name: "Technical Fabrics",
                  image: "/images/placeholder.svg?height=300&width=300",
                  description:
                    "High-performance textiles for specialized needs.",
                },
                {
                  name: "Wool Blends",
                  image: "/images/placeholder.svg?height=300&width=300",
                  description:
                    "Warm and resilient wool mixed with complementary fibers.",
                },
                {
                  name: "Sustainable Synthetics",
                  image: "/images/placeholder.svg?height=300&width=300",
                  description:
                    "Eco-friendly synthetic options with reduced environmental impact.",
                },
                {
                  name: "Decorative Textiles",
                  image: "/images/placeholder.svg?height=300&width=300",
                  description:
                    "Patterned and textured fabrics for interior design.",
                },
                {
                  name: "Specialty Weaves",
                  image: "/images/placeholder.svg?height=300&width=300",
                  description:
                    "Unique weaving techniques for distinctive textures.",
                },
              ].map((product, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border"
                >
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={product.image || "/images/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <Button variant="link" className="mt-2 px-0">
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="services"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Our Services
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Beyond providing premium textiles, we offer comprehensive
                    services to support your projects from concept to
                    completion.
                  </p>
                </div>
                <ul className="grid gap-6">
                  {[
                    {
                      title: "Custom Development",
                      description:
                        "Collaborate with our design team to create bespoke textiles tailored to your specific requirements.",
                    },
                    {
                      title: "Quality Testing",
                      description:
                        "Rigorous testing ensures our fabrics meet the highest standards for durability, colorfastness, and performance.",
                    },
                    {
                      title: "Sustainable Solutions",
                      description:
                        "Guidance on eco-friendly options and certifications to meet your sustainability goals.",
                    },
                    {
                      title: "Technical Support",
                      description:
                        "Expert advice on fabric selection, application techniques, and maintenance.",
                    },
                  ].map((service, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div>
                  <Button size="lg" className="mt-4">
                    Schedule a Consultation
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/images/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Textile design studio with fabric samples and design tools"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to transform your next project?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Contact our team to discuss your textile needs, request samples,
                or schedule a consultation.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row lg:justify-end">
              <Button size="lg" className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Sales
              </Button>
              <Button variant="outline" size="lg">
                Request Samples
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
