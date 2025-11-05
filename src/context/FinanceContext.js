import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criar contexto
const FinanceContext = createContext();

// Hook personalizado para usar o contexto
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance deve ser usado dentro de FinanceProvider');
  }
  return context;
};

// Provider do contexto
export const FinanceProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    loadData();
  }, []);

  // Salvar dados sempre que houver mudanças
  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [transactions, goals, user]);

  // Carregar dados do AsyncStorage
  const loadData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('@fintrackr_user');
      const savedTransactions = await AsyncStorage.getItem('@fintrackr_transactions');
      const savedGoals = await AsyncStorage.getItem('@fintrackr_goals');

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      if (savedGoals) setGoals(JSON.parse(savedGoals));

      // Adicionar dados de exemplo se for primeira vez
      if (!savedTransactions) {
        setTransactions(getSampleTransactions());
      }
      if (!savedGoals) {
        setGoals(getSampleGoals());
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar dados no AsyncStorage
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('@fintrackr_user', JSON.stringify(user));
      await AsyncStorage.setItem('@fintrackr_transactions', JSON.stringify(transactions));
      await AsyncStorage.setItem('@fintrackr_goals', JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  // Funções para manipular transações
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions(prev => 
      prev.map(item => item.id === id ? { ...item, ...updatedTransaction } : item)
    );
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(item => item.id !== id));
  };

  // Funções para manipular metas
  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now().toString(),
      ...goal,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id, updatedGoal) => {
    setGoals(prev => 
      prev.map(item => item.id === id ? { ...item, ...updatedGoal } : item)
    );
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(item => item.id !== id));
  };

  // Funções auxiliares
  const getBalance = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  };

  const getMonthlyIncome = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear &&
               transaction.type === 'income';
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear &&
               transaction.type === 'expense';
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getExpensesByCategory = () => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      categoryTotals[expense.category] = 
        (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / getMonthlyExpenses()) * 100,
    }));
  };

  // Dados de exemplo
  const getSampleTransactions = () => [
    {
      id: '1',
      title: 'Salário',
      amount: 3500,
      type: 'income',
      category: 'Salário',
      date: new Date().toISOString(),
      description: 'Salário mensal',
    },
    {
      id: '2',
      title: 'Supermercado',
      amount: 250,
      type: 'expense',
      category: 'Alimentação',
      date: new Date(Date.now() - 86400000).toISOString(),
      description: 'Compras do mês',
    },
    {
      id: '3',
      title: 'Transporte',
      amount: 150,
      type: 'expense',
      category: 'Transporte',
      date: new Date(Date.now() - 172800000).toISOString(),
      description: 'Passagens e combustível',
    },
    {
      id: '4',
      title: 'Netflix',
      amount: 45.90,
      type: 'expense',
      category: 'Entretenimento',
      date: new Date(Date.now() - 259200000).toISOString(),
      description: 'Assinatura mensal',
    },
    {
      id: '5',
      title: 'Freelance',
      amount: 800,
      type: 'income',
      category: 'Trabalho',
      date: new Date(Date.now() - 345600000).toISOString(),
      description: 'Projeto extra',
    },
  ];

  const getSampleGoals = () => [
    {
      id: '1',
      title: 'Emergência',
      targetAmount: 5000,
      currentAmount: 1250,
      deadline: '2025-12-31',
      description: 'Fundos para emergências',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Viagem',
      targetAmount: 3000,
      currentAmount: 800,
      deadline: '2025-07-01',
      description: 'Viagem para a Europa',
      createdAt: new Date().toISOString(),
    },
  ];

  const value = {
    user,
    transactions,
    goals,
    isLoading,
    setUser,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    getBalance,
    getMonthlyIncome,
    getMonthlyExpenses,
    getExpensesByCategory,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};