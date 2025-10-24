import { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import Input from './Input';

type PasswordProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function PasswordInput({ label = 'Password', value, onChangeText, placeholder = 'Enter your password' }: PasswordProps) {
  const [show, setShow] = useState(false);
  return (
    <Input
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={!show}
      right={<Feather name={show ? 'eye' : 'eye-off'} size={20} color="#667085" />}
      onPressRight={() => setShow((v) => !v)}
    />
  );
}