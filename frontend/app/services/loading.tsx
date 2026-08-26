export default function ServicesLoading() {
  return (
    <div className="max-w-container-max mx-auto w-full flex flex-col md:flex-row min-h-[60vh]">
      <aside className="hidden md:flex flex-col py-6 px-4 w-72 bg-surface border-r border-outline-variant/50 shrink-0">
        <div className="skeleton h-6 w-40 rounded-lg mb-6" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-10 rounded-lg" />
          ))}
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-8 bg-background">
        <div className="mb-8">
          <div className="skeleton h-8 w-64 rounded-lg mb-2" />
          <div className="skeleton h-5 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-64 rounded-xl" />
          ))}
        </div>
      </main>
    </div>
  );
}
