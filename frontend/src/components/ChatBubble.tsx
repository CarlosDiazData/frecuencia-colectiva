import { useState } from 'react';
import { ChatWidget } from './ChatWidget';

export function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors flex items-center justify-center text-2xl"
      >
        💬
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg sm:max-h-[600px] h-[80vh] sm:h-[600px] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="font-serif font-bold text-gray-900">
                Consulta nuestros artículos
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar chat"
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <ChatWidget />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
