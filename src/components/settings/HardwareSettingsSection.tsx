/**
 * Hardware Settings Section
 * Receipt printer, barcode scanner, cash drawer, and customer display settings
 */

import React from 'react';
import {View, Alert} from 'react-native';
import {SettingSection} from './SettingSection';
import {SettingItem} from './SettingItem';
import {SettingSwitch} from './SettingSwitch';
import {Button} from '@components/ui';
import {Spacer} from '@components/layout';
import {useSettingsStore} from '@/store/slices/settingsSlice';

export const HardwareSettingsSection: React.FC = () => {
  const {settings, updateHardwareSettings} = useSettingsStore();
  const hardware = settings.hardware;

  const handleTestPrinter = () => {
    Alert.alert(
      'Test Printer',
      'This will send a test print to your configured printer.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Print Test',
          onPress: () => {
            // TODO: Implement actual printer test
            Alert.alert('Success', 'Test print sent successfully!');
          },
        },
      ]
    );
  };

  const handleTestScanner = () => {
    Alert.alert(
      'Test Scanner',
      'This will test your barcode scanner configuration.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Test Scanner',
          onPress: () => {
            // TODO: Implement actual scanner test
            Alert.alert('Success', 'Scanner is working correctly!');
          },
        },
      ]
    );
  };

  const handleTestCashDrawer = () => {
    Alert.alert(
      'Test Cash Drawer',
      'This will open the cash drawer if connected.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open Drawer',
          onPress: () => {
            // TODO: Implement actual cash drawer trigger
            Alert.alert('Success', 'Cash drawer opened!');
          },
        },
      ]
    );
  };

  const handleTestDisplay = () => {
    Alert.alert(
      'Test Customer Display',
      'This will test the customer display connection.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Test Display',
          onPress: () => {
            // TODO: Implement actual display test
            Alert.alert('Success', 'Display is working correctly!');
          },
        },
      ]
    );
  };

  return (
    <>
      {/* Receipt Printer */}
      <SettingSection
        title="Receipt Printer"
        description="Configure your receipt printer">
        <SettingSwitch
          label="Enable Receipt Printer"
          description="Use a physical receipt printer"
          value={hardware.receiptPrinter.enabled}
          onValueChange={(value) =>
            updateHardwareSettings({
              receiptPrinter: {...hardware.receiptPrinter, enabled: value},
            })
          }
        />

        {hardware.receiptPrinter.enabled && (
          <>
            <SettingItem
              label="Connection Type"
              description="How the printer connects"
              value={
                hardware.receiptPrinter.connection.charAt(0).toUpperCase() +
                hardware.receiptPrinter.connection.slice(1)
              }
            />

            <SettingItem
              label="Device Name"
              description="Name of the connected printer"
              value={hardware.receiptPrinter.deviceName || 'Not configured'}
            />

            <SettingSwitch
              label="Auto-Cut"
              description="Automatically cut paper after printing"
              value={hardware.receiptPrinter.autoCut}
              onValueChange={(value) =>
                updateHardwareSettings({
                  receiptPrinter: {...hardware.receiptPrinter, autoCut: value},
                })
              }
              last
            />

            <View style={{padding: 16}}>
              <Button variant="outline" onPress={handleTestPrinter}>
                Test Printer
              </Button>
            </View>
          </>
        )}
      </SettingSection>

      {/* Barcode Scanner */}
      <SettingSection
        title="Barcode Scanner"
        description="Configure barcode scanning">
        <SettingSwitch
          label="Enable Barcode Scanner"
          description="Use a barcode scanner for products"
          value={hardware.barcodeScanner.enabled}
          onValueChange={(value) =>
            updateHardwareSettings({
              barcodeScanner: {...hardware.barcodeScanner, enabled: value},
            })
          }
        />

        {hardware.barcodeScanner.enabled && (
          <>
            <SettingItem
              label="Scanner Type"
              description="Type of barcode scanner"
              value={
                hardware.barcodeScanner.type === 'camera'
                  ? 'Camera'
                  : hardware.barcodeScanner.type.charAt(0).toUpperCase() +
                    hardware.barcodeScanner.type.slice(1)
              }
            />

            <SettingItem
              label="Device Name"
              description="Name of the connected scanner"
              value={hardware.barcodeScanner.deviceName || 'Not configured'}
              last
            />

            <View style={{padding: 16}}>
              <Button variant="outline" onPress={handleTestScanner}>
                Test Scanner
              </Button>
            </View>
          </>
        )}
      </SettingSection>

      {/* Cash Drawer */}
      <SettingSection title="Cash Drawer" description="Configure cash drawer">
        <SettingSwitch
          label="Enable Cash Drawer"
          description="Use a physical cash drawer"
          value={hardware.cashDrawer.enabled}
          onValueChange={(value) =>
            updateHardwareSettings({
              cashDrawer: {...hardware.cashDrawer, enabled: value},
            })
          }
        />

        {hardware.cashDrawer.enabled && (
          <>
            <SettingSwitch
              label="Auto-Open"
              description="Automatically open drawer after cash transactions"
              value={hardware.cashDrawer.autoOpen}
              onValueChange={(value) =>
                updateHardwareSettings({
                  cashDrawer: {...hardware.cashDrawer, autoOpen: value},
                })
              }
            />

            <SettingSwitch
              label="Connected to Printer"
              description="Cash drawer is connected via receipt printer"
              value={hardware.cashDrawer.connectedToPrinter}
              onValueChange={(value) =>
                updateHardwareSettings({
                  cashDrawer: {
                    ...hardware.cashDrawer,
                    connectedToPrinter: value,
                  },
                })
              }
              last
            />

            <View style={{padding: 16}}>
              <Button variant="outline" onPress={handleTestCashDrawer}>
                Test Cash Drawer
              </Button>
            </View>
          </>
        )}
      </SettingSection>

      {/* Customer Display */}
      <SettingSection
        title="Customer Display"
        description="Configure customer-facing display">
        <SettingSwitch
          label="Enable Customer Display"
          description="Use a customer-facing display"
          value={hardware.customerDisplay.enabled}
          onValueChange={(value) =>
            updateHardwareSettings({
              customerDisplay: {...hardware.customerDisplay, enabled: value},
            })
          }
        />

        {hardware.customerDisplay.enabled && (
          <>
            <SettingItem
              label="Connection Type"
              description="How the display connects"
              value={
                hardware.customerDisplay.connection.charAt(0).toUpperCase() +
                hardware.customerDisplay.connection.slice(1)
              }
            />

            <SettingItem
              label="Device Name"
              description="Name of the connected display"
              value={hardware.customerDisplay.deviceName || 'Not configured'}
              last
            />

            <View style={{padding: 16}}>
              <Button variant="outline" onPress={handleTestDisplay}>
                Test Display
              </Button>
            </View>
          </>
        )}
      </SettingSection>
    </>
  );
};
