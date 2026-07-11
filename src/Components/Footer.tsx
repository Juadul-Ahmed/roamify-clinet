'use client';

import Link from 'next/link';
import { FiCompass, FiMail, FiPhone, FiMapPin, FiGithub, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Our Journal', path: '/blog' },
        { label: 'Careers', path: '/careers' },
        { label: 'Privacy Policy', path: '/privacy' },
      ],
    },
    {
      title: 'Destinations',
      links: [
        { label: 'Mountain Hikes', path: '/explore?category=Hiking' },
        { label: 'Tropical Beaches', path: '/explore?category=Beach' },
        { label: 'Cultural Tours', path: '/explore?category=Cultural' },
        { label: 'City Breaks', path: '/explore?category=City Break' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help & FAQ', path: '/support' },
        { label: 'Contact Support', path: '/contact' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Safety Guidelines', path: '/safety' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800">
      {/* Main Footer Links & Brand Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand & Identity Metadata */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white">
                <FiCompass size={20} />
              </div>
              <span>Roamify</span>
            </Link>
            <p className="text-sm max-w-xs text-slate-400 leading-relaxed">
              Crafting premium global travel adventures and bespoke itineraries for modern explorers. Discover the unseen world with us.
            </p>
            {/* Social Icons Row */}
            <div className="flex space-x-4 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors">
                <FiLinkedin size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors">
                <FiGithub size={20} />
              </a>
            </div>
          </div>

          {/* Dynamic Link Grids */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 sm:grid-cols-3">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.path} 
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Divider Details and Contact Row */}
        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5"><FiMapPin size={14} className="text-sky-500" /> 123 Discovery Way, Ste 400</span>
            <span className="flex items-center gap-1.5"><FiPhone size={14} className="text-sky-500" /> +1 (555) 762-6439</span>
            <span className="flex items-center gap-1.5"><FiMail size={14} className="text-sky-500" /> adventure@roamify.com</span>
          </div>
          <div className="md:text-right font-medium">
            &copy; {currentYear} Roamify Platforms Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}