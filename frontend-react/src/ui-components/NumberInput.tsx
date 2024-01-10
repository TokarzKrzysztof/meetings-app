import { useEffect, useState } from "react";
import { OutlinedInput, OutlinedInputProps } from "src/ui-components/OutlinedInput";

export type NumberInputProps = Omit<OutlinedInputProps, 'value' | 'onChange'> & {
    value: unknown;
    isInteger?: boolean;
    isPositive?: boolean;
    onChange: (value: number | null) => void;
  };
  export const NumberInput = ({
    value,
    isInteger,
    isPositive = true,
    onChange,
    ...props
  }: NumberInputProps) => {
    const [val, setVal] = useState(value);
  
    useEffect(() => {
      // double != to do soft comparison and not add trailing zero if not necessary
      if (typeof value === 'number' && !isNaN(value) && value != val) {
        setVal(value);
      }
    }, [value]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setVal(e.target.value);
  
      const valueAsNumber = +e.target.value;
      if (isNaN(valueAsNumber) || (isPositive && valueAsNumber < 0)) {
        onChange(null);
      } else {
        onChange(isInteger ? +valueAsNumber.toFixed(0) : valueAsNumber);
      }
    };
  
    return <OutlinedInput value={val} onChange={handleChange} {...props} />;
  };
  