import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import {
  Text,
  Card,
  List,
  useTheme,
  IconButton,
  Button,
  Portal,
  Modal,
  TextInput,
} from 'react-native-paper';
import { useFinance } from '../context/FinanceContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user, setUser, transactions, goals } = useFinance();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Tem certeza que deseja excluir todas as transações e metas? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                'Dados Limpos',
                'Todos os dados foram removidos com sucesso.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    }),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar os dados.');
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    const data = {
      user,
      transactions,
      goals,
      exportDate: new Date().toISOString(),
    };
    
    const jsonData = JSON.stringify(data, null, 2);
    
    Alert.alert(
      'Exportar Dados',
      'Seus dados foram preparados para exportação. Copie o conteúdo abaixo:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Copiar',
          onPress: async () => {
            // Em um app real, você usaria Clipboard.setString(jsonData)
            console.log('Dados para exportação:', jsonData);
            Alert.alert('Sucesso', 'Dados copiados para a área de transferência!');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: () => {
            setUser(null);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const getTotalTransactions = () => transactions.length;
  const getTotalGoals = () => goals.length;
  const getTotalValue = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Perfil do usuário */}
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <IconButton
                icon="account-circle"
                size={60}
                color={theme.colors.primary}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.colors.text }]}>
                  {user?.name || 'Usuário'}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.colors.text + '99' }]}>
                  Usuário do FinTrackr
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Estatísticas */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Estatísticas
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.colors.text + '99' }]}>
                  Transações
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {getTotalTransactions()}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.colors.text + '99' }]}>
                  Metas
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {getTotalGoals()}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.colors.text + '99' }]}>
                  Saldo Atual
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {formatCurrency(getTotalValue())}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Configurações do aplicativo */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Configurações
            </Text>
            
            <List.Item
              title="Modo Escuro"
              description="Ativar tema escuro"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  color={theme.colors.primary}
                />
              )}
            />
            
            <List.Item
              title="Notificações"
              description="Receber alertas do app"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color={theme.colors.primary}
                />
              )}
            />
            
            <List.Item
              title="Lembrete Diário"
              description="Lembrar de registrar gastos"
              left={(props) => <List.Icon {...props} icon="calendar-clock" />}
              right={() => (
                <Switch
                  value={dailyReminder}
                  onValueChange={setDailyReminder}
                  color={theme.colors.primary}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Dados */}
        <Card style={styles.dataCard}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Dados
            </Text>
            
            <List.Item
              title="Exportar Dados"
              description="Fazer backup dos seus dados"
              left={(props) => <List.Icon {...props} icon="export" />}
              onPress={handleExportData}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            
            <List.Item
              title="Limpar Dados"
              description="Apagar todas as informações"
              left={(props) => <List.Icon {...props} icon="delete" color="#F44336" />}
              onPress={handleClearData}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </Card.Content>
        </Card>

        {/* Sobre */}
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Sobre
            </Text>
            
            <List.Item
              title="Versão do App"
              description="1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
            />
            
            <List.Item
              title="Política de Privacidade"
              description="Como protegemos seus dados"
              left={(props) => <List.Icon {...props} icon="shield-check" />}
              onPress={() => Alert.alert('Política de Privacidade', 'Seus dados são armazenados localmente em seu dispositivo e não são compartilhados com terceiros.')}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            
            <List.Item
              title="Termos de Uso"
              description="Condições de uso do app"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              onPress={() => Alert.alert('Termos de Uso', 'Ao usar o FinTrackr, você concorda em usar o aplicativo de acordo com as leis locais e regulamentos.')}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </Card.Content>
        </Card>

        {/* Botão de logout */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
        >
          Sair da Conta
        </Button>

        <Text style={[styles.versionText, { color: theme.colors.text + '66' }]}>
          FinTrackr v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 4,
    borderRadius: 15,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
  },
  statsCard: {
    margin: 16,
    marginVertical: 8,
    elevation: 4,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsCard: {
    margin: 16,
    marginVertical: 8,
    elevation: 4,
    borderRadius: 15,
  },
  dataCard: {
    margin: 16,
    marginVertical: 8,
    elevation: 4,
    borderRadius: 15,
  },
  aboutCard: {
    margin: 16,
    marginVertical: 8,
    elevation: 4,
    borderRadius: 15,
  },
  logoutButton: {
    margin: 16,
    marginTop: 20,
  },
  versionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 12,
  },
});

export default SettingsScreen;