/**
 * General Settings Section
 * Currency, date/time formats, tax, payment, receipt, and sound settings
 */

import React from 'react';
import {View} from 'react-native';
import {SettingSection} from './SettingSection';
import {SettingSwitch} from './SettingSwitch';
import {SettingPicker} from './SettingPicker';
import {useSettingsStore} from '@/store/slices/settingsSlice';
import {
  CURRENCIES,
  DATE_FORMATS,
  TIME_FORMATS,
  PAYMENT_METHODS,
  Currency,
  DateFormat,
  TimeFormat,
  PaymentMethod,
} from '@/types/settings.types';

interface GeneralSettingsSectionProps {
  onTaxRatePress: () => void;
}

export const GeneralSettingsSection: React.FC<
  GeneralSettingsSectionProps
> = ({onTaxRatePress}) => {
  const {settings, updateGeneralSettings} = useSettingsStore();
  const general = settings.general;

  return (
    <SettingSection
      title="General Settings"
      description="Configure basic application preferences">
      <SettingPicker
        label="Currency"
        description="Default currency for transactions"
        value={general.currency}
        options={CURRENCIES.map((curr) => ({
          label: `${curr.label} (${curr.symbol})`,
          value: curr.value,
          description: curr.symbol,
        }))}
        onValueChange={(value) =>
          updateGeneralSettings({currency: value as Currency})
        }
      />

      <SettingPicker
        label="Date Format"
        description="How dates are displayed"
        value={general.dateFormat}
        options={DATE_FORMATS}
        onValueChange={(value) =>
          updateGeneralSettings({dateFormat: value as DateFormat})
        }
      />

      <SettingPicker
        label="Time Format"
        description="12-hour or 24-hour clock"
        value={general.timeFormat}
        options={TIME_FORMATS}
        onValueChange={(value) =>
          updateGeneralSettings({timeFormat: value as TimeFormat})
        }
      />

      <SettingPicker
        label="Default Payment Method"
        description="Primary payment method for transactions"
        value={general.defaultPaymentMethod}
        options={PAYMENT_METHODS}
        onValueChange={(value) =>
          updateGeneralSettings({defaultPaymentMethod: value as PaymentMethod})
        }
      />

      <SettingSwitch
        label="Receipt Auto-Print"
        description="Automatically print receipts after transactions"
        value={general.receiptAutoPrint}
        onValueChange={(value) =>
          updateGeneralSettings({receiptAutoPrint: value})
        }
      />

      <SettingSwitch
        label="Sound Effects"
        description="Enable audio feedback for actions"
        value={general.soundEffects}
        onValueChange={(value) =>
          updateGeneralSettings({soundEffects: value})
        }
        last
      />
    </SettingSection>
  );
};
