import * as signalR from '@microsoft/signalr';
import { atom } from 'jotai';
import { apiUrl } from 'src/utils/api-url';

export const connectionAtom = atom<signalR.HubConnection>(() => {
  const connection = new signalR.HubConnectionBuilder().withUrl(apiUrl + '/hub').build();
  connection.start().catch((err) => document.write(err));
  return connection;
});
