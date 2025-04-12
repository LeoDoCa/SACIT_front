import { useState } from 'react';
import usePasswordValidation from './usePasswordValidation';

const useConfirmPasswordValidation = (password) => {
  const [error, setError] = useState('');
  const validatePassword = usePasswordValidation(); 

  const validate = (confirmPassword) => {
    const validationError = validatePassword(confirmPassword);

    if (validationError) {
      setError(validationError);
    } else if (confirmPassword !== password) {
      setError('Las contraseñas no coinciden');
    } else {
      setError('');
    }
  };

  return [error, validate];
};

export default useConfirmPasswordValidation;