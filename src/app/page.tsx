import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">17º BPM - Help Desk</h1>
      <p className="text-slate-600 mb-8">O sistema está online e operante.</p>
      <Link 
        href="/login" 
        className="px-6 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors"
      >
        Ir para o Login
      </Link>
    </main>
  );
}