import i18n from '@/i18n/i18n';
import validationCodes from '@/constants/validationCodes';

const getValidationCode = (code) => `validationMessages.${code}`;

export default {
  methods: {
    $getErrorMessage(validation) {
      if (validation.$error) {
        if (validation.required !== undefined && !validation.required) {
          return i18n.t(getValidationCode(validationCodes.REQUIRED));
        }
        if (validation.minLength !== undefined && !validation.minLength) {
          return i18n.t(
            getValidationCode(validationCodes.MIN_LENGTH),
            { minLength: validation.$params.minLength.min },
          );
        }
      }
      return '';
    },
  },
};
