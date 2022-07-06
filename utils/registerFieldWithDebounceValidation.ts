import { debounce } from "debounce";
import {
  FieldPath,
  RegisterOptions,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormTrigger,
} from "react-hook-form";

export const registerFieldWithDebounceValidation = <TFieldValues>(
  name: FieldPath<TFieldValues>,
  delay: number,
  trigger: UseFormTrigger<TFieldValues>,
  register: UseFormRegister<TFieldValues>,
  options?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
) => {
  const useFormRegisterReturn: UseFormRegisterReturn = register(name, options);
  const { onChange } = useFormRegisterReturn;
  const debouncedValidate = debounce(
    () => {
      trigger(name);
    },
    delay,
    false
  );

  return {
    ...useFormRegisterReturn,
    onChange: (e: any) => {
      onChange(e);
      debouncedValidate();
    },
  };
};
