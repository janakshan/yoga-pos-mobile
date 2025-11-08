import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui';
import {Spacer} from '@components/layout';
export const CycleCountCreateScreen = () => {
  const {theme} = useTheme();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background.secondary}}>
      <ScrollView style={{padding: 16}}>
        <Typography variant="h5">Create Cycle Count</Typography>
        <Spacer size="md" />
        <Typography variant="body" color={theme.colors.text.secondary}>
          Cycle count form will be implemented here
        </Typography>
      </ScrollView>
    </SafeAreaView>
  );
};
