export default function AgencyAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-6 py-12">
      {children}
    </div>
  );
}
