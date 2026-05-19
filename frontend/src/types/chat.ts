export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

export interface Citation {
  title: string;
  url: string;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
}
