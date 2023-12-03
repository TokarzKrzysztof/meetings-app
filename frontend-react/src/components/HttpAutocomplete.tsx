import _ from 'lodash';
import { FormEvent, ForwardedRef, useMemo } from 'react';
import { Autocomplete, AutocompleteProps } from 'src/ui-components';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type HttpAutocompleteProps<T> = Omit<
  AutocompleteProps<T, boolean, boolean, boolean, 'div'>,
  'optionsAsync'
> & {
  data: T[];
  inProgress: boolean;
  onRequest: (filter: string) => void;
};

const HttpAutocompleteInner = <T,>(
  { data, inProgress, onRequest, ...props }: HttpAutocompleteProps<T>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const onInputDebounce = useMemo(() => {
    return _.debounce((e: FormEvent<HTMLDivElement>) => {
      const target = e.target as HTMLInputElement;
      if (target.value.length >= 2) {
        onRequest(target.value);
      }
    }, 500);
  }, []);

  return (
    <Autocomplete
      onInput={onInputDebounce}
      optionsAsync={inProgress ? undefined : data}
      // this will disable default filtering
      filterOptions={(x) => x}
      {...props}
    />
  );
};

export const HttpAutocomplete = typedForwardRef(HttpAutocompleteInner);
