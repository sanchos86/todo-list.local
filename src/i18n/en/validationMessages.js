import validationCodes from '@/constants/validationCodes';

export default {
  [validationCodes.REQUIRED]: 'Field is required',
  [validationCodes.MIN_LENGTH]: 'Field should be at least {minLength} characters length',
};
