import { useEffect } from 'react';
import { Message } from 'src/models/chat/message';

export const useUnloadListener = (messages: Message[]) => {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (messages.some((x) => x.isPending)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [messages]);
};
