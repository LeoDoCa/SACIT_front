import { useState } from 'react';

const useConfirmPasswordValidation = (password) => {
  const [error, setError] = useState('');

  const validate = (confirmPassword) => {
    if (confirmPassword.trim() === '') {
      setError('La confirmación de la contraseña es obligatoria');
    } else if (confirmPassword !== password) {
      setError('Las contraseñas no coinciden');
    } else {
      setError('');
    }
  };

  return [error, validate];
};

export default useConfirmPasswordValidation;
