export default function ServicesLoading() {
  return (
    <div className="max-w-container-max mx-auto p-margin-desktop">
      <div className="skeleton h-10 w-64 mb-md rounded" />
      <div className="skeleton h-6 w-96 mb-xl rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-64 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
