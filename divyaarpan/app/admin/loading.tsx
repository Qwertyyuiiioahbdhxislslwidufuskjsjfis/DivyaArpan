export default function AdminLoading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-orange-50 px-6 py-20" aria-busy="true" aria-live="polite">
      <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />
        <p className="mt-5 font-semibold text-orange-700">Loading admin workspace...</p>
      </div>
    </main>
  );
}
