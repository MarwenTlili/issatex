"use client";

import { type FC, useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Settings,
  LogOut,
  Home,
  Info,
  Mail,
  LogIn,
  UserPlus,
  FactoryIcon,
  LayoutDashboard,
  Shirt,
  Layers,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Session } from "next-auth";
import Image from "next/image";

type SessionStatus = "authenticated" | "unauthenticated";

interface HeaderComponentProps {
  session: Session | null;
  status: SessionStatus;
}

const HeaderComponent: FC<HeaderComponentProps> = ({ session, status }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = session?.user.roles?.includes("ROLE_ADMIN") ? true : false;

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    {
      name: "Articles",
      href: "/client/articles",
      icon: <Shirt className="h-5 w-5" />,
    },
    {
      name: "Ordres de fabrication",
      href: "/client/ordre-fabrications",
      icon: <Layers className="h-5 w-5" />,
    },
    { name: "À propos", href: "/about", icon: <Info className="h-5 w-5" /> },
    { name: "Contact", href: "/contact", icon: <Mail className="h-5 w-5" /> },
  ];

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const profileElement = document.getElementById("profile-dropdown");
      const menuElement = document.getElementById("mobile-menu");

      if (profileElement && !profileElement.contains(target)) {
        setProfileOpen(false);
      }

      if (menuElement && !menuElement.contains(target)) {
        // Don&apos;t close the menu when clicking the menu button
        const menuButton = document.getElementById("menu-button");
        if (menuButton && !menuButton.contains(target)) {
          setMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Fixed height spacer to prevent content jump */}
      <div className="h-16"></div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 ${
          scrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
            : "bg-white dark:bg-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo & Brand */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <FactoryIcon className="h-8 w-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Issatex
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-md font-medium transition-colors ${
                    pathname === item.href
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  }`}
                >
                  <span className="hidden lg:block">{item.name}</span>
                  <span className="block lg:hidden">{item.icon}</span>
                </Link>
              ))}
            </div>

            {/* Right Side - Auth Section - Fixed width container */}
            <div className="flex items-center">
              {/* Auth states with consistent width and height */}
              <div className="h-10 w-[180px] flex items-end justify-end">
                {status === "unauthenticated" ? (
                  <div className="flex space-x-1 h-10 items-center justify-center w-full">
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                ) : session?.user ? (
                  <div
                    className="relative w-full flex justify-end"
                    id="profile-dropdown"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileOpen(!profileOpen);
                      }}
                      className="flex items-center space-x-2 focus:outline-none"
                      aria-expanded={profileOpen}
                      aria-haspopup="true"
                    >
                      <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-full pl-1 pr-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        {session.user.image ? (
                          <Image
                            src={
                              session.user.image ||
                              "/placeholder.svg?height=32&width=32" ||
                              "/placeholder.svg"
                            }
                            alt="Profile"
                            className="h-8 w-8 rounded-full ring-2 ring-blue-500"
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {session.user.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">
                          {session.user.name || "User"}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            profileOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Profile Dropdown - Absolute positioning to avoid layout shift */}
                    {profileOpen && (
                      <div
                        id="profile-dropdown"
                        className="absolute right-0 mt-11 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      >
                        <div className="px-4 py-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Signed in as
                          </p>
                          <p className="text-sm font-medium truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <Separator className="mx-2 w-auto" />
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400" />
                            Dashboard
                          </Link>
                        )}
                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Settings className="mr-3 h-5 w-5 text-gray-400" />
                          Settings
                        </Link>
                        <Separator className="mx-2 w-auto" />
                        <button
                          onClick={() => {
                            signOut({ redirect: false }).then(() => {
                              router.push("/login");
                            });
                          }}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 justify-end w-full">
                    <Link
                      href="/login"
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    >
                      <LogIn className="h-5 w-5" />
                      <span className="hidden sm:block">Login</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                    >
                      <UserPlus className="h-5 w-5" />
                      <span className="hidden sm:block">Register</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden ml-4">
                <button
                  id="menu-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(!menuOpen);
                  }}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 focus:outline-none transition-colors"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                >
                  <span className="sr-only">Open main menu</span>
                  {menuOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu - Fixed position to avoid layout shift */}
        <div
          id="mobile-menu"
          className={`md:hidden fixed left-0 right-0 bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out z-40 ${
            menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={!menuOpen}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default HeaderComponent;
