import { useState } from 'react';

const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const scriptInjectionRegex = /<.*?>|<script.*?>.*?<\/script>/i;

  const getErrorMessage = (fieldName, customMessage, type) => {
    const defaultMessages = {
      required: `${fieldName} es obligatorio.`,
      scriptInjection: `${fieldName} no puede contener código HTML o JavaScript.`,
      invalid: `${fieldName} no es válido.`,
    };
    return customMessage?.[type] || defaultMessages[type];
  };

  const validateTextInput = (fieldName, value, customRegex, customMessage) => {
    let error = '';

    if (!value) {
      error = getErrorMessage(fieldName, customMessage, 'required');
    } else if (scriptInjectionRegex.test(value)) {
      error = getErrorMessage(fieldName, customMessage, 'scriptInjection');
    } else if (customRegex && !customRegex.test(value)) {
      error = getErrorMessage(fieldName, customMessage, 'invalid');
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
    return error;
  };

  return { errors, validateTextInput };
};

export default useFormValidation;
