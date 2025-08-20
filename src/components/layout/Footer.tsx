import { MapPin, Heart, Globe, Mail } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Memora</h3>
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground ml-2">
              Share your memories, explore the world
            </span>
          </div>
          
          {/* Links */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>hello@memora.app</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          © 2024 Memora. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
