import { ReactElement } from 'react';

export type PropsWithReactElement<P = unknown> = P & {
  children: ReactElement;
};
