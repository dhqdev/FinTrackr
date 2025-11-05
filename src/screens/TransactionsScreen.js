import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Searchbar,
  Chip,
  IconButton,
  useTheme,
  FAB,
  Modal,
  Portal,
  Button,
  TextInput,
} from 'react-native-paper';
import { useFinance } from '../context/FinanceContext';

const TransactionsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { transactions, updateTransaction, deleteTransaction } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Categorias disponíveis
  const categories = [
    'all',
    'Alimentação',
    'Transporte',
    'Entretenimento',
    'Saúde',
    'Educação',
    'Salário',
    'Trabalho',
    'Investimento',
    'Outros',
  ];

  // Filtrar transações
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      const matchesType = selectedType === 'all' || transaction.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTransactionIcon = (type, category) => {
    if (type === 'income') {
      return 'arrow-up';
    }
    
    const categoryIcons = {
      'Alimentação': 'food',
      'Transporte': 'car',
      'Entretenimento': 'movie',
      'Saúde': 'hospital',
      'Educação': 'school',
      'Outros': 'help-circle',
    };
    
    return categoryIcons[category] || 'help-circle';
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalVisible(true);
  };

  const handleDelete = (transaction) => {
    Alert.alert(
      'Excluir Transação',
      `Tem certeza que deseja excluir "${transaction.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteTransaction(transaction.id),
        },
      ]
    );
  };

  const handleSaveEdit = () => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, editingTransaction);
      setModalVisible(false);
      setEditingTransaction(null);
    }
  };

  const renderTransaction = ({ item }) => (
    <Card style={styles.transactionCard}>
      <Card.Content style={styles.transactionContent}>
        <View style={styles.transactionLeft}>
          <IconButton
            icon={getTransactionIcon(item.type, item.category)}
            size={24}
            color={item.type === 'income' ? '#4CAF50' : '#F44336'}
            style={styles.transactionIcon}
          />
          <View style={styles.transactionInfo}>
            <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.transactionCategory, { color: theme.colors.text + '99' }]}>
              {item.category}
            </Text>
            {item.description && (
              <Text style={[styles.transactionDescription, { color: theme.colors.text + '66' }]}>
                {item.description}
              </Text>
            )}
            <Text style={[styles.transactionDate, { color: theme.colors.text + '99' }]}>
              {formatDate(item.date)}
            </Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: item.type === 'income' ? '#4CAF50' : '#F44336' },
            ]}
          >
            {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <View style={styles.transactionActions}>
            <IconButton
              icon="pencil"
              size={16}
              onPress={() => handleEdit(item)}
            />
            <IconButton
              icon="delete"
              size={16}
              onPress={() => handleDelete(item)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Barra de pesquisa */}
      <Searchbar
        placeholder="Pesquisar transações..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        theme={{
          colors: {
            primary: theme.colors.primary,
          },
        }}
      />

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
        >
          <Chip
            selected={selectedType === 'all'}
            onPress={() => setSelectedType('all')}
            style={styles.chip}
          >
            Todos
          </Chip>
          <Chip
            selected={selectedType === 'income'}
            onPress={() => setSelectedType('income')}
            style={styles.chip}
          >
            Receitas
          </Chip>
          <Chip
            selected={selectedType === 'expense'}
            onPress={() => setSelectedType('expense')}
            style={styles.chip}
          >
            Despesas
          </Chip>
        </ScrollView>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.chip}
            >
              {category === 'all' ? 'Todas Categorias' : category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Lista de transações */}
      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text + '99' }]}>
            Nenhuma transação encontrada
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de edição */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
        >
          {editingTransaction && (
            <View>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Editar Transação
              </Text>
              <TextInput
                label="Título"
                value={editingTransaction.title}
                onChangeText={(text) =>
                  setEditingTransaction({ ...editingTransaction, title: text })
                }
                style={styles.modalInput}
              />
              <TextInput
                label="Descrição"
                value={editingTransaction.description || ''}
                onChangeText={(text) =>
                  setEditingTransaction({ ...editingTransaction, description: text })
                }
                style={styles.modalInput}
              />
              <TextInput
                label="Valor"
                value={editingTransaction.amount.toString()}
                onChangeText={(text) =>
                  setEditingTransaction({ ...editingTransaction, amount: parseFloat(text) || 0 })
                }
                keyboardType="numeric"
                style={styles.modalInput}
              />
              <View style={styles.modalButtons}>
                <Button
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveEdit}
                  style={styles.modalButton}
                >
                  Salvar
                </Button>
              </View>
            </View>
          )}
        </Modal>
      </Portal>

      {/* FAB para adicionar transação */}
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
  searchBar: {
    margin: 16,
    marginBottom: 8,
    elevation: 4,
  },
  filtersContainer: {
    marginVertical: 8,
  },
  chipsScroll: {
    paddingHorizontal: 16,
  },
  chip: {
    marginHorizontal: 4,
  },
  listContainer: {
    paddingBottom: 100,
  },
  transactionCard: {
    marginHorizontal: 16,
    marginVertical: 4,
    elevation: 2,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    margin: 0,
  },
  transactionInfo: {
    marginLeft: 8,
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionCategory: {
    fontSize: 12,
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 12,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionActions: {
    flexDirection: 'row',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TransactionsScreen;