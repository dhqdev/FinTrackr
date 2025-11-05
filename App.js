import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';

// Importar telas
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';

// Importar contexto
import { FinanceProvider } from './src/context/FinanceContext';

// Importar componentes
import NotificationManager from './src/components/NotificationManager';

const Stack = createStackNavigator();

// Configurar notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Tema customizado
  const theme = isDarkTheme ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#4CAF50',
      secondary: '#2196F3',
      background: '#121212',
      surface: '#1E1E1E',
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#4CAF50',
      secondary: '#2196F3',
      background: '#F5F5F5',
      surface: '#FFFFFF',
    },
  };

  // Solicitar permissões para notificações
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de notificação negada');
      }
    };
    requestPermissions();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <FinanceProvider>
          <NotificationManager />
          <NavigationContainer>
            <StatusBar 
              backgroundColor={theme.colors.background} 
              style={isDarkTheme ? 'light' : 'dark'} 
            />
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Dashboard" 
                component={DashboardScreen}
                options={{ 
                  title: 'FinTrackr',
                  headerLeft: null,
                }}
              />
              <Stack.Screen 
                name="Transactions" 
                component={TransactionsScreen}
                options={{ title: 'Transações' }}
              />
              <Stack.Screen 
                name="Goals" 
                component={GoalsScreen}
                options={{ title: 'Metas Financeiras' }}
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{ title: 'Configurações' }}
              />
              <Stack.Screen 
                name="AddTransaction" 
                component={AddTransactionScreen}
                options={{ title: 'Nova Transação' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </FinanceProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}