export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold">Revaro</h1>

      <p className="mt-6 max-w-2xl text-lg text-gray-600">
        Reduce SaaS churn with a smarter cancellation experience.
      </p>

      <button className="mt-8 rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800">
        Start Free
      </button>
    </main>
  );
}