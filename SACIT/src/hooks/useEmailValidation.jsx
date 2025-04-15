import useValidation from './useValidation';

const useEmailValidation = () => {
  const emailRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/;
  const customMessages = {
    required: 'El correo electrónico es obligatorio.',
    scriptInjection: 'El correo electrónico no puede contener código HTML o JavaScript.',
    invalid: 'El correo electrónico no es válido.',
  };

  const { validate } = useValidation('Correo', emailRegex, customMessages);
  return validate;
};

export default useEmailValidation;
