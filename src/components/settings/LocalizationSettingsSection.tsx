/**
 * Localization Settings Section
 * Language, locale, number format, and currency display settings
 */

import React from 'react';
import {View} from 'react-native';
import {SettingSection} from './SettingSection';
import {SettingPicker} from './SettingPicker';
import {useSettingsStore} from '@/store/slices/settingsSlice';
import {
  LANGUAGES,
  NUMBER_FORMATS,
  CURRENCY_DISPLAYS,
  Language,
  NumberFormat,
  CurrencyDisplay,
} from '@/types/settings.types';

export const LocalizationSettingsSection: React.FC = () => {
  const {settings, updateLocalizationSettings} = useSettingsStore();
  const localization = settings.localization;

  return (
    <SettingSection
      title="Localization"
      description="Language and regional formatting preferences">
      <SettingPicker
        label="Language"
        description="Application display language"
        value={localization.language}
        options={LANGUAGES.map((lang) => ({
          label: `${lang.label} (${lang.nativeName})`,
          value: lang.value,
        }))}
        onValueChange={(value) =>
          updateLocalizationSettings({
            language: value as Language,
            locale: `${value}-${value.toUpperCase()}`,
          })
        }
      />

      <SettingPicker
        label="Number Format"
        description="How numbers are formatted"
        value={localization.numberFormat}
        options={NUMBER_FORMATS.map((format) => ({
          label: format.label,
          value: format.value,
          description: `Example: ${format.example}`,
        }))}
        onValueChange={(value) =>
          updateLocalizationSettings({numberFormat: value as NumberFormat})
        }
      />

      <SettingPicker
        label="Currency Display"
        description="How currency values are shown"
        value={localization.currencyDisplay}
        options={CURRENCY_DISPLAYS.map((display) => ({
          label: display.label,
          value: display.value,
          description: `Example: ${display.example}`,
        }))}
        onValueChange={(value) =>
          updateLocalizationSettings({currencyDisplay: value as CurrencyDisplay})
        }
        last
      />
    </SettingSection>
  );
};
