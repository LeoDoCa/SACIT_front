import useValidation from './useValidation';

const usePasswordValidation = () => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&#^+=._()-]{8,}$/;
  const customMessages = {
    required: 'La contraseña es obligatoria.',
    scriptInjection: 'La contraseña no puede contener código HTML o JavaScript.',
    invalid: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.',
  };

  const { validate } = useValidation('Contraseña', passwordRegex, customMessages);
  return validate;
};

export default usePasswordValidation;
