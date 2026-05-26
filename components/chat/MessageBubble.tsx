'use client';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

// MessageBubble — stub
export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted text-foreground rounded-bl-sm',
        ].join(' ')}
      >
        {content}
      </div>
    </div>
  );
}
