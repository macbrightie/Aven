import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6 px-8 max-w-7xl mx-auto w-full sticky top-0 bg-transparent z-50 mix-blend-difference">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#104d3b] rounded-[999px]" />
          <span className="font-sans font-bold text-2xl tracking-tight text-white">aven</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 ml-4">
          <Link 
            href="#how-it-works" 
            className="text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            Hows aven different?
          </Link>
          <Link 
            href="#pricing" 
            className="text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            Pro
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="md" 
          className="rounded-[999px] border-none px-6 py-2 bg-white hover:bg-white/90 shadow-lg"
          style={{ color: '#1b1b1b' }}
        >
          Manage progress
        </Button>
      </div>
    </nav>
  );
}
