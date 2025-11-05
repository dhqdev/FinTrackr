import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinance } from '../context/FinanceContext';

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const { setUser } = useFinance();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!name.trim()) {
      return;
    }

    setIsLoading(true);
    
    // Simular pequeno delay para melhor UX
    setTimeout(() => {
      setUser({ name: name.trim() });
      navigation.replace('Dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: '#fff' }]}>
              FinTrackr
            </Text>
            <Text style={[styles.subtitle, { color: '#fff' }]}>
              Controle suas finanças de forma inteligente
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
                Bem-vindo ao FinTrackr!
              </Text>
              
              <Text style={[styles.description, { color: theme.colors.text + '99' }]}>
                O aplicativo que vai te ajudar a alcançar suas metas financeiras. 
                Comece registrando seu nome para uma experiência personalizada.
              </Text>

              <TextInput
                label="Seu nome"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                placeholder="Como gostaria de ser chamado?"
                left={<TextInput.Icon icon="account" />}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    background: theme.colors.surface,
                  },
                }}
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                disabled={!name.trim() || isLoading}
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.buttonContent}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  'Começar'
                )}
              </Button>

              <Text style={[styles.featuresTitle, { color: theme.colors.text }]}>
                O que você pode fazer:
              </Text>
              
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <Text style={[styles.featureText, { color: theme.colors.text + '99' }]}>
                    • Registrar receitas e despesas
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={[styles.featureText, { color: theme.colors.text + '99' }]}>
                    • Acompanhar metas financeiras
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={[styles.featureText, { color: theme.colors.text + '99' }]}>
                    • Visualizar gráficos e relatórios
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={[styles.featureText, { color: theme.colors.text + '99' }]}>
                    • Receber alertas de orçamento
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    marginHorizontal: 10,
    elevation: 8,
    borderRadius: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  button: {
    marginVertical: 10,
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureItem: {
    marginVertical: 2,
  },
  featureText: {
    fontSize: 14,
  },
});

export default LoginScreen;