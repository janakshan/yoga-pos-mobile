/**
 * POS Checkout Screen
 * Handles payment processing with multiple payment methods and split payments
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {POSStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {usePOSStore} from '@store/slices/posSlice';
import {useCreateTransaction} from '@hooks/queries/usePOS';
import {useAuthStore} from '@store/slices/authSlice';
import {POSPayment} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

type PaymentMethod = POSPayment['method'];

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  icon: string;
}[] = [
  {id: 'cash', label: 'Cash', icon: '💵'},
  {id: 'card', label: 'Card', icon: '💳'},
  {id: 'mobile_payment', label: 'Mobile Payment', icon: '📱'},
  {id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦'},
  {id: 'store_credit', label: 'Store Credit', icon: '🎟️'},
];

export const POSCheckoutScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<POSStackParamList>>();
  const {user} = useAuthStore();

  // POS Store
  const {
    cartItems,
    selectedCustomer,
    total,
    subtotal,
    discountTotal,
    taxTotal,
    createTransaction,
    clearCart,
    setProcessing,
  } = usePOSStore();

  // Payment State
  const [payments, setPayments] = useState<POSPayment[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [reference, setReference] = useState('');

  // Mutations
  const createTransactionMutation = useCreateTransaction();

  // Calculate remaining amount
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = total - totalPaid;
  const change = selectedMethod === 'cash' ? parseFloat(cashReceived || '0') - remainingAmount : 0;

  // Add Payment
  const handleAddPayment = () => {
    const amount = parseFloat(paymentAmount);

    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount');
      return;
    }

    if (amount > remainingAmount) {
      Alert.alert(
        'Amount Too Large',
        `Payment amount cannot exceed remaining balance of $${remainingAmount.toFixed(2)}`,
      );
      return;
    }

    const newPayment: POSPayment = {
      method: selectedMethod,
      amount,
      reference: reference || undefined,
      status: 'pending',
    };

    setPayments([...payments, newPayment]);
    setPaymentAmount('');
    setReference('');
  };

  // Remove Payment
  const handleRemovePayment = (index: number) => {
    const newPayments = payments.filter((_, i) => i !== index);
    setPayments(newPayments);
  };

  // Complete Transaction
  const handleCompleteTransaction = async () => {
    // Validate payments
    if (remainingAmount > 0.01) {
      Alert.alert(
        'Insufficient Payment',
        `Please add payment for remaining $${remainingAmount.toFixed(2)}`,
      );
      return;
    }

    // For cash payments, validate cash received
    if (selectedMethod === 'cash' && payments.length === 0) {
      const received = parseFloat(cashReceived);
      if (!received || received < remainingAmount) {
        Alert.alert('Insufficient Cash', 'Cash received must be at least the total amount');
        return;
      }

      // Add cash payment
      const cashPayment: POSPayment = {
        method: 'cash',
        amount: remainingAmount,
        status: 'completed',
      };
      payments.push(cashPayment);
    }

    // Create transaction object
    const transaction = createTransaction();
    if (!transaction) {
      Alert.alert('Error', 'Failed to create transaction');
      return;
    }

    // Add payments to transaction
    transaction.payments = payments.map(p => ({...p, status: 'completed'}));
    transaction.amountPaid = total;
    if (selectedMethod === 'cash') {
      transaction.change = change > 0 ? change : 0;
    }
    transaction.status = 'completed';
    transaction.completedAt = new Date().toISOString();

    try {
      setProcessing(true);

      // Submit transaction to API
      const result = await createTransactionMutation.mutateAsync(transaction);

      // Clear cart and navigate to receipt
      clearCart();
      navigation.replace('POSReceipt', {transactionId: result.id!});

      Alert.alert('Success', 'Transaction completed successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete transaction');
    } finally {
      setProcessing(false);
    }
  };

  // Quick Cash Amounts
  const quickCashAmounts = [
    Math.ceil(total),
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 20) * 20,
    Math.ceil(total / 50) * 50,
  ];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background.secondary}]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {backgroundColor: theme.colors.background.primary},
          ]}>
          <Row justifyContent="space-between" alignItems="center">
            <Button variant="ghost" onPress={() => navigation.goBack()}>
              ← Back
            </Button>
            <Typography variant="h5" weight="semiBold" color={theme.colors.text.primary}>
              Checkout
            </Typography>
            <View style={{width: 60}} />
          </Row>
        </View>

        <ScrollView style={styles.content}>
          {/* Order Summary */}
          <Card variant="elevated" padding="md" style={styles.section}>
            <Typography variant="h6" weight="semiBold" style={styles.sectionTitle}>
              Order Summary
            </Typography>

            {selectedCustomer && (
              <Row gap="sm" style={styles.customerInfo}>
                <Typography variant="body" color={theme.colors.text.secondary}>
                  Customer:
                </Typography>
                <Typography variant="body" weight="medium" color={theme.colors.text.primary}>
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </Typography>
              </Row>
            )}

            <Column gap="xs" style={styles.summary}>
              <Row justifyContent="space-between">
                <Typography variant="body">Items ({cartItems.length}):</Typography>
                <Typography variant="body">${subtotal.toFixed(2)}</Typography>
              </Row>

              {discountTotal > 0 && (
                <Row justifyContent="space-between">
                  <Typography variant="body" color={theme.colors.success[600]}>
                    Discount:
                  </Typography>
                  <Typography variant="body" color={theme.colors.success[600]}>
                    -${discountTotal.toFixed(2)}
                  </Typography>
                </Row>
              )}

              <Row justifyContent="space-between">
                <Typography variant="body">Tax:</Typography>
                <Typography variant="body">${taxTotal.toFixed(2)}</Typography>
              </Row>

              <View style={[styles.divider, {backgroundColor: theme.colors.border.medium}]} />

              <Row justifyContent="space-between">
                <Typography variant="h6" weight="bold">
                  Total:
                </Typography>
                <Typography variant="h6" weight="bold" color={theme.colors.primary[600]}>
                  ${total.toFixed(2)}
                </Typography>
              </Row>
            </Column>
          </Card>

          {/* Payment Methods */}
          <Card variant="elevated" padding="md" style={styles.section}>
            <Typography variant="h6" weight="semiBold" style={styles.sectionTitle}>
              Payment Method
            </Typography>

            <Row gap="sm" wrap style={styles.paymentMethods}>
              {PAYMENT_METHODS.map(method => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodButton,
                    {
                      borderColor:
                        selectedMethod === method.id
                          ? theme.colors.primary[500]
                          : theme.colors.border.light,
                      backgroundColor:
                        selectedMethod === method.id
                          ? theme.colors.primary[50]
                          : theme.colors.background.primary,
                    },
                  ]}
                  onPress={() => setSelectedMethod(method.id)}>
                  <Typography variant="h5">{method.icon}</Typography>
                  <Typography
                    variant="bodySmall"
                    weight={selectedMethod === method.id ? 'semiBold' : 'regular'}
                    color={
                      selectedMethod === method.id
                        ? theme.colors.primary[600]
                        : theme.colors.text.primary
                    }>
                    {method.label}
                  </Typography>
                </TouchableOpacity>
              ))}
            </Row>
          </Card>

          {/* Cash Payment */}
          {selectedMethod === 'cash' && (
            <Card variant="elevated" padding="md" style={styles.section}>
              <Typography variant="h6" weight="semiBold" style={styles.sectionTitle}>
                Cash Payment
              </Typography>

              <Input
                label="Cash Received"
                placeholder="0.00"
                value={cashReceived}
                onChangeText={setCashReceived}
                keyboardType="decimal-pad"
              />

              {/* Quick Cash Buttons */}
              <Row gap="sm" wrap style={styles.quickCash}>
                {quickCashAmounts.map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onPress={() => setCashReceived(amount.toString())}>
                    ${amount}
                  </Button>
                ))}
              </Row>

              {parseFloat(cashReceived) > 0 && (
                <Row
                  justifyContent="space-between"
                  style={[
                    styles.changeBox,
                    {backgroundColor: theme.colors.success[50]},
                  ]}>
                  <Typography variant="h6" weight="semiBold">
                    Change:
                  </Typography>
                  <Typography
                    variant="h5"
                    weight="bold"
                    color={theme.colors.success[600]}>
                    ${change >= 0 ? change.toFixed(2) : '0.00'}
                  </Typography>
                </Row>
              )}
            </Card>
          )}

          {/* Split Payment */}
          {payments.length > 0 && (
            <Card variant="elevated" padding="md" style={styles.section}>
              <Typography variant="h6" weight="semiBold" style={styles.sectionTitle}>
                Payments Added
              </Typography>

              {payments.map((payment, index) => (
                <Row
                  key={index}
                  justifyContent="space-between"
                  alignItems="center"
                  style={styles.paymentItem}>
                  <Column gap="xs">
                    <Typography variant="body" weight="medium">
                      {
                        PAYMENT_METHODS.find(m => m.id === payment.method)
                          ?.label
                      }
                    </Typography>
                    {payment.reference && (
                      <Typography variant="caption" color={theme.colors.text.secondary}>
                        Ref: {payment.reference}
                      </Typography>
                    )}
                  </Column>
                  <Row gap="md" alignItems="center">
                    <Typography variant="body" weight="bold">
                      ${payment.amount.toFixed(2)}
                    </Typography>
                    <TouchableOpacity onPress={() => handleRemovePayment(index)}>
                      <Typography color={theme.colors.error[500]}>🗑️</Typography>
                    </TouchableOpacity>
                  </Row>
                </Row>
              ))}
            </Card>
          )}

          {/* Add Payment (for split payments) */}
          {remainingAmount > 0.01 && (
            <Card variant="elevated" padding="md" style={styles.section}>
              <Typography variant="h6" weight="semiBold" style={styles.sectionTitle}>
                Add Payment
              </Typography>

              <Typography variant="body" color={theme.colors.text.secondary} style={styles.remainingText}>
                Remaining: ${remainingAmount.toFixed(2)}
              </Typography>

              <Input
                label="Amount"
                placeholder="0.00"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                keyboardType="decimal-pad"
              />

              {selectedMethod !== 'cash' && (
                <Input
                  label="Reference Number (Optional)"
                  placeholder="Transaction reference"
                  value={reference}
                  onChangeText={setReference}
                />
              )}

              <Button variant="outline" fullWidth onPress={handleAddPayment}>
                Add Payment
              </Button>
            </Card>
          )}
        </ScrollView>

        {/* Complete Button */}
        <View
          style={[
            styles.footer,
            {backgroundColor: theme.colors.background.primary},
          ]}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleCompleteTransaction}
            loading={createTransactionMutation.isPending}
            disabled={remainingAmount > 0.01}>
            {remainingAmount > 0.01
              ? `Pay $${remainingAmount.toFixed(2)}`
              : 'Complete Transaction'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  customerInfo: {
    marginBottom: 16,
  },
  summary: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  paymentMethods: {
    marginTop: 8,
  },
  paymentMethodButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    minWidth: 100,
    gap: 8,
  },
  quickCash: {
    marginTop: 16,
  },
  changeBox: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  paymentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  remainingText: {
    marginBottom: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});
