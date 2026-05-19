import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '../components/ChatWidget';

vi.mock('../utils/api', () => ({
  sendChatMessage: vi.fn(),
}));

describe('ChatWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input field and submit button', () => {
    render(<ChatWidget />);

    expect(screen.getByPlaceholderText(/escribe tu pregunta/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('sends message on form submit', async () => {
    const user = userEvent.setup();
    const { sendChatMessage } = await import('../utils/api');
    vi.mocked(sendChatMessage).mockResolvedValue({
      answer: 'Respuesta de prueba',
      citations: [],
    });

    render(<ChatWidget />);

    const input = screen.getByPlaceholderText(/escribe tu pregunta/i);
    await user.type(input, '¿qué eventos hay?');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(sendChatMessage).toHaveBeenCalledWith('¿qué eventos hay?');
    expect(screen.getByText('¿qué eventos hay?')).toBeInTheDocument();
  });

  it('displays loading state while waiting for response', async () => {
    const user = userEvent.setup();
    const { sendChatMessage } = await import('../utils/api');
    vi.mocked(sendChatMessage).mockImplementation(
      () => new Promise(() => {}),
    );

    render(<ChatWidget />);

    const input = screen.getByPlaceholderText(/escribe tu pregunta/i);
    await user.type(input, 'test');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(screen.getByText(/buscando/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeDisabled();
  });

  it('displays answer and citations', async () => {
    const user = userEvent.setup();
    const { sendChatMessage } = await import('../utils/api');
    vi.mocked(sendChatMessage).mockResolvedValue({
      answer: 'Hay eventos culturales este mes.',
      citations: [
        { title: 'Festival Cultural', url: 'https://example.com/festival' },
      ],
    });

    render(<ChatWidget />);

    const input = screen.getByPlaceholderText(/escribe tu pregunta/i);
    await user.type(input, '¿qué eventos culturales hay?');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(screen.getByText('Hay eventos culturales este mes.')).toBeInTheDocument();
    expect(screen.getByText('Festival Cultural')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Festival Cultural' }),
    ).toHaveAttribute('href', 'https://example.com/festival');
  });

  it('displays error state when API call fails', async () => {
    const user = userEvent.setup();
    const { sendChatMessage } = await import('../utils/api');
    vi.mocked(sendChatMessage).mockRejectedValue(new Error('Error de conexión'));

    render(<ChatWidget />);

    const input = screen.getByPlaceholderText(/escribe tu pregunta/i);
    await user.type(input, 'test');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(screen.getByText(/error de conexión/i)).toBeInTheDocument();
  });

  it('displays multiple citations', async () => {
    const user = userEvent.setup();
    const { sendChatMessage } = await import('../utils/api');
    vi.mocked(sendChatMessage).mockResolvedValue({
      answer: 'Hay varios eventos.',
      citations: [
        { title: 'Evento Uno', url: 'https://example.com/1' },
        { title: 'Evento Dos', url: 'https://example.com/2' },
      ],
    });

    render(<ChatWidget />);

    const input = screen.getByPlaceholderText(/escribe tu pregunta/i);
    await user.type(input, '¿qué eventos hay?');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(screen.getByText('Evento Uno')).toBeInTheDocument();
    expect(screen.getByText('Evento Dos')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Evento Uno' }),
    ).toHaveAttribute('href', 'https://example.com/1');
    expect(
      screen.getByRole('link', { name: 'Evento Dos' }),
    ).toHaveAttribute('href', 'https://example.com/2');
  });

  it('does not show citations section when citations are empty', async () => {
    const user = userEvent.setup();
    const { sendChatMessage } = await import('../utils/api');
    vi.mocked(sendChatMessage).mockResolvedValue({
      answer: 'No encontré información.',
      citations: [],
    });

    render(<ChatWidget />);

    const input = screen.getByPlaceholderText(/escribe tu pregunta/i);
    await user.type(input, 'test');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(screen.getByText('No encontré información.')).toBeInTheDocument();
    expect(screen.queryByText('Fuentes:')).not.toBeInTheDocument();
  });
});
