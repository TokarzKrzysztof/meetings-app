import { atom } from 'jotai';

export type ConfirmationDialogData = {
  message: string;
  onAccept: () => void;
  onCancel?: () => void;
  title?: string;
};
export const confirmationDialogAtom = atom<ConfirmationDialogData | null>(null);
