import useFormValidation from './useFormValidation';

const useValidation = (fieldName, customRegex, customMessages) => {
  const { errors, validateTextInput } = useFormValidation();

  const validate = (value) => {
    return validateTextInput(fieldName, value, customRegex, customMessages);
  };

  return { errors, validate };
};

export default useValidation;
