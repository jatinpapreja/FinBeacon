// components/ui/LanguageSelector.tsx
import { LanguageCode } from '@/constants/translations';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Text, View } from 'react-native'; // ← added Text

interface LanguageSelectorProps {
  language: LanguageCode;
  onChange: (code: LanguageCode) => void;
  label: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onChange,
  label,
}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: 10,
    }}
  >
    <Text style={{ marginRight: 8, fontWeight: '600' }}>{label}</Text>

    {/* Picker returns a string – cast to LanguageCode */}
    <Picker
      selectedValue={language}
      style={{ width: 140, height: 40 }}
      mode="dropdown"
      onValueChange={(val) => onChange(val as LanguageCode)}
    >
      <Picker.Item label="English" value="en" />
      <Picker.Item label="हिन्दी" value="hi" />
      <Picker.Item label="Deutsch" value="de" />
    </Picker>
  </View>
);

export default LanguageSelector;