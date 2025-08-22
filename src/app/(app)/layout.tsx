import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-14 pb-14">
        {children}
      </main>
      <Footer />
    </div> 
  )
}
