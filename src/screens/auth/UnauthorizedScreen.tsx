import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@navigation/types';
import {useAuthStore} from '@store/slices/authSlice';
import {useTheme} from '@hooks/useTheme';
import {Typography, Button} from '@components/ui';
import {Column, Spacer} from '@components/layout';

/**
 * Unauthorized Screen
 * Shown when user tries to access a resource they don't have permission for
 */

type Props = NativeStackScreenProps<AuthStackParamList, 'Unauthorized'>;

export const UnauthorizedScreen: React.FC<Props> = ({navigation, route}) => {
  const {user, logout} = useAuthStore();
  const {theme} = useTheme();

  const message =
    route.params?.message ||
    'You do not have permission to access this resource.';

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Login');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <View style={styles.content}>
        <Column alignItems="center">
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: theme.colors.error + '20'},
            ]}>
            <Typography
              variant="h1"
              color={theme.colors.error}
              style={styles.icon}>
              🚫
            </Typography>
          </View>

          <Spacer size="lg" />

          <Typography variant="h2" color={theme.colors.text.primary}>
            Access Denied
          </Typography>

          <Spacer size="md" />

          <Typography
            variant="body"
            color={theme.colors.text.secondary}
            style={styles.message}>
            {message}
          </Typography>

          {user && (
            <>
              <Spacer size="lg" />
              <View
                style={[
                  styles.userInfoBox,
                  {
                    backgroundColor: theme.colors.background.secondary,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <Typography variant="bodySmall" color={theme.colors.text.secondary}>
                  Signed in as
                </Typography>
                <Spacer size="xs" />
                <Typography
                  variant="body"
                  color={theme.colors.text.primary}
                  style={styles.userName}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color={theme.colors.text.tertiary}>
                  {user.email}
                </Typography>
                <Spacer size="xs" />
                <View
                  style={[
                    styles.roleBadge,
                    {backgroundColor: theme.colors.primary[100]},
                  ]}>
                  <Typography
                    variant="caption"
                    color={theme.colors.primary[700]}
                    style={styles.roleText}>
                    Role: {user.role}
                  </Typography>
                </View>
              </View>
            </>
          )}

          <Spacer size="3xl" />

          <View style={styles.actionsContainer}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleGoBack}>
              Go Back
            </Button>

            <Spacer size="md" />

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onPress={handleLogout}>
              Sign Out
            </Button>
          </View>

          <Spacer size="lg" />

          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: theme.colors.border,
              },
            ]}>
            <Typography variant="caption" color={theme.colors.text.secondary}>
              💡 If you believe this is an error, please contact your
              administrator to request the necessary permissions.
            </Typography>
          </View>
        </Column>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
  },
  message: {
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  userInfoBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontWeight: '600',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  roleText: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionsContainer: {
    width: '100%',
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});
