export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
