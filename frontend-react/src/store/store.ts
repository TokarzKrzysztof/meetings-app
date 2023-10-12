import { atom } from 'jotai';
import { User } from 'src/models/user';

export const currentUserAtom = atom<User | null>(null);

export type ConfirmationDialogData = {
  message: string;
  onAccept: () => void;
  onCancel?: () => void;
  title?: string;
};
export const confirmationDialogAtom = atom<ConfirmationDialogData | null>(null);
