import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  SegmentedButtons,
  RadioButton,
  HelperText,
} from 'react-native-paper';
import { useFinance } from '../context/FinanceContext';

const AddTransactionScreen = ({ navigation }) => {
  const theme = useTheme();
  const { addTransaction } = useFinance();
  
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  // Categorias por tipo
  const expenseCategories = [
    'Alimentação',
    'Transporte',
    'Entretenimento',
    'Saúde',
    'Educação',
    'Moradia',
    'Compras',
    'Outros',
  ];

  const incomeCategories = [
    'Salário',
    'Trabalho',
    'Investimento',
    'Venda',
    'Outros',
  ];

  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }
    
    if (!category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const transaction = {
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        category,
        description: description.trim(),
      };
      
      addTransaction(transaction);
      navigation.goBack();
    }
  };

  const formatCurrency = (value) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Formata como moeda brasileira
    if (numericValue) {
      const number = parseFloat(numericValue) / 100;
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(number);
    }
    
    return '';
  };

  const handleAmountChange = (text) => {
    // Remove formatação e mantém apenas números
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Nova Transação
            </Text>
            
            {/* Tipo de transação */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Tipo de Transação
            </Text>
            <SegmentedButtons
              value={type}
              onValueChange={setType}
              buttons={[
                {
                  value: 'expense',
                  label: 'Despesa',
                  icon: 'arrow-down',
                },
                {
                  value: 'income',
                  label: 'Receita',
                  icon: 'arrow-up',
                },
              ]}
              style={styles.segmentedButtons}
            />

            {/* Título */}
            <TextInput
              label="Título"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              placeholder="Ex: Compra no supermercado"
              left={<TextInput.Icon icon="format-title" />}
              error={!!errors.title}
            />
            {errors.title && (
              <HelperText type="error" visible={!!errors.title}>
                {errors.title}
              </HelperText>
            )}

            {/* Valor */}
            <TextInput
              label="Valor"
              value={formatCurrency(amount)}
              onChangeText={handleAmountChange}
              mode="outlined"
              style={styles.input}
              placeholder="R$ 0,00"
              keyboardType="numeric"
              left={<TextInput.Icon icon="currency-brl" />}
              error={!!errors.amount}
            />
            {errors.amount && (
              <HelperText type="error" visible={!!errors.amount}>
                {errors.amount}
              </HelperText>
            )}

            {/* Categoria */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Categoria
            </Text>
            <View style={styles.categoriesContainer}>
              {currentCategories.map((cat) => (
                <View key={cat} style={styles.categoryOption}>
                  <RadioButton
                    value={cat}
                    status={category === cat ? 'checked' : 'unchecked'}
                    onPress={() => setCategory(cat)}
                  />
                  <Text style={[styles.categoryText, { color: theme.colors.text }]}>
                    {cat}
                  </Text>
                </View>
              ))}
            </View>
            {errors.category && (
              <HelperText type="error" visible={!!errors.category}>
                {errors.category}
              </HelperText>
            )}

            {/* Descrição */}
            <TextInput
              label="Descrição (opcional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              placeholder="Adicione mais detalhes..."
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="text" />}
            />

            {/* Botões de ação */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.button}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                disabled={!title || !amount || !category}
              >
                Adicionar
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    elevation: 4,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  segmentedButtons: {
    marginBottom: 15,
  },
  input: {
    marginBottom: 10,
  },
  categoriesContainer: {
    marginVertical: 10,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default AddTransactionScreen;