# Tibia Build Forge

Aplicativo web especializado em builds autênticas para o MMORPG Tibia, com equipamentos originais e estratégias reais de gameplay.

## Funcionalidades

### Tela Inicial
- Painel principal com visual de MMORPG clássico
- Builds em destaque e populares
- Estatísticas gerais do aplicativo
- Classes mais utilizadas
- Últimas builds adicionadas
- Sistema de busca integrado

### Criar Build
- Formulário completo para criação de builds
- Seleção de classe e estilo de jogo
- Distribuição de atributos com sliders interativos
- Seleção de habilidades por categoria
- Configuração de equipamentos principais
- Área para estratégia e observações

### Classes e Habilidades
- 7 classes únicas e originais:
  - 🛡️ Guerreiro (Tanque defensivo)
  - 🔮 Mago Elemental (DPS mágico)
  - 🏹 Arqueiro da Floresta (DPS físico à distância)
  - ✨ Clérigo Sagrado (Suporte e cura)
  - ⚔️ Cavaleiro Imperial (Híbrido versátil)
  - 🗡️ Assassino Sombrio (Burst e mobilidade)
  - 👻 Invocador Arcano (Controle e invocações)

### Equipamentos
- Sistema de raridade (Comum, Raro, Épico, Lendário)
- Múltiplas categorias de equipamentos
- Filtros avançados por tipo, raridade, classe e nível
- Visualização detalhada de atributos e bônus
- Sistema de compatibilidade com classes

### Detalhes da Build
- Visualização completa da build
- Estatísticas visuais com barras de progresso
- Análise de vantagens e desvantagens
- Recomendações de uso (Solo, Grupo, PvP, Chefes)
- Estratégias de combate detalhadas
- Sistema de dificuldade

## Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Bundler**: Vite
- **Fonts**: Google Fonts (Cinzel + Crimson Text)
- **Icons**: Emojis nativos para compatibilidade universal
- **Responsive**: Design adaptativo para desktop e mobile


### Componentes
- Cards com bordas douradas e sombras
- Botões com efeitos de hover e gradientes
- Barras de progresso animadas
- Tags de raridade coloridas
- Formulários estilizados com tema medieval

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório (se aplicável)
# cd medieval-build-forge

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Para build de produção
npm run build

# Para preview da build
npm run preview
```

### Desenvolvimento
O projeto será executado em `http://localhost:3000` com hot reload automático.

## Responsividade

O aplicativo é totalmente responsivo com breakpoints:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px  
- **Mobile**: até 767px

### Adaptações Mobile
- Menu de navegação simplificado
- Cards em coluna única
- Sliders de atributos adaptados
- Filtros em modo lista
- Botões de ação em pilha

## Estrutura do Projeto

```
medieval-build-forge/
├── index.html              # Página principal com todas as telas
├── package.json            # Dependências e scripts
├── vite.config.js          # Configuração do Vite
├── style.css               # Estilos principais
├── src/
│   └── main.js             # JavaScript principal
└── README.md              # Documentação
```

## Funcionalidades Implementadas

### Navegação
- [x] Sistema de Single Page Application (SPA)
- [x] Navegação entre telas com transições
- [x] Estado ativo dos botões de navegação
- [x] Busca integrada no header

### Interatividade
- [x] Sliders de atributos com feedback visual
- [x] Sistema de pontos com limite de 300
- [x] Filtros de equipamentos funcionais
- [x] Seleção de habilidades por classe
- [x] Notificações temporárias
- [x] Hover effects e animações

### Dados Mock
- [x] 7 classes com atributos detalhados
- [x] Sistema de equipamentos com raridades
- [x] Builds de exemplo para demonstração
- [x] Estatísticas e métricas ficcionais

## 🔮 Futuras Implementações

### Backend Integration
- [ ] API REST para persistência de dados
- [ ] Sistema de usuários e autenticação
- [ ] Banco de dados para builds e equipamentos
- [ ] Sistema de compartilhamento real

### Funcionalidades Avançadas
- [ ] Calculadora de dano avançada
- [ ] Sistema de favoritos
- [ ] Comparação de builds
- [ ] Exportação para PDF
- [ ] Sistema de rating e comentários
- [ ] Builds da comunidade

### Melhorias de UX
- [ ] Drag & drop para equipamentos
- [ ] Preview 3D de personagens
- [ ] Modo escuro/claro
- [ ] Tutoriais interativos
- [ ] Shortcuts de teclado

## Características Únicas

### Identidade Visual Original
- Design inspirado em MMORPGs sem copiar elementos protegidos
- Paleta de cores única com tema medieval
- Tipografia cuidadosamente escolhida
- Iconografia consistente com emojis

### 🚫 Sem Violação de Direitos
- Nenhuma referência a jogos específicos
- Classes e habilidades com nomes originais
- Arte e interface totalmente original
- Conceitos genéricos de fantasia medieval

### 🎮 Experiência de Jogo
- Sensação nostálgica de MMORPGs clássicos
- Interface intuitiva e familiar
- Progressão visual clara
- Feedback imediato das ações

## Licença

Este projeto é um exemplo educacional e pode ser usado como base para projetos similares, respeitando as boas práticas de desenvolvimento web e design original.

## Contribuições

Para melhorar o projeto:
1. Adicione mais classes e equipamentos
2. Implemente novas funcionalidades
3. Melhore a responsividade
4. Otimize a performance
5. Adicione testes automatizados
