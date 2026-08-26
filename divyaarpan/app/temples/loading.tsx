export default function TemplesLoading() {
  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-24">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-12 max-w-xl rounded bg-orange-100" />
        <div className="mt-4 h-5 max-w-2xl rounded bg-orange-50" />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="h-64 bg-orange-100" />
              <div className="space-y-4 p-6">
                <div className="h-7 rounded bg-orange-50" />
                <div className="h-4 rounded bg-orange-50" />
                <div className="h-16 rounded bg-orange-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}