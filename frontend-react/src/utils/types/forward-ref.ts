import { JSXElementConstructor, ReactElement, forwardRef } from 'react';

export const typedForwardRef = <T, P = {}>(
  render: (
    props: P,
    ref: React.ForwardedRef<T>
  ) => ReactElement<P, string | JSXElementConstructor<P>> | null
) => {
  return forwardRef(render) as (
    props: P & React.RefAttributes<T>
  ) => ReactElement<P, string | JSXElementConstructor<P>> | null;
};
