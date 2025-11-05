# FinTrackr 🏦

Um aplicativo moderno e intuitivo de monitoramento financeiro pessoal, construído em React Native com Expo, que ajuda o usuário a controlar receitas, despesas, metas e gráficos de desempenho.

## 🎯 Objetivo

Criar um aplicativo móvel multiplataforma (Android e iOS) que permita ao usuário:

- Registrar entradas e saídas financeiras
- Visualizar o saldo total atualizado
- Analisar gráficos interativos de gastos mensais
- Criar metas financeiras (ex: economizar R$500 por mês)
- Receber alertas quando estiver perto de estourar o orçamento
- Sincronizar dados localmente usando AsyncStorage (sem necessidade de backend)

## 🧱 Tecnologias e Ferramentas

- **Framework:** React Native (com Expo)
- **Linguagem:** JavaScript
- **Bibliotecas principais:**
  - `react-navigation` - Navegação entre telas
  - `react-native-paper` - UI moderna e componentes Material Design
  - `react-native-chart-kit` - Gráficos interativos
  - `expo-notifications` - Alertas e lembretes
  - `@react-native-async-storage/async-storage` - Armazenamento local
  - `expo-linear-gradient` - Gradientes visuais

## 📱 Telas Principais

### 1. Tela de Login / Onboarding
- Breve introdução sobre o app
- Login simples com nome do usuário
- Design moderno com gradientes

### 2. Dashboard (Tela Principal)
- Saldo atual
- Entradas e saídas do mês
- Gráfico de pizza com categorias de gasto
- Ações rápidas para navegação

### 3. Tela de Transações
- Lista completa de movimentações
- Filtros por categoria e tipo
- Edição e exclusão de transações
- Pesquisa avançada

### 4. Tela de Metas Financeiras
- Criar e acompanhar metas de economia
- Barra de progresso visual
- Prazos e acompanhamento de progresso

### 5. Tela de Configurações
- Alterar tema (claro/escuro)
- Exportar dados
- Limpar dados
- Sobre o app

## 🚀 Funcionalidades Extras

- Notificações diárias para lembrar de registrar gastos
- Relatórios automáticos com base nos gastos
- Exportação de dados em JSON
- Tema adaptável (claro/escuro)
- Interface minimalista e intuitiva

## 🎨 Estilo Visual

### Paleta de Cores
- **Primária:** #4CAF50 (verde confiança)
- **Secundária:** #2196F3 (azul leve)
- **Fundo:** #F5F5F5 (modo claro) / #121212 (modo escuro)

### Design
- Layout limpo e responsivo
- Transições suaves
- Tipografia moderna e legível

## 📦 Estrutura do Projeto

```
FinTrackr/
├── App.js
├── package.json
├── src/
│   ├── components/
│   │   └── NotificationManager.js
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── TransactionsScreen.js
│   │   ├── GoalsScreen.js
│   │   ├── SettingsScreen.js
│   │   └── AddTransactionScreen.js
│   ├── context/
│   │   └── FinanceContext.js
│   ├── utils/
│   └── assets/
│       └── icon.png
└── README.md
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (v14 ou superior)
- Expo CLI
- Git

### Passos para instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/fintrackr.git
cd fintrackr
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npx expo start
```

4. **Escaneie o QR Code** com o app Expo Go em seu dispositivo móvel

## 📋 Uso do Aplicativo

### Primeira vez
1. Digite seu nome na tela de onboarding
2. Explore o dashboard com dados de exemplo
3. Adicione sua primeira transação usando o botão "+"
4. Crie metas financeiras na tela correspondente

### Funcionalidades principais
- **Adicionar Transação:** Toque no botão flutuante "+" no dashboard
- **Filtrar Transações:** Use a barra de pesquisa e filtros na tela de transações
- **Editar/Excluir:** Toque nos ícones de lápis ou lixeira
- **Criar Metas:** Use o botão "+" na tela de metas
- **Exportar Dados:** Vá em Configurações > Exportar Dados

## 🔧 Desenvolvimento

### Scripts disponíveis
```bash
npm start          # Iniciar servidor Expo
npm run android    # Executar no Android
npm run ios        # Executar no iOS
npm run web        # Executar na web
```

### Adicionar nova funcionalidade
1. Crie o componente/screen em `src/`
2. Adicione à navegação em `App.js`
3. Atualize o contexto se necessário
4. Teste em diferentes dispositivos

## 📱 Compatibilidade

- **iOS:** 11.0 ou superior
- **Android:** 5.0 (API 21) ou superior
- **Web:** Navegadores modernos

## 🔒 Segurança e Privacidade

- Todos os dados são armazenados localmente
- Nenhuma informação é enviada a servidores externos
- Use a função de exportação para fazer backup

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## 👥 Autores

- **FinTrackr Team** - Desenvolvimento inicial

## 🙏 Agradecimentos

- React Native Community
- Expo Team
- Todos os contribuidores de bibliotecas open source utilizadas

## 📞 Suporte

Para questões e suporte:
- Crie uma issue no GitHub
- Envie um email para suporte@fintrackr.com

---

**FinTrackr** - Controle suas finanças de forma inteligente! 💰✨