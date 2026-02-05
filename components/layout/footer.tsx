import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChefHat, Instagram, Twitter, Github, Mail, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand Section (5/12) */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white text-xl">🍽️</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Plateful
              </span>
            </Link>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm">
              Empowering home chefs to master the art of cooking through community-driven recipes and culinary inspiration.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 transition-all">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 transition-all">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 transition-all">
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Links Sections (7/12) */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/explore" className="text-slate-600 font-bold hover:text-orange-600 transition-colors">Explore</Link></li>
                <li><Link href="/search" className="text-slate-600 font-bold hover:text-orange-600 transition-colors">Search</Link></li>
                <li><Link href="#" className="text-slate-600 font-bold hover:text-orange-600 transition-colors">Trending</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Community</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 font-bold hover:text-orange-600 transition-colors">Top Chefs</Link></li>
                <li><Link href="#" className="text-slate-600 font-bold hover:text-orange-600 transition-colors">Guidelines</Link></li>
                <li><Link href="#" className="text-slate-600 font-bold hover:text-orange-600 transition-colors">Support</Link></li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 md:col-span-1">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Newsletter</h4>
              <p className="text-sm text-slate-500 font-medium mb-4">The best recipes, weekly.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <Button className="rounded-xl bg-slate-900 px-4">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-slate-400">
            © {currentYear} Plateful. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
            <div className="flex items-center gap-1.5 ml-4">
              <span>Made with</span>
              <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
              <span>by Chef Community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}