# Backend Tibia Build Creator

Este backend fornece um servidor Node.js/Express para autenticação, CRUD de builds, perfil do usuário e upload de imagens.

## Como usar

1. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```

2. Copie o arquivo de ambiente:
   ```bash
   cp .env.example .env
   ```

3. Ajuste as variáveis em `.env` se necessário.

4. Inicie o servidor:
   ```bash
   npm run dev
   ```

O backend irá iniciar em `http://localhost:12345`.

## Rotas principais

### Autenticação
- `POST /api/auth/register`
- `POST /api/auth/login`

### Perfil do usuário
- `GET /api/user/profile`
- `PUT /api/user/profile`

### Builds do usuário
- `GET /api/user/builds`
- `POST /api/user/builds`
- `PUT /api/user/builds/:id`
- `DELETE /api/user/builds/:id`

### Builds públicas
- `GET /api/builds`
- `GET /api/builds/:id`

### Uploads de imagem
- `POST /api/uploads`

## Observações

- O banco de dados SQLite será inicializado automaticamente em `backend/data/database.db`.
- Os uploads são salvos em `backend/uploads` e servidos em `/uploads`.
- O frontend precisa ser ajustado para consumir estas rotas em vez de usar `localStorage`.
