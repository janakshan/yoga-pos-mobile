/**
 * PO Approval Screen
 */

import React from 'react';
import {View, StyleSheet, SafeAreaView, FlatList, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ProcurementStackParamList} from '@navigation/types';

import {useTheme} from '@hooks/useTheme';
import {
  usePendingApprovals,
  useApprovePurchaseOrder,
  useRejectPurchaseOrder,
} from '@hooks/queries/useProcurement';
import {POApprovalRequest} from '@types/api.types';
import {Typography} from '@components/ui/Typography';
import {Button} from '@components/ui/Button';
import {Card} from '@components/ui/Card';
import {Row, Column} from '@components/layout';

export const POApprovalScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ProcurementStackParamList>>();

  const {data: approvals, isLoading} = usePendingApprovals();
  const approveMutation = useApprovePurchaseOrder();
  const rejectMutation = useRejectPurchaseOrder();

  const handleApprove = async (approvalId: string) => {
    try {
      await approveMutation.mutateAsync({approvalRequestId: approvalId});
      Alert.alert('Success', 'Purchase order approved');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to approve');
    }
  };

  const handleReject = async (approvalId: string) => {
    Alert.prompt(
      'Reject Purchase Order',
      'Please provide a reason for rejection:',
      async (comments) => {
        if (!comments) {
          Alert.alert('Error', 'Rejection reason is required');
          return;
        }
        try {
          await rejectMutation.mutateAsync({approvalRequestId: approvalId, comments});
          Alert.alert('Success', 'Purchase order rejected');
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to reject');
        }
      },
    );
  };

  const renderApprovalCard = ({item}: {item: POApprovalRequest}) => (
    <Card style={styles.card}>
      <Column spacing="sm">
        <Typography variant="h4">
          PO: {item.purchaseOrder?.poNumber || 'Unknown'}
        </Typography>
        <Typography variant="body">
          Supplier: {item.purchaseOrder?.supplier?.name || 'Unknown'}
        </Typography>
        <Typography variant="body">
          Total: {item.purchaseOrder?.currency} {item.purchaseOrder?.total.toFixed(2)}
        </Typography>
        <Typography variant="caption" color={theme.textSecondary}>
          Requested: {new Date(item.requestedAt).toLocaleDateString()}
        </Typography>

        <Row spacing="sm" style={styles.actionsRow}>
          <Button
            variant="primary"
            size="sm"
            onPress={() => handleApprove(item.id)}
            style={styles.actionButton}
            disabled={approveMutation.isPending}>
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            onPress={() => handleReject(item.id)}
            style={styles.actionButton}
            disabled={rejectMutation.isPending}>
            Reject
          </Button>
        </Row>
      </Column>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.header}>
        <Typography variant="h2">Pending Approvals</Typography>
      </View>

      <FlatList
        data={approvals || []}
        keyExtractor={item => item.id}
        renderItem={renderApprovalCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="body" color={theme.textSecondary}>
              {isLoading ? 'Loading approvals...' : 'No pending approvals'}
            </Typography>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 12,
    padding: 16,
  },
  actionsRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
});
