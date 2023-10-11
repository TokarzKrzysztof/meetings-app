import { atom } from 'jotai';
import { User } from 'src/models/user';

export const currentUserAtom = atom<User | null>(null);
