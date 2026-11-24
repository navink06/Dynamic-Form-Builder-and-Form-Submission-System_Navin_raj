import TextInput from './fields/TextInput';
import EmailInput from './fields/EmailInput';
import NumberInput from './fields/NumberInput';
import PhoneInput from './fields/PhoneInput';
import TextareaInput from './fields/TextareaInput';
import DateInput from './fields/DateInput';
import SelectInput from './fields/SelectInput';
import RadioGroupInput from './fields/RadioGroupInput';
import CheckboxGroupInput from './fields/CheckboxGroupInput';

/**
 * Registry of dynamic field components.
 * To support a new field type anywhere in the application, register it here.
 * Dynamic forms render seamlessly without any form-level changes!
 */
const FieldRegistry = {
  TEXT: TextInput,
  EMAIL: EmailInput,
  NUMBER: NumberInput,
  PHONE: PhoneInput,
  TEXTAREA: TextareaInput,
  DATE: DateInput,
  SELECT: SelectInput,
  RADIO: RadioGroupInput,
  CHECKBOX: CheckboxGroupInput
};

export const getFieldComponent = (type) => {
  const normalizedType = String(type || '').toUpperCase();
  const Component = FieldRegistry[normalizedType];
  if (!Component) {
    console.warn(`Unsupported field type: "${type}". Falling back to default TextInput.`);
    return TextInput;
  }
  return Component;
};

export default FieldRegistry;
