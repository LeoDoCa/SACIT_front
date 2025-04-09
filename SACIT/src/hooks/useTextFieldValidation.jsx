import useValidation from './useValidation';

const useTextFieldValidation = (fieldName) => {
  const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const customMessages = {
    required: `${fieldName} es obligatorio.`,
    scriptInjection: 'El campo no puede contener código HTML o JavaScript.',
    invalid: `${fieldName} no es válido. Solo se permiten letras y espacios.`,
  };

  const { validate } = useValidation(fieldName, textRegex, customMessages);
  return validate;
};

export default useTextFieldValidation;
