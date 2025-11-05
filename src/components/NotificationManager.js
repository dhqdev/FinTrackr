import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useFinance } from '../context/FinanceContext';

// Configurar handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationManager = () => {
  const { getMonthlyExpenses } = useFinance();

  useEffect(() => {
    // Configurar notificações ao montar o componente
    setupNotifications();
    
    // Agendar notificações diárias
    scheduleDailyReminder();
    
    // Verificar orçamento mensal
    checkBudgetAlert();
    
    return () => {
      // Limpar notificações ao desmontar
      Notifications.cancelAllScheduledNotificationsAsync();
    };
  }, []);

  const setupNotifications = async () => {
    try {
      // Solicitar permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permissão de notificação negada');
        return;
      }

      // Configurar canal de notificação para Android
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.error('Erro ao configurar notificações:', error);
    }
  };

  const scheduleDailyReminder = async () => {
    try {
      // Cancelar notificações anteriores
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Agendar notificação diária às 20h
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📊 Lembrete Diário',
          body: 'Não se esqueça de registrar seus gastos de hoje no FinTrackr!',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: 20,
          minute: 0,
          repeats: true,
        },
      });
      
      console.log('Notificação diária agendada');
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  };

  const checkBudgetAlert = async () => {
    const monthlyExpenses = getMonthlyExpenses();
    const budgetLimit = 2000; // Limite de orçamento exemplo
    
    if (monthlyExpenses > budgetLimit * 0.8) { // 80% do limite
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚠️ Alerta de Orçamento',
          body: `Você já gastou ${((monthlyExpenses / budgetLimit) * 100).toFixed(0)}% do seu orçamento mensal!`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Notificação imediata
      });
    }
  };

  const sendGoalAchievementNotification = async (goalTitle) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Parabéns!',
        body: `Você alcançou sua meta: ${goalTitle}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });
  };

  const sendWeeklyReport = async () => {
    // Esta função poderia ser chamada semanalmente para enviar um relatório
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📈 Relatório Semanal',
        body: 'Seu relatório de gastos da semana está disponível!',
        sound: false,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
      },
      trigger: {
        weekday: 1, // Domingo
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  };

  // Este componente não renderiza nada, apenas gerencia notificações
  return null;
};

export default NotificationManager;

// Funções utilitárias para notificações
export const notificationUtils = {
  // Notificação de boas-vindas
  sendWelcomeNotification: async (userName) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Bem-vindo ao FinTrackr, ${userName}! 👋`,
        body: 'Comece registrando sua primeira transação e alcance suas metas financeiras.',
        sound: true,
      },
      trigger: null,
    });
  },

  // Notificação de transação grande
  sendLargeTransactionAlert: async (amount, title) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💰 Transação Registrada',
        body: `Você registrou ${amount} para "${title}"`,
        sound: false,
      },
      trigger: null,
    });
  },

  // Notificação de meta próxima do prazo
  sendGoalDeadlineAlert: async (goalTitle, daysLeft) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Prazo se Aproximando',
        body: `Faltam ${daysLeft} dias para o prazo da sua meta: ${goalTitle}`,
        sound: true,
      },
      trigger: null,
    });
  },

  // Cancelar todas as notificações
  cancelAllNotifications: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};