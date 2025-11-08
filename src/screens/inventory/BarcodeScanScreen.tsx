import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography} from '@components/ui';
export const BarcodeScanScreen = () => {
  const {theme} = useTheme();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background.secondary}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Typography variant="h5">Barcode Scanner</Typography>
        <Typography variant="body" color={theme.colors.text.secondary}>
          Camera barcode scanning will be implemented here
        </Typography>
      </View>
    </SafeAreaView>
  );
};
