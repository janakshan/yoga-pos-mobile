import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography, Button} from '@components/ui';
import {Spacer} from '@components/layout';
export const StockTransferCreateScreen = () => {
  const {theme} = useTheme();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background.secondary}}>
      <ScrollView style={{padding: 16}}>
        <Typography variant="h5">Create Stock Transfer</Typography>
        <Spacer size="md" />
        <Typography variant="body" color={theme.colors.text.secondary}>
          Transfer form will be implemented here
        </Typography>
      </ScrollView>
    </SafeAreaView>
  );
};
