import { atom } from 'jotai';
import { Chat } from 'src/models/chat/chat';

export const chatAtom = atom<Chat | null>(null);
