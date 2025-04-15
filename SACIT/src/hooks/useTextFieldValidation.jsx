import useValidation from './useValidation';

const useTextFieldValidation = (fieldName) => {
  const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,}([\s'-][a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,})*$/;
  const customMessages = {
    required: `${fieldName} es obligatorio.`,
    scriptInjection: 'El campo no puede contener código HTML o JavaScript.',
    invalid: `${fieldName} no es válido. Solo se permiten letras, espacios, con mínimo 2 caracteres por palabra.`,
  };

  const { validate } = useValidation(fieldName, textRegex, customMessages);
  return validate;
};

export default useTextFieldValidation;
