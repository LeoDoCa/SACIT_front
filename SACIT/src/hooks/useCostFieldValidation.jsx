import useValidation from './useValidation';

const useCostFieldValidation = (fieldName) => {
  const textRegex = /^(?!0(\.0+)?$)\d+(\.\d+)?$/;
  const customMessages = {
    required: `${fieldName} es obligatorio.`,
    scriptInjection: 'El campo no puede contener código HTML o JavaScript.',
    invalid: `${fieldName} no es válido. Solo se permiten numeros mayores a 0.`,
  };

  const { validate } = useValidation(fieldName, textRegex, customMessages);
  return validate;
};

export default useCostFieldValidation;
