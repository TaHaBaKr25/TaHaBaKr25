'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const links = [
    { href: '/', label: 'الرئيسية' },
    { href: '/attendance', label: 'السجلات' },
    { href: '/employees', label: 'الموظفين' },
    { href: '/reports', label: 'التقارير' }
  ];
  
  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🤲</span>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold">جمعية إحسان لرعاية الأيتام</h1>
              <p className="text-sm text-emerald-100">دومة الجندل</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-white text-emerald-600 shadow-md'
                    : 'hover:bg-emerald-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
