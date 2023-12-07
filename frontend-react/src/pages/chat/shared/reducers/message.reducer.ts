import { Message } from 'src/models/chat/message';
import { replaceItem } from 'src/utils/array-utils';

export type MessageAction =
  | {
      type: 'prepend';
      message: Message;
    }
  | {
      type: 'prepend-range';
      messageList: Message[];
    }
  | {
      type: 'append';
      message: Message;
    }
  | {
      type: 'replace';
      message: Message;
    }
  | {
      type: 'replace-all';
      messageList: Message[];
    }
  | {
      type: 'update-progress';
      id: Message['id'];
      percentage: number;
    };

export const messageReducer = (state: Message[], action: MessageAction): Message[] => {
  if (action.type === 'prepend') {
    return [action.message, ...state];
  }
  if (action.type === 'prepend-range') {
    return [...action.messageList, ...state];
  }
  if (action.type === 'append') {
    return [...state, action.message];
  }
  if (action.type === 'replace') {
    replaceItem(state, action.message);
    return [...state];
  }
  if (action.type === 'replace-all') {
    return action.messageList;
  }
  if (action.type === 'update-progress') {
    const item = state.find((x) => x.id === action.id)!;
    item.progressPercentage = action.percentage;
    replaceItem(state, item);
    return [...state];
  }

  return [];
};
