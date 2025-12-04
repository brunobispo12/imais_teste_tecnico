# API Medical Appointment

API para agendamento de consultas medicas, desenvolvida como parte de um desafio tecnico.

---

## Tecnologias

- Node.js
- Fastify
- Prisma ORM
- PostgreSQL
- Zod
- Mailtrap (envio de e-mails)
- Swagger / Scalar API Reference

---

## Pre-requisitos

- **Para rodar com Docker (recomendado):**
  - Docker
  - Docker Compose

- **Para rodar tudo local (sem Docker):**
  - Node.js v18+
  - PostgreSQL rodando na sua maquina

---

## 1. Rodando com Docker (API + Banco) - RECOMENDADO

Este e o modo recomendado para testes: sobe **API + Postgres** com um unico comando.

### 1.1. Clonar o repositorio

```bash
git clone <seu-repo.git>
cd <seu-repo>
```

### 1.2. Variaveis de ambiente (modo Docker)

Use o modelo de ambiente pensado para Docker:

```bash
cp .env.example .env
```

No `.env` (modo Docker), as variaveis tipicas serao:

```env
NODE_ENV=development
PORT=20050
API_BASE_URL=http://localhost:20050

# Importante: host do banco e o servico "db" do docker-compose
DATABASE_URL=postgresql://postgres:postgres@db:5432/imais_codes

# Preencha com seus dados do Mailtrap
MAILTRAP_TOKEN=seu_mailtrap_token
MAILTRAP_TEST_INBOX_ID=seu_mailtrap_test_inbox_id
MAILTRAP_ACCOUNT_ID=seu_mailtrap_account_id
```

> Atencao: mantenha os mesmos nomes de variaveis usados no projeto e apenas ajuste os valores.

### 1.3. Build da imagem (API + DB)

```bash
docker compose build --no-cache
```

### 1.4. Subir os servicos

```bash
docker compose up -d
```

Isso vai:

- Subir o container do Postgres
- Aguardar o Postgres ficar saudavel (healthcheck) e aplicar migrations na inicializacao da API (via Prisma)
- Disponibilizar:
  - API em: `http://localhost:20050`
  - Postgres na porta: `5432` (host)

Confirme que ambos estao de pe (status `Up` e `healthy` para o banco):

```bash
docker compose ps
docker compose logs -f api   # acompanhar a inicializacao da API
```

### 1.5. Rodar o seed (Docker)

Para popular o banco com dados iniciais (medicos, agendas e pacientes), rode:

```bash
docker compose exec api npm run seed
```

Esse comando executa o script configurado em `package.json`:

```json
"seed": "prisma db seed"
```

Reiniciar do zero (opcional, caso precise limpar o volume do banco):

```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
docker compose exec api npm run seed
```

### 1.6. URLs uteis (Docker)

- API base: `http://localhost:20050`
- Referencia / documentacao (Swagger + Scalar):
  - `http://localhost:20050/reference`

### 1.7. Logs e parada

- Logs da API:

  ```bash
  docker compose logs -f api
  ```

- Parar tudo:

  ```bash
  docker compose down
  ```

- Parar tudo e remover o volume do banco:

  ```bash
  docker compose down -v
  ```

---

## 2. Rodando tudo local (sem Docker)

Neste modo, API e banco rodam diretamente no host.

### 2.1. Clonar o repositorio

Se ainda nao tiver clonado:

```bash
git clone <seu-repo.git>
cd <seu-repo>
```

### 2.2. Instalar dependencias

```bash
npm install
```

### 2.3. Configurar o `.env` para ambiente local

Crie um arquivo `.env` na raiz com algo como:

```env
NODE_ENV=development
PORT=20050
API_BASE_URL=http://localhost:20050

# Aqui o host do banco e localhost,
# assumindo que o Postgres esta rodando na sua maquina
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/imais_codes

MAILTRAP_TOKEN=seu_mailtrap_token
MAILTRAP_TEST_INBOX_ID=seu_mailtrap_test_inbox_id
MAILTRAP_ACCOUNT_ID=seu_mailtrap_account_id
```

> Ajuste usuario, senha e nome do banco (`imais_codes`) conforme sua instalacao local do Postgres.

### 2.4. Banco de Dados local

1. Suba ou configure o Postgres localmente, garantindo que:
   - Usuario: `postgres`
   - Senha: `postgres`
   - Banco: `imais_codes` (ou outro, mantendo o `DATABASE_URL` coerente)

2. Rode as migrations do Prisma:

   ```bash
   npx prisma migrate dev
   ```

3. (Opcional, mas recomendado) Popule o banco com seed:

   ```bash
   npm run seed
   ```

---

## 3. Executando o Projeto

### 3.1. Ambiente local (sem Docker)

- Desenvolvimento (hot reload):

  ```bash
  npm run dev
  ```

- API disponivel em:

  ```text
  http://localhost:20050
  ```

- Documentacao / referencia (Swagger + Scalar):

  ```text
  http://localhost:20050/reference
  ```

### 3.2. Ambiente com Docker

Se voce subiu com:

```bash
docker compose build --no-cache
docker compose up -d
```

Entao:

- API: `http://localhost:20050`
- Documentacao: `http://localhost:20050/reference`
- Seed: `docker compose exec api npm run seed`

---

## 4. Testes

### 4.1. Sem Docker (Local)

Para rodar os testes unitarios/integracao localmente (usando Vitest):

```bash
npm test
```

### 4.2. Com Docker

Para rodar os testes dentro do container da API (garantindo o mesmo ambiente):

```bash
docker compose exec api npm test
```
