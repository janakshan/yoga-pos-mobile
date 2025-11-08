/**
 * Customer Details Screen
 * Detailed customer view with tabs for info, purchases, loyalty, and communications
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import type {CustomersStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  useCustomer,
  useCustomerPurchaseHistory,
  useCommunicationHistory,
  useUpdateLoyaltyPoints,
  useUpdateStoreCredit,
  useSendEmail,
  useSendSMS,
} from '@hooks/queries/useCustomers';
import {usePermission} from '@hooks/useRBAC';
import {Permission, CommunicationRecord} from '@types/api.types';

import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Input} from '@components/ui/Input';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

type TabType = 'info' | 'purchases' | 'loyalty' | 'communications';

export const CustomerDetailsScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<CustomersStackParamList>>();
  const route = useRoute<RouteProp<CustomersStackParamList, 'CustomerDetails'>>();

  const {customerId} = route.params;

  // Permissions
  const canUpdate = usePermission(Permission.CUSTOMER_UPDATE);

  // State
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [loyaltyPoints, setLoyaltyPoints] = useState('');
  const [storeCreditAmount, setStoreCreditAmount] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  // Queries
  const {data: customer, isLoading} = useCustomer(customerId);
  const {data: purchaseHistory} = useCustomerPurchaseHistory(customerId);
  const {data: communications} = useCommunicationHistory(customerId);

  // Mutations
  const updateLoyaltyPointsMutation = useUpdateLoyaltyPoints();
  const updateStoreCreditMutation = useUpdateStoreCredit();
  const sendEmailMutation = useSendEmail();
  const sendSMSMutation = useSendSMS();

  // Handlers
  const handleEdit = () => {
    navigation.navigate('CustomerForm', {mode: 'edit', customerId});
  };

  const handleEarnPoints = async () => {
    const points = parseInt(loyaltyPoints);
    if (!points || points <= 0) {
      Alert.alert('Error', 'Please enter valid points');
      return;
    }

    try {
      await updateLoyaltyPointsMutation.mutateAsync({
        customerId,
        points,
        action: 'earn',
      });
      Alert.alert('Success', `Added ${points} loyalty points`);
      setLoyaltyPoints('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update points');
    }
  };

  const handleRedeemPoints = async () => {
    const points = parseInt(loyaltyPoints);
    if (!points || points <= 0) {
      Alert.alert('Error', 'Please enter valid points');
      return;
    }

    try {
      await updateLoyaltyPointsMutation.mutateAsync({
        customerId,
        points,
        action: 'redeem',
      });
      Alert.alert('Success', `Redeemed ${points} loyalty points`);
      setLoyaltyPoints('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to redeem points');
    }
  };

  const handleAddStoreCredit = async () => {
    const amount = parseFloat(storeCreditAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please enter valid amount');
      return;
    }

    try {
      await updateStoreCreditMutation.mutateAsync({
        customerId,
        amount,
        action: 'add',
      });
      Alert.alert('Success', `Added $${amount.toFixed(2)} store credit`);
      setStoreCreditAmount('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add store credit');
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailMessage) {
      Alert.alert('Error', 'Please enter subject and message');
      return;
    }

    try {
      await sendEmailMutation.mutateAsync({
        customerId,
        subject: emailSubject,
        message: emailMessage,
      });
      Alert.alert('Success', 'Email sent successfully');
      setEmailSubject('');
      setEmailMessage('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send email');
    }
  };

  const handleSendSMS = async () => {
    if (!smsMessage) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    try {
      await sendSMSMutation.mutateAsync({
        customerId,
        message: smsMessage,
      });
      Alert.alert('Success', 'SMS sent successfully');
      setSmsMessage('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send SMS');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!customer) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.errorContainer}>
          <Typography variant="body" color={theme.textSecondary}>
            Customer not found
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const renderInfoTab = () => (
    <ScrollView style={styles.tabContent}>
      <Card style={styles.section}>
        <Column spacing="md">
          <Typography variant="h3">Personal Information</Typography>

          <Row justify="space-between">
            <Typography variant="body" color={theme.textSecondary}>
              Name:
            </Typography>
            <Typography variant="body">
              {customer.firstName} {customer.lastName}
            </Typography>
          </Row>

          <Row justify="space-between">
            <Typography variant="body" color={theme.textSecondary}>
              Email:
            </Typography>
            <Typography variant="body">{customer.email}</Typography>
          </Row>

          <Row justify="space-between">
            <Typography variant="body" color={theme.textSecondary}>
              Phone:
            </Typography>
            <Typography variant="body">{customer.phone}</Typography>
          </Row>

          {customer.alternatePhone && (
            <Row justify="space-between">
              <Typography variant="body" color={theme.textSecondary}>
                Alt Phone:
              </Typography>
              <Typography variant="body">{customer.alternatePhone}</Typography>
            </Row>
          )}

          {customer.dateOfBirth && (
            <Row justify="space-between">
              <Typography variant="body" color={theme.textSecondary}>
                Birthday:
              </Typography>
              <Typography variant="body">{customer.dateOfBirth}</Typography>
            </Row>
          )}

          {customer.anniversary && (
            <Row justify="space-between">
              <Typography variant="body" color={theme.textSecondary}>
                Anniversary:
              </Typography>
              <Typography variant="body">{customer.anniversary}</Typography>
            </Row>
          )}

          <Row justify="space-between">
            <Typography variant="body" color={theme.textSecondary}>
              Type:
            </Typography>
            <Typography variant="body">{customer.customerType.toUpperCase()}</Typography>
          </Row>

          <Row justify="space-between">
            <Typography variant="body" color={theme.textSecondary}>
              Status:
            </Typography>
            <Typography
              variant="body"
              color={
                customer.status === 'active'
                  ? theme.success
                  : customer.status === 'blocked'
                  ? theme.error
                  : theme.warning
              }>
              {customer.status.toUpperCase()}
            </Typography>
          </Row>
        </Column>
      </Card>

      {customer.address && (
        <Card style={styles.section}>
          <Column spacing="md">
            <Typography variant="h3">Address</Typography>
            <Typography variant="body">
              {customer.address.street}
              {'\n'}
              {customer.address.city}, {customer.address.state}{' '}
              {customer.address.postalCode}
              {'\n'}
              {customer.address.country}
            </Typography>
          </Column>
        </Card>
      )}

      {customer.stats && (
        <Card style={styles.section}>
          <Column spacing="md">
            <Typography variant="h3">Customer Statistics</Typography>

            <Row justify="space-between">
              <Typography variant="body" color={theme.textSecondary}>
                Total Purchases:
              </Typography>
              <Typography variant="h4" color={theme.primary}>
                {customer.stats.totalPurchases || 0}
              </Typography>
            </Row>

            <Row justify="space-between">
              <Typography variant="body" color={theme.textSecondary}>
                Total Spent:
              </Typography>
              <Typography variant="h4" color={theme.success}>
                ${customer.stats.totalSpent?.toFixed(2) || '0.00'}
              </Typography>
            </Row>

            <Row justify="space-between">
              <Typography variant="body" color={theme.textSecondary}>
                Average Order:
              </Typography>
              <Typography variant="h4" color={theme.primary}>
                ${customer.stats.averageOrderValue?.toFixed(2) || '0.00'}
              </Typography>
            </Row>

            {customer.stats.lastPurchaseDate && (
              <Row justify="space-between">
                <Typography variant="body" color={theme.textSecondary}>
                  Last Purchase:
                </Typography>
                <Typography variant="body">
                  {new Date(customer.stats.lastPurchaseDate).toLocaleDateString()}
                </Typography>
              </Row>
            )}

            {customer.stats.customerLifetimeValue && (
              <Row justify="space-between">
                <Typography variant="body" color={theme.textSecondary}>
                  Lifetime Value:
                </Typography>
                <Typography variant="h4" color={theme.warning}>
                  ${customer.stats.customerLifetimeValue.toFixed(2)}
                </Typography>
              </Row>
            )}
          </Column>
        </Card>
      )}

      {customer.notes && (
        <Card style={styles.section}>
          <Column spacing="md">
            <Typography variant="h3">Notes</Typography>
            <Typography variant="body">{customer.notes}</Typography>
          </Column>
        </Card>
      )}

      {canUpdate && (
        <Button
          title="Edit Customer"
          onPress={handleEdit}
          style={styles.editButton}
        />
      )}
    </ScrollView>
  );

  const renderPurchasesTab = () => (
    <FlatList
      data={purchaseHistory || []}
      keyExtractor={(item, index) => item.id || index.toString()}
      renderItem={({item}) => (
        <Card style={styles.purchaseCard}>
          <Column spacing="sm">
            <Row justify="space-between">
              <Typography variant="h4">
                {item.transactionNumber || 'N/A'}
              </Typography>
              <Typography variant="h4" color={theme.success}>
                ${item.total?.toFixed(2) || '0.00'}
              </Typography>
            </Row>
            <Typography variant="caption" color={theme.textSecondary}>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleString()
                : 'Unknown date'}
            </Typography>
            <Typography variant="body">
              Items: {item.items?.length || 0}
            </Typography>
          </Column>
        </Card>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Typography variant="body" color={theme.textSecondary}>
            No purchase history
          </Typography>
        </View>
      }
      contentContainerStyle={styles.listContent}
    />
  );

  const renderLoyaltyTab = () => (
    <ScrollView style={styles.tabContent}>
      {customer.loyaltyInfo && (
        <Card style={styles.section}>
          <Column spacing="md">
            <Typography variant="h3">Loyalty Program</Typography>

            <Row justify="space-between" align="center">
              <Typography variant="body" color={theme.textSecondary}>
                Current Points:
              </Typography>
              <Typography variant="h2" color={theme.warning}>
                {customer.loyaltyInfo.points || 0}
              </Typography>
            </Row>

            <Row justify="space-between">
              <Typography variant="body" color={theme.textSecondary}>
                Tier:
              </Typography>
              <Typography variant="h4" color={theme.primary}>
                {customer.loyaltyInfo.tier.toUpperCase()}
              </Typography>
            </Row>

            <Row justify="space-between">
              <Typography variant="body" color={theme.textSecondary}>
                Lifetime Points:
              </Typography>
              <Typography variant="body">
                {customer.loyaltyInfo.lifetimePoints || 0}
              </Typography>
            </Row>

            <Row justify="space-between">
              <Typography variant="body" color={theme.textSecondary}>
                Member Since:
              </Typography>
              <Typography variant="body">
                {new Date(customer.loyaltyInfo.joinedDate).toLocaleDateString()}
              </Typography>
            </Row>

            {customer.loyaltyCardNumber && (
              <Row justify="space-between">
                <Typography variant="body" color={theme.textSecondary}>
                  Card Number:
                </Typography>
                <Typography variant="body" style={styles.cardNumber}>
                  {customer.loyaltyCardNumber}
                </Typography>
              </Row>
            )}
          </Column>
        </Card>
      )}

      {canUpdate && (
        <>
          <Card style={styles.section}>
            <Column spacing="md">
              <Typography variant="h3">Manage Points</Typography>
              <Input
                placeholder="Enter points"
                value={loyaltyPoints}
                onChangeText={setLoyaltyPoints}
                keyboardType="numeric"
              />
              <Row spacing="sm">
                <Button
                  title="Earn Points"
                  onPress={handleEarnPoints}
                  style={styles.actionButton}
                  disabled={updateLoyaltyPointsMutation.isPending}
                />
                <Button
                  title="Redeem Points"
                  variant="outline"
                  onPress={handleRedeemPoints}
                  style={styles.actionButton}
                  disabled={updateLoyaltyPointsMutation.isPending}
                />
              </Row>
            </Column>
          </Card>

          {customer.storeCredit && (
            <Card style={styles.section}>
              <Column spacing="md">
                <Typography variant="h3">Store Credit</Typography>
                <Row justify="space-between">
                  <Typography variant="body" color={theme.textSecondary}>
                    Balance:
                  </Typography>
                  <Typography variant="h3" color={theme.success}>
                    ${customer.storeCredit.balance?.toFixed(2) || '0.00'}
                  </Typography>
                </Row>
                {customer.storeCredit.expiryDate && (
                  <Row justify="space-between">
                    <Typography variant="body" color={theme.textSecondary}>
                      Expires:
                    </Typography>
                    <Typography variant="body">
                      {new Date(customer.storeCredit.expiryDate).toLocaleDateString()}
                    </Typography>
                  </Row>
                )}
              </Column>
            </Card>
          )}

          <Card style={styles.section}>
            <Column spacing="md">
              <Typography variant="h3">Add Store Credit</Typography>
              <Input
                placeholder="Enter amount"
                value={storeCreditAmount}
                onChangeText={setStoreCreditAmount}
                keyboardType="decimal-pad"
              />
              <Button
                title="Add Credit"
                onPress={handleAddStoreCredit}
                disabled={updateStoreCreditMutation.isPending}
              />
            </Column>
          </Card>
        </>
      )}
    </ScrollView>
  );

  const renderCommunicationsTab = () => (
    <ScrollView style={styles.tabContent}>
      {canUpdate && (
        <>
          <Card style={styles.section}>
            <Column spacing="md">
              <Typography variant="h3">Send Email</Typography>
              <Input
                placeholder="Subject"
                value={emailSubject}
                onChangeText={setEmailSubject}
              />
              <Input
                placeholder="Message"
                value={emailMessage}
                onChangeText={setEmailMessage}
                multiline
                numberOfLines={4}
              />
              <Button
                title="Send Email"
                onPress={handleSendEmail}
                disabled={sendEmailMutation.isPending}
              />
            </Column>
          </Card>

          <Card style={styles.section}>
            <Column spacing="md">
              <Typography variant="h3">Send SMS</Typography>
              <Input
                placeholder="Message"
                value={smsMessage}
                onChangeText={setSmsMessage}
                multiline
                numberOfLines={3}
              />
              <Button
                title="Send SMS"
                onPress={handleSendSMS}
                disabled={sendSMSMutation.isPending}
              />
            </Column>
          </Card>
        </>
      )}

      <Card style={styles.section}>
        <Column spacing="md">
          <Typography variant="h3">Communication History</Typography>
          {communications && communications.length > 0 ? (
            communications.map((comm: CommunicationRecord) => (
              <View key={comm.id} style={styles.commItem}>
                <Row justify="space-between">
                  <Typography variant="body" style={styles.commType}>
                    {comm.type.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color={theme.textSecondary}>
                    {new Date(comm.createdAt).toLocaleDateString()}
                  </Typography>
                </Row>
                {comm.subject && (
                  <Typography variant="body" style={styles.commSubject}>
                    {comm.subject}
                  </Typography>
                )}
                <Typography variant="caption" color={theme.textSecondary}>
                  {comm.message}
                </Typography>
                <Typography
                  variant="caption"
                  color={
                    comm.status === 'delivered'
                      ? theme.success
                      : comm.status === 'failed'
                      ? theme.error
                      : theme.warning
                  }>
                  {comm.status.toUpperCase()}
                </Typography>
              </View>
            ))
          ) : (
            <Typography variant="body" color={theme.textSecondary}>
              No communication history
            </Typography>
          )}
        </Column>
      </Card>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return renderInfoTab();
      case 'purchases':
        return renderPurchasesTab();
      case 'loyalty':
        return renderLoyaltyTab();
      case 'communications':
        return renderCommunicationsTab();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h2">
          {customer.firstName} {customer.lastName}
        </Typography>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, {borderBottomColor: theme.border}]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'info' && {borderBottomColor: theme.primary},
          ]}
          onPress={() => setActiveTab('info')}>
          <Typography
            variant="body"
            color={activeTab === 'info' ? theme.primary : theme.textSecondary}>
            Info
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'purchases' && {borderBottomColor: theme.primary},
          ]}
          onPress={() => setActiveTab('purchases')}>
          <Typography
            variant="body"
            color={activeTab === 'purchases' ? theme.primary : theme.textSecondary}>
            Purchases
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'loyalty' && {borderBottomColor: theme.primary},
          ]}
          onPress={() => setActiveTab('loyalty')}>
          <Typography
            variant="body"
            color={activeTab === 'loyalty' ? theme.primary : theme.textSecondary}>
            Loyalty
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'communications' && {borderBottomColor: theme.primary},
          ]}
          onPress={() => setActiveTab('communications')}>
          <Typography
            variant="body"
            color={
              activeTab === 'communications' ? theme.primary : theme.textSecondary
            }>
            Messages
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    marginBottom: 16,
  },
  purchaseCard: {
    marginBottom: 12,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  cardNumber: {
    fontWeight: '600',
    letterSpacing: 2,
  },
  actionButton: {
    flex: 1,
  },
  commItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  commType: {
    fontWeight: '600',
  },
  commSubject: {
    fontWeight: '500',
    marginTop: 4,
  },
});
