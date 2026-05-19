import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatBubble } from '../components/ChatBubble';

vi.mock('../utils/api', () => ({
  sendChatMessage: vi.fn(),
}));

describe('ChatBubble', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders floating chat button', () => {
    render(<ChatBubble />);

    expect(screen.getByRole('button', { name: /abrir chat/i })).toBeInTheDocument();
  });

  it('opens chat panel when button is clicked', async () => {
    const user = userEvent.setup();

    render(<ChatBubble />);

    await user.click(screen.getByRole('button', { name: /abrir chat/i }));

    expect(screen.getByPlaceholderText(/escribe tu pregunta/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar chat/i })).toBeInTheDocument();
  });

  it('closes chat panel when close button is clicked', async () => {
    const user = userEvent.setup();

    render(<ChatBubble />);

    await user.click(screen.getByRole('button', { name: /abrir chat/i }));
    await user.click(screen.getByRole('button', { name: /cerrar chat/i }));

    expect(screen.queryByPlaceholderText(/escribe tu pregunta/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /abrir chat/i })).toBeInTheDocument();
  });

  it('can send a message through the bubble panel', async () => {
    const user = userEvent.setup();
    const { sendChatMessage } = await import('../utils/api');
    vi.mocked(sendChatMessage).mockResolvedValue({
      answer: 'Respuesta desde la burbuja',
      citations: [{ title: 'Noticia', url: 'https://example.com/n' }],
    });

    render(<ChatBubble />);

    await user.click(screen.getByRole('button', { name: /abrir chat/i }));

    const input = screen.getByPlaceholderText(/escribe tu pregunta/i);
    await user.type(input, 'hola');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(sendChatMessage).toHaveBeenCalledWith('hola');
    expect(screen.getByText('Respuesta desde la burbuja')).toBeInTheDocument();
    expect(screen.getByText('Noticia')).toBeInTheDocument();
  });
});
