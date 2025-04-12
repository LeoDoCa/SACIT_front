import useValidation from './useValidation';

const useOtpValidation = () => {
  const otpRegex = /^\d{6}$/;
  const customMessages = {
    required: 'El código de verificación es obligatorio.',
    scriptInjection: 'El código de verificación no puede contener código HTML o JavaScript.',
    invalid: 'El código de verificación no es válido.',
  };

  const { validate } = useValidation('Otp', otpRegex, customMessages);
  return validate;
};

export default useOtpValidation;
