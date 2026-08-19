"use client";

import type React from "react";

import Link from "next/link";
import { FactoryIcon } from "lucide-react";
import { ScrollToTop } from "../ui/scroll-to-top";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <ScrollToTop />
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:py-12">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <FactoryIcon className="h-6 w-6" />
            <span className="text-lg font-bold">TextileCo</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Crafting premium textiles since 2009.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cotton
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Linen
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Silk
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Technical
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Custom Development
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Quality Testing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Technical Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container flex flex-col gap-4 border-t py-6 md:flex-row md:items-center">
        <p className="text-xs text-muted-foreground">
          © 2025 Issatex. All rights reserved.
        </p>
        <div className="flex gap-4 md:ml-auto">
          <Link
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cookie Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
