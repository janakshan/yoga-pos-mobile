/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import { BackupHeadlessTask } from './src/services/BackupScheduler';

AppRegistry.registerComponent(appName, () => App);

// Register headless task for background backups
BackgroundFetch.registerHeadlessTask(BackupHeadlessTask);
