'use client';

import React from "react"

import { Mail, MessageCircle, Phone } from 'lucide-react';

interface ContactLink {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  bgColor: string;
  hoverColor: string;
}

// Contact configuration - easily editable for backend integration
const CONTACT_LINKS: ContactLink[] = [
  {
    id: 'messenger',
    icon: MessageCircle,
    label: 'Messenger',
    href: 'https://m.me/YOUR_PAGE_ID', // Replace with actual page ID
    bgColor: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
  },
  {
    id: 'zalo',
    icon: Phone,
    label: 'Zalo',
    href: 'https://zalo.me/YOUR_PHONE_NUMBER', // Replace with actual phone
    bgColor: 'bg-cyan-500',
    hoverColor: 'hover:bg-cyan-600',
  },
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    href: 'mailto:YOUR_EMAIL@example.com', // Replace with actual email
    bgColor: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
  },
];

export function ContactButtons() {
  return (
    <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-40">
      {CONTACT_LINKS.map((contact) => {
        const IconComponent = contact.icon;
        return (
          <a
            key={contact.id}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={contact.label}
            title={contact.label}
            className={`w-14 h-14 ${contact.bgColor} ${contact.hoverColor} rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 transform hover:scale-110`}
          >
            <IconComponent className="w-6 h-6" />
          </a>
        );
      })}
    </div>
  );
}
