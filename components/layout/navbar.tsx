import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getUser, signOut } from '@/actions/auth-actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Search, Compass, Plus, Settings, LogOut, User } from 'lucide-react';

export async function Navbar() {
  const user = await getUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* LEFT: Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-orange-200">
              <span className="text-white text-xl">🍽️</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              Plateful
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/explore">
              <Button variant="ghost" className="font-bold text-slate-600 hover:text-orange-600 gap-2 rounded-xl px-4">
                <Compass className="h-4 w-4" />
                Explore
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="ghost" className="font-bold text-slate-600 hover:text-orange-600 gap-2 rounded-xl px-4">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </Link>
          </div>
        </div>

        {/* RIGHT: User Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/recipe/create" className="hidden sm:block">
                <Button className="bg-slate-900 hover:bg-orange-600 text-white font-bold rounded-xl px-6 transition-all shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-2xl border border-slate-100 p-0 hover:bg-slate-50 transition-all">
                    <Avatar className="h-10 w-10 rounded-xl">
                      <AvatarImage src={user.profile?.avatar_url} className="object-cover" />
                      <AvatarFallback className="bg-orange-100 text-orange-600 font-bold text-xs">
                        {user.profile?.full_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-slate-100 mt-2">
                  <DropdownMenuLabel className="p-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-base font-black text-slate-900 leading-none">{user.profile?.full_name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">@{user.profile?.username}</p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-slate-50" />

                  <DropdownMenuItem asChild className="rounded-xl py-3 cursor-pointer font-bold focus:bg-orange-50 focus:text-orange-600 group">
                    <Link href={`/profile/${user.profile?.username}`} className="flex items-center">
                      <User className="h-4 w-4 mr-3 text-slate-400 group-focus:text-orange-600" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="rounded-xl py-3 cursor-pointer font-bold focus:bg-orange-50 focus:text-orange-600 group">
                    <Link href="/settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-3 text-slate-400 group-focus:text-orange-600" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-slate-50" />

                  <DropdownMenuItem className="rounded-xl py-3 cursor-pointer font-bold text-rose-500 focus:text-rose-600 focus:bg-rose-50">
                    <form action={signOut} className="w-full flex items-center">
                      <button type="submit" className="flex items-center w-full">
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="font-bold text-slate-600 rounded-xl hover:bg-slate-50">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl px-6 transition-all shadow-lg shadow-orange-100 text-white">
                  Join Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}