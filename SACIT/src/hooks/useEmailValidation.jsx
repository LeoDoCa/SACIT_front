import { useState } from 'react';

const useEmailValidation = () => {
  const [errors, setErrors] = useState({});
  const emailRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/;

  const validateEmail = (email) => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'El correo no es válido.';
    }

    setErrors(newErrors);

    return newErrors;
  };

  return { errors, validateEmail };
};

export default useEmailValidation;
