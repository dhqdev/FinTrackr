import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  FAB,
  useTheme,
  IconButton,
  ProgressBar,
  Avatar,
} from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinance } from '../context/FinanceContext';

const DashboardScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user, getBalance, getMonthlyIncome, getMonthlyExpenses, getExpensesByCategory } = useFinance();
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bom dia');
    } else if (hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const balance = getBalance();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const expensesByCategory = getExpensesByCategory();

  // Preparar dados para o gráfico de pizza
  const chartData = expensesByCategory.map((item, index) => ({
    name: item.category,
    amount: item.amount,
    color: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'][index % 6],
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  }));

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getBalanceColor = () => {
    if (balance > 0) return '#4CAF50';
    if (balance < 0) return '#F44336';
    return theme.colors.text;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header com saudação */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <Avatar.Text
                size={40}
                label={user?.name?.charAt(0)?.toUpperCase() || 'U'}
                style={styles.avatar}
              />
              <View>
                <Text style={[styles.greeting, { color: '#fff' }]}>
                  {greeting}, {user?.name}!
                </Text>
                <Text style={[styles.subGreeting, { color: '#fff' }]}>
                  Vamos ver suas finanças hoje
                </Text>
              </View>
            </View>
            <IconButton
              icon="cog"
              color="#fff"
              size={24}
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </LinearGradient>

        {/* Saldo atual */}
        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text style={[styles.balanceLabel, { color: theme.colors.text + '99' }]}>
              Saldo Atual
            </Text>
            <Text style={[styles.balanceValue, { color: getBalanceColor() }]}>
              {formatCurrency(balance)}
            </Text>
            <View style={styles.balanceInfo}>
              <View style={styles.balanceItem}>
                <Text style={[styles.balanceItemLabel, { color: theme.colors.text + '99' }]}>
                  Receitas este mês
                </Text>
                <Text style={[styles.balanceItemValue, { color: '#4CAF50' }]}>
                  {formatCurrency(monthlyIncome)}
                </Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={[styles.balanceItemLabel, { color: theme.colors.text + '99' }]}>
                  Despesas este mês
                </Text>
                <Text style={[styles.balanceItemValue, { color: '#F44336' }]}>
                  {formatCurrency(monthlyExpenses)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Resumo mensal */}
        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, styles.incomeCard]}>
            <Card.Content>
              <View style={styles.summaryHeader}>
                <Text style={[styles.summaryTitle, { color: '#fff' }]}>
                  Receitas
                </Text>
                <IconButton icon="arrow-up" color="#fff" size={20} />
              </View>
              <Text style={[styles.summaryValue, { color: '#fff' }]}>
                {formatCurrency(monthlyIncome)}
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.summaryCard, styles.expenseCard]}>
            <Card.Content>
              <View style={styles.summaryHeader}>
                <Text style={[styles.summaryTitle, { color: '#fff' }]}>
                  Despesas
                </Text>
                <IconButton icon="arrow-down" color="#fff" size={20} />
              </View>
              <Text style={[styles.summaryValue, { color: '#fff' }]}>
                {formatCurrency(monthlyExpenses)}
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Gráfico de gastos por categoria */}
        {expensesByCategory.length > 0 && (
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
                Gastos por Categoria
              </Text>
              <PieChart
                data={chartData}
                width={350}
                height={200}
                chartConfig={{
                  backgroundColor: theme.colors.background,
                  backgroundGradientFrom: theme.colors.background,
                  backgroundGradientTo: theme.colors.background,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => theme.colors.text,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Card.Content>
          </Card>
        )}

        {/* Categorias de gastos */}
        <Card style={styles.categoriesCard}>
          <Card.Content>
            <Text style={[styles.categoriesTitle, { color: theme.colors.text }]}>
              Categorias
            </Text>
            {expensesByCategory.slice(0, 5).map((item, index) => (
              <View key={item.category} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View
                    style={[
                      styles.categoryColor,
                      { backgroundColor: chartData[index]?.color || '#666' },
                    ]}
                  />
                  <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                    {item.category}
                  </Text>
                </View>
                <View style={styles.categoryValues}>
                  <Text style={[styles.categoryAmount, { color: theme.colors.text }]}>
                    {formatCurrency(item.amount)}
                  </Text>
                  <Text style={[styles.categoryPercentage, { color: theme.colors.text + '99' }]}>
                    {item.percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Ações rápidas */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('Transactions')}
          >
            <IconButton icon="format-list-bulleted" size={24} />
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
              Ver Transações
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('Goals')}
          >
            <IconButton icon="target" size={24} />
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
              Minhas Metas
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Botão flutuante para adicionar transação */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddTransaction')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 10,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subGreeting: {
    fontSize: 14,
    opacity: 0.9,
  },
  balanceCard: {
    margin: 20,
    marginTop: -10,
    elevation: 4,
    borderRadius: 15,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flex: 1,
  },
  balanceItemLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  balanceItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    elevation: 4,
  },
  incomeCard: {
    backgroundColor: '#4CAF50',
  },
  expenseCard: {
    backgroundColor: '#F44336',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoriesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 14,
  },
  categoryValues: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryPercentage: {
    fontSize: 12,
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 100,
  },
  quickAction: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
});

export default DashboardScreen;