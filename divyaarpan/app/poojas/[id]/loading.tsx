export default function PoojaDetailLoading() {
  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-24">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-5 w-40 rounded bg-orange-100" />
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="h-14 max-w-xl rounded bg-orange-100" />
            <div className="h-5 max-w-sm rounded bg-orange-50" />
            <div className="h-28 rounded bg-orange-50" />
          </div>
          <div className="h-96 rounded-3xl bg-orange-100" />
        </div>
      </div>
    </main>
  );
}
