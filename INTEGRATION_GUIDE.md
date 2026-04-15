# Integração Frontend + Backend - Guia Rápido

## Status de Integração

✅ Backend criado com Node.js/Express + SQLite
✅ Serviço API centralizado no frontend
✅ Componentes atualizados para usar API

## Próximos passos

### 1. Configurar variáveis de ambiente

**Backend:**
```bash
cd backend
cp .env.example .env
# Verifique se PORT=12345 e demais variáveis estão corretas
```

**Frontend:**
```bash
# No diretório raiz do projeto
cp .env.example .env
# Verifique se VITE_API_URL=http://localhost:12345/api
```

### 2. Instalar dependências e iniciar backend

```bash
cd backend
npm install
npm run dev
```

Você deve ver:
```
Backend iniciado em http://localhost:12345
```

### 3. Em outro terminal, iniciar frontend

```bash
cd .. # voltar para tibia-build-creator
npm install
npm run dev
```

Você deve ver:
```
VITE v5.0.8 running at: http://localhost:5173/
```

### 4. Testar fluxos

1. **Registro**: Clique na aba "Registrar" e crie uma nova conta
2. **Login**: Faça login com as credenciais criadas
3. **Criar Build**: Crie uma build e veja ela ser salva no banco de dados
4. **Perfil**: Veja suas builds carregadas do servidor
5. **Logout**: Faça logout e veja o token ser removido

## Estrutura dos dados

### Tabelas SQLite criadas

- **users**: Dados de login, perfil e conta
- **builds**: Builds criadas pelo usuário
- **uploads**: Arquivos enviados pelo usuário

### Campos importantes

- Token JWT armazenado em `localStorage['auth-token']`
- Builds salvas em `/api/user/builds` no backend
- Imagens podem ser enviadas via `/api/uploads`

## Troubleshooting

### "CORS error"
- Verifique se o backend está rodando em http://localhost:12345
- Verifique se `FRONTEND_URL` em `backend/.env` está correto

### "Token not provided"
- Registre/login novamente
- Verifique se o token está sendo salvo em `localStorage['auth-token']`

### Banco de dados não criado
- O backend cria automaticamente em `backend/data/database.db`
- Se houver erro, delete a pasta `data` e reinicie o backend

## Próximas melhorias

- [ ] Refresh token automático
- [ ] Reset de senha
- [ ] Upload de avatar do usuário
- [ ] Compartilhamento de builds
- [ ] Comentários em builds públicas
- [ ] Sistema de dificuldade
- [ ] Busca avançada de builds
