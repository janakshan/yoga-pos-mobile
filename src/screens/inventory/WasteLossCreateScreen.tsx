import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui';
import {Spacer} from '@components/layout';
export const WasteLossCreateScreen = () => {
  const {theme} = useTheme();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background.secondary}}>
      <ScrollView style={{padding: 16}}>
        <Typography variant="h5">Report Waste/Loss</Typography>
        <Spacer size="md" />
        <Typography variant="body" color={theme.colors.text.secondary}>
          Waste/Loss reporting form will be implemented here
        </Typography>
      </ScrollView>
    </SafeAreaView>
  );
};
