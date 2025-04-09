import useValidation from './useValidation';

const useDescriptionValidation = (fieldName) => {
  const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;!?-]{3,}$/;
  const customMessages = {
    required: `${fieldName} es obligatorio.`,
    scriptInjection: 'El campo no puede contener código HTML o JavaScript.',
    invalid: `${fieldName} no es válido. Debe contener al menos 3 caracteres y solo incluir letras, números, espacios o signos de puntuación comunes.`,
  };

  const { validate } = useValidation(fieldName, textRegex, customMessages);
  return validate;
};

export default useDescriptionValidation;
