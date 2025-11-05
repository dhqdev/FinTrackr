import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  ProgressBar,
  useTheme,
  IconButton,
  FAB,
  Portal,
  Modal,
  Button,
  TextInput,
  HelperText,
} from 'react-native-paper';
import { useFinance } from '../context/FinanceContext';

const GoalsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  const openModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        title: goal.title,
        targetAmount: goal.targetAmount.toString(),
        deadline: goal.deadline,
        description: goal.description || '',
      });
    } else {
      setEditingGoal(null);
      setFormData({
        title: '',
        targetAmount: '',
        deadline: '',
        description: '',
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingGoal(null);
    setFormData({
      title: '',
      targetAmount: '',
      deadline: '',
      description: '',
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Valor deve ser maior que zero';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Data limite é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const goalData = {
        title: formData.title.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline,
        description: formData.description.trim(),
      };
      
      if (editingGoal) {
        updateGoal(editingGoal.id, goalData);
      } else {
        addGoal(goalData);
      }
      
      closeModal();
    }
  };

  const handleDelete = (goal) => {
    Alert.alert(
      'Excluir Meta',
      `Tem certeza que deseja excluir "${goal.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteGoal(goal.id),
        },
      ]
    );
  };

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

  const calculateProgress = (current, target) => {
    return Math.min((current / target), 1);
  };

  const getProgressColor = (progress) => {
    if (progress >= 1) return '#4CAF50';
    if (progress >= 0.7) return '#FF9800';
    return '#2196F3';
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderGoal = (goal) => {
    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
    const progressColor = getProgressColor(progress);
    const daysUntil = getDaysUntilDeadline(goal.deadline);
    
    return (
      <Card key={goal.id} style={styles.goalCard}>
        <Card.Content>
          <View style={styles.goalHeader}>
            <View style={styles.goalInfo}>
              <Text style={[styles.goalTitle, { color: theme.colors.text }]}>
                {goal.title}
              </Text>
              <Text style={[styles.goalDescription, { color: theme.colors.text + '99' }]}>
                {goal.description || 'Sem descrição'}
              </Text>
            </View>
            <View style={styles.goalActions}>
              <IconButton
                icon="pencil"
                size={16}
                onPress={() => openModal(goal)}
              />
              <IconButton
                icon="delete"
                size={16}
                onPress={() => handleDelete(goal)}
              />
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressText, { color: theme.colors.text }]}>
                {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
              </Text>
              <Text style={[styles.progressPercentage, { color: progressColor }]}>
                {(progress * 100).toFixed(1)}%
              </Text>
            </View>
            <ProgressBar
              progress={progress}
              color={progressColor}
              style={styles.progressBar}
            />
          </View>

          <View style={styles.goalFooter}>
            <Text style={[styles.deadlineText, { color: theme.colors.text + '99' }]}>
              Prazo: {formatDate(goal.deadline)}
            </Text>
            <Text
              style={[
                styles.daysText,
                { color: daysUntil < 0 ? '#F44336' : daysUntil <= 30 ? '#FF9800' : theme.colors.text + '99' },
              ]}
            >
              {daysUntil < 0 ? 'Vencida' : `${daysUntil} dias restantes`}
            </Text>
          </View>

          {progress >= 1 && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>🎉 Meta Alcançada!</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Metas Financeiras
        </Text>
        
        {goals.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                Nenhuma meta cadastrada
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.text + '99' }]}>
                Crie sua primeira meta financeira para começar a acompanhar seu progresso!
              </Text>
              <Button
                mode="contained"
                onPress={() => openModal()}
                style={styles.emptyButton}
              >
                Criar Meta
              </Button>
            </Card.Content>
          </Card>
        ) : (
          goals.map(renderGoal)
        )}
      </ScrollView>

      {/* Modal de formulário */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {editingGoal ? 'Editar Meta' : 'Nova Meta'}
            </Text>
            
            <TextInput
              label="Título"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              mode="outlined"
              style={styles.modalInput}
              placeholder="Ex: Fundo de emergência"
              error={!!errors.title}
            />
            {errors.title && (
              <HelperText type="error" visible={!!errors.title}>
                {errors.title}
              </HelperText>
            )}

            <TextInput
              label="Valor Alvo"
              value={formData.targetAmount}
              onChangeText={(text) => setFormData({ ...formData, targetAmount: text })}
              mode="outlined"
              style={styles.modalInput}
              placeholder="1000"
              keyboardType="numeric"
              error={!!errors.targetAmount}
            />
            {errors.targetAmount && (
              <HelperText type="error" visible={!!errors.targetAmount}>
                {errors.targetAmount}
              </HelperText>
            )}

            <TextInput
              label="Data Limite"
              value={formData.deadline}
              onChangeText={(text) => setFormData({ ...formData, deadline: text })}
              mode="outlined"
              style={styles.modalInput}
              placeholder="YYYY-MM-DD"
              error={!!errors.deadline}
            />
            {errors.deadline && (
              <HelperText type="error" visible={!!errors.deadline}>
                {errors.deadline}
              </HelperText>
            )}

            <TextInput
              label="Descrição (opcional)"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              mode="outlined"
              style={styles.modalInput}
              placeholder="Descreva sua meta..."
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <Button
                onPress={closeModal}
                style={styles.modalButton}
                mode="outlined"
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.modalButton}
              >
                {editingGoal ? 'Salvar' : 'Criar'}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {/* FAB para adicionar meta */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => openModal()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  goalCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 15,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  goalActions: {
    flexDirection: 'row',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 12,
  },
  daysText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  completedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyCard: {
    elevation: 4,
    borderRadius: 15,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    alignSelf: 'center',
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default GoalsScreen;