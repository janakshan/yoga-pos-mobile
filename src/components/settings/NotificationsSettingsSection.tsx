/**
 * Notifications Settings Section
 * Email, SMS, WhatsApp, and push notification settings
 */

import React from 'react';
import {View} from 'react-native';
import {SettingSection} from './SettingSection';
import {SettingItem} from './SettingItem';
import {SettingSwitch} from './SettingSwitch';
import {useSettingsStore} from '@/store/slices/settingsSlice';

export const NotificationsSettingsSection: React.FC = () => {
  const {settings, updateNotificationSettings} = useSettingsStore();
  const notifications = settings.notifications;

  return (
    <>
      {/* Email Notifications */}
      <SettingSection
        title="Email Notifications"
        description="Receive notifications via email">
        <SettingSwitch
          label="Enable Email Notifications"
          description="Receive alerts and updates via email"
          value={notifications.email.enabled}
          onValueChange={(value) =>
            updateNotificationSettings({
              email: {...notifications.email, enabled: value},
            })
          }
        />

        {notifications.email.enabled && (
          <>
            <SettingItem
              label="Email Address"
              description="Where to send notifications"
              value={notifications.email.address || 'Not configured'}
            />

            <SettingSwitch
              label="Low Stock Alerts"
              description="Notify when inventory is low"
              value={notifications.email.lowStock}
              onValueChange={(value) =>
                updateNotificationSettings({
                  email: {...notifications.email, lowStock: value},
                })
              }
            />

            <SettingSwitch
              label="Daily Summary"
              description="Receive daily sales summary"
              value={notifications.email.dailySummary}
              onValueChange={(value) =>
                updateNotificationSettings({
                  email: {...notifications.email, dailySummary: value},
                })
              }
            />

            <SettingSwitch
              label="Weekly Report"
              description="Receive weekly performance report"
              value={notifications.email.weeklyReport}
              onValueChange={(value) =>
                updateNotificationSettings({
                  email: {...notifications.email, weeklyReport: value},
                })
              }
              last
            />
          </>
        )}
      </SettingSection>

      {/* SMS Notifications */}
      <SettingSection
        title="SMS Notifications"
        description="Receive notifications via text message">
        <SettingSwitch
          label="Enable SMS Notifications"
          description="Receive alerts via text message"
          value={notifications.sms.enabled}
          onValueChange={(value) =>
            updateNotificationSettings({
              sms: {...notifications.sms, enabled: value},
            })
          }
        />

        {notifications.sms.enabled && (
          <>
            <SettingItem
              label="Phone Number"
              description="Where to send SMS notifications"
              value={notifications.sms.phoneNumber || 'Not configured'}
            />

            <SettingSwitch
              label="Low Stock Alerts"
              description="Notify when inventory is low"
              value={notifications.sms.lowStock}
              onValueChange={(value) =>
                updateNotificationSettings({
                  sms: {...notifications.sms, lowStock: value},
                })
              }
            />

            <SettingSwitch
              label="Critical Alerts"
              description="Receive urgent system alerts"
              value={notifications.sms.criticalAlerts}
              onValueChange={(value) =>
                updateNotificationSettings({
                  sms: {...notifications.sms, criticalAlerts: value},
                })
              }
              last
            />
          </>
        )}
      </SettingSection>

      {/* WhatsApp Notifications */}
      <SettingSection
        title="WhatsApp Notifications"
        description="Receive notifications via WhatsApp">
        <SettingSwitch
          label="Enable WhatsApp Notifications"
          description="Receive alerts via WhatsApp"
          value={notifications.whatsapp.enabled}
          onValueChange={(value) =>
            updateNotificationSettings({
              whatsapp: {...notifications.whatsapp, enabled: value},
            })
          }
        />

        {notifications.whatsapp.enabled && (
          <>
            <SettingItem
              label="Phone Number"
              description="WhatsApp number for notifications"
              value={notifications.whatsapp.phoneNumber || 'Not configured'}
            />

            <SettingSwitch
              label="Daily Summary"
              description="Receive daily sales summary"
              value={notifications.whatsapp.dailySummary}
              onValueChange={(value) =>
                updateNotificationSettings({
                  whatsapp: {...notifications.whatsapp, dailySummary: value},
                })
              }
            />

            <SettingSwitch
              label="Customer Receipts"
              description="Send receipts to customers via WhatsApp"
              value={notifications.whatsapp.customerReceipts}
              onValueChange={(value) =>
                updateNotificationSettings({
                  whatsapp: {
                    ...notifications.whatsapp,
                    customerReceipts: value,
                  },
                })
              }
              last
            />
          </>
        )}
      </SettingSection>

      {/* Push Notifications */}
      <SettingSection
        title="Push Notifications"
        description="Receive in-app push notifications">
        <SettingSwitch
          label="Enable Push Notifications"
          description="Receive notifications in the app"
          value={notifications.push.enabled}
          onValueChange={(value) =>
            updateNotificationSettings({
              push: {...notifications.push, enabled: value},
            })
          }
        />

        {notifications.push.enabled && (
          <>
            <SettingSwitch
              label="Low Stock Alerts"
              description="Notify when inventory is low"
              value={notifications.push.lowStock}
              onValueChange={(value) =>
                updateNotificationSettings({
                  push: {...notifications.push, lowStock: value},
                })
              }
            />

            <SettingSwitch
              label="New Orders"
              description="Notify when new orders are placed"
              value={notifications.push.newOrders}
              onValueChange={(value) =>
                updateNotificationSettings({
                  push: {...notifications.push, newOrders: value},
                })
              }
            />

            <SettingSwitch
              label="Daily Summary"
              description="Receive daily sales summary"
              value={notifications.push.dailySummary}
              onValueChange={(value) =>
                updateNotificationSettings({
                  push: {...notifications.push, dailySummary: value},
                })
              }
              last
            />
          </>
        )}
      </SettingSection>
    </>
  );
};
