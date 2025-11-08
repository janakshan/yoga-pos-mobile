/**
 * POS Receipt Screen
 * Displays transaction receipt with print and email options
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {POSStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {useTransaction, useEmailReceipt} from '@hooks/queries/usePOS';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';
import {Input} from '@components/ui/Input';

type ReceiptScreenRouteProp = RouteProp<POSStackParamList, 'POSReceipt'>;

export const POSReceiptScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<POSStackParamList>>();
  const route = useRoute<ReceiptScreenRouteProp>();

  const {transactionId} = route.params;

  const [emailAddress, setEmailAddress] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  // Queries
  const {data: transaction, isLoading} = useTransaction(transactionId);
  const emailReceiptMutation = useEmailReceipt();

  // Handle Print
  const handlePrint = () => {
    // TODO: Implement Bluetooth printer integration
    Alert.alert('Print', 'Printer integration coming soon');
  };

  // Handle Email
  const handleEmail = async () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    try {
      await emailReceiptMutation.mutateAsync({
        transactionId,
        email: emailAddress,
      });
      Alert.alert('Success', `Receipt sent to ${emailAddress}`);
      setShowEmailInput(false);
      setEmailAddress('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send email');
    }
  };

  // Handle Share
  const handleShare = async () => {
    if (!transaction) return;

    const receiptText = `
Receipt #${transaction.receiptNumber || transaction.id}
Date: ${new Date(transaction.createdAt!).toLocaleDateString()}

Items:
${transaction.items.map(item => `${item.productName} x${item.quantity} - $${item.total.toFixed(2)}`).join('\n')}

Subtotal: $${transaction.subtotal.toFixed(2)}
Tax: $${transaction.taxTotal.toFixed(2)}
Total: $${transaction.total.toFixed(2)}

Thank you for your business!
    `;

    try {
      await Share.share({
        message: receiptText,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  // Handle New Sale
  const handleNewSale = () => {
    navigation.navigate('POSMain');
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background.primary}]}>
        <Column gap="md" style={styles.centerContent}>
          <Typography variant="body" color={theme.colors.text.secondary}>
            Loading receipt...
          </Typography>
        </Column>
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background.primary}]}>
        <Column gap="md" style={styles.centerContent}>
          <Typography variant="h5" color={theme.colors.text.primary}>
            Receipt Not Found
          </Typography>
          <Button variant="primary" onPress={handleNewSale}>
            Back to POS
          </Button>
        </Column>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background.secondary}]}>
      <ScrollView style={styles.content}>
        {/* Success Message */}
        <View style={styles.successBanner}>
          <Typography variant="h2" style={styles.successIcon}>
            ✓
          </Typography>
          <Typography variant="h5" weight="semiBold" color={theme.colors.success[700]}>
            Transaction Complete
          </Typography>
          <Typography variant="body" color={theme.colors.text.secondary}>
            Receipt #{transaction.receiptNumber || transaction.id?.substring(0, 8)}
          </Typography>
        </View>

        {/* Receipt Card */}
        <Card variant="elevated" padding="md" style={styles.receiptCard}>
          {/* Business Info */}
          <Column gap="xs" style={styles.businessInfo}>
            <Typography variant="h6" weight="bold" align="center">
              Your Business Name
            </Typography>
            <Typography variant="bodySmall" align="center" color={theme.colors.text.secondary}>
              123 Business Street
            </Typography>
            <Typography variant="bodySmall" align="center" color={theme.colors.text.secondary}>
              Phone: (555) 123-4567
            </Typography>
          </Column>

          <View style={[styles.divider, {backgroundColor: theme.colors.border.medium}]} />

          {/* Transaction Info */}
          <Column gap="xs" style={styles.transactionInfo}>
            <Row justifyContent="space-between">
              <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                Date:
              </Typography>
              <Typography variant="bodySmall">
                {new Date(transaction.createdAt!).toLocaleDateString()}
              </Typography>
            </Row>
            <Row justifyContent="space-between">
              <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                Time:
              </Typography>
              <Typography variant="bodySmall">
                {new Date(transaction.createdAt!).toLocaleTimeString()}
              </Typography>
            </Row>
            {transaction.customer && (
              <Row justifyContent="space-between">
                <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                  Customer:
                </Typography>
                <Typography variant="bodySmall">
                  {transaction.customer.firstName} {transaction.customer.lastName}
                </Typography>
              </Row>
            )}
          </Column>

          <View style={[styles.divider, {backgroundColor: theme.colors.border.medium}]} />

          {/* Items */}
          <Column gap="sm" style={styles.items}>
            {transaction.items.map((item, index) => (
              <View key={index}>
                <Row justifyContent="space-between" alignItems="flex-start">
                  <Column gap="xs" style={{flex: 1}}>
                    <Typography variant="body" weight="medium">
                      {item.productName}
                    </Typography>
                    <Typography variant="caption" color={theme.colors.text.secondary}>
                      ${item.unitPrice.toFixed(2)} x {item.quantity}
                    </Typography>
                  </Column>
                  <Typography variant="body" weight="medium">
                    ${item.total.toFixed(2)}
                  </Typography>
                </Row>
                {item.discount && (
                  <Typography
                    variant="caption"
                    color={theme.colors.success[600]}
                    style={styles.discount}>
                    Discount: -${item.discountAmount?.toFixed(2)}
                  </Typography>
                )}
              </View>
            ))}
          </Column>

          <View style={[styles.divider, {backgroundColor: theme.colors.border.medium}]} />

          {/* Totals */}
          <Column gap="xs">
            <Row justifyContent="space-between">
              <Typography variant="body">Subtotal:</Typography>
              <Typography variant="body">${transaction.subtotal.toFixed(2)}</Typography>
            </Row>

            {transaction.discountTotal > 0 && (
              <Row justifyContent="space-between">
                <Typography variant="body" color={theme.colors.success[600]}>
                  Discount:
                </Typography>
                <Typography variant="body" color={theme.colors.success[600]}>
                  -${transaction.discountTotal.toFixed(2)}
                </Typography>
              </Row>
            )}

            <Row justifyContent="space-between">
              <Typography variant="body">Tax:</Typography>
              <Typography variant="body">${transaction.taxTotal.toFixed(2)}</Typography>
            </Row>

            <View style={[styles.divider, {backgroundColor: theme.colors.border.medium}]} />

            <Row justifyContent="space-between">
              <Typography variant="h6" weight="bold">
                Total:
              </Typography>
              <Typography variant="h6" weight="bold" color={theme.colors.primary[600]}>
                ${transaction.total.toFixed(2)}
              </Typography>
            </Row>
          </Column>

          <View style={[styles.divider, {backgroundColor: theme.colors.border.medium}]} />

          {/* Payments */}
          <Column gap="xs">
            <Typography variant="bodySmall" weight="semiBold">
              Payment Method:
            </Typography>
            {transaction.payments.map((payment, index) => (
              <Row key={index} justifyContent="space-between">
                <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                  {payment.method.charAt(0).toUpperCase() + payment.method.slice(1).replace('_', ' ')}:
                </Typography>
                <Typography variant="bodySmall">${payment.amount.toFixed(2)}</Typography>
              </Row>
            ))}

            {transaction.change && transaction.change > 0 && (
              <Row justifyContent="space-between">
                <Typography variant="bodySmall" weight="medium">
                  Change:
                </Typography>
                <Typography variant="bodySmall" weight="medium" color={theme.colors.success[600]}>
                  ${transaction.change.toFixed(2)}
                </Typography>
              </Row>
            )}
          </Column>

          {/* Footer */}
          <Column gap="xs" style={styles.footer}>
            <Typography variant="caption" align="center" color={theme.colors.text.secondary}>
              Thank you for your business!
            </Typography>
            <Typography variant="caption" align="center" color={theme.colors.text.secondary}>
              Please come again
            </Typography>
          </Column>
        </Card>

        {/* Email Input */}
        {showEmailInput && (
          <Card variant="outlined" padding="md" style={styles.emailCard}>
            <Typography variant="body" weight="semiBold" style={styles.emailTitle}>
              Email Receipt
            </Typography>
            <Input
              placeholder="customer@email.com"
              value={emailAddress}
              onChangeText={setEmailAddress}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Row gap="sm">
              <Button
                variant="outline"
                style={{flex: 1}}
                onPress={() => {
                  setShowEmailInput(false);
                  setEmailAddress('');
                }}>
                Cancel
              </Button>
              <Button
                variant="primary"
                style={{flex: 1}}
                onPress={handleEmail}
                loading={emailReceiptMutation.isPending}>
                Send
              </Button>
            </Row>
          </Card>
        )}

        {/* Action Buttons */}
        <Column gap="sm" style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handlePrint}
            leftIcon={<Typography>🖨️</Typography>}>
            Print Receipt
          </Button>

          {!showEmailInput && (
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onPress={() => setShowEmailInput(true)}
              leftIcon={<Typography>📧</Typography>}>
              Email Receipt
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            fullWidth
            onPress={handleShare}
            leftIcon={<Typography>📤</Typography>}>
            Share
          </Button>

          <Button variant="secondary" size="lg" fullWidth onPress={handleNewSale}>
            New Sale
          </Button>
        </Column>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successBanner: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 8,
    color: '#10b981',
  },
  receiptCard: {
    marginBottom: 16,
  },
  businessInfo: {
    marginBottom: 16,
  },
  transactionInfo: {
    marginVertical: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  items: {
    marginBottom: 16,
  },
  discount: {
    marginTop: 4,
  },
  footer: {
    marginTop: 16,
  },
  emailCard: {
    marginBottom: 16,
  },
  emailTitle: {
    marginBottom: 12,
  },
  actions: {
    marginBottom: 32,
  },
});
