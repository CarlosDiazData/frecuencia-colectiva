import { ChatWidget } from '@/components';

export function ChatPage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">
          Consulta nuestros artículos
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Haz preguntas sobre cultura, arte y eventos en español.
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[500px] flex flex-col">
          <ChatWidget />
        </div>
      </main>
    </div>
  );
}
