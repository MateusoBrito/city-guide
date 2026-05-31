# City Guide

Sistema web para consulta e avaliação de estabelecimentos em diferentes cidades.

## Tecnologias Utilizadas

* Next.js
* React
* TypeScript
* Tailwind CSS
* Prisma ORM
* MySQL

---

# Estrutura do Projeto

```text
city-guide/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── registrar/
│   │   ├── cidades/
│   │   ├── estabelecimentos/
│   │   └── admin/
│   │
│   ├── components/
│   │
│   ├── lib/
│   │   └── prisma.ts
│   │
│   └── types/
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

# Configuração do Ambiente

## 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd city-guide
```

---

## 2. Instalar Dependências

```bash
npm install
```

---

## 3. Criar Banco de Dados

Acesse o MySQL:

```bash
mysql -u root -p
```

Crie o banco:

```sql
CREATE DATABASE city_guide;
```

Verifique se foi criado:

```sql
SHOW DATABASES;
```

---

## 4. Configurar Variáveis de Ambiente

Criar um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mysql://USUARIO:SENHA@HOST:PORTA/city_guide"
```

Exemplo:

```env
DATABASE_URL="mysql://root:minhaSenha@localhost:3306/city_guide"
```

---

## 5. Validar o Schema Prisma

```bash
npx prisma validate
```

---

## 6. Criar as Tabelas do Banco

```bash
npx prisma migrate dev --name init
```

Esse comando irá:

* Criar as tabelas no banco
* Gerar as migrations
* Gerar o Prisma Client

---

# Executando o Projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

---

# Prisma Studio

Para visualizar e editar os dados do banco:

```bash
npx prisma studio
```

---

# Comandos Úteis

## Validar Schema

```bash
npx prisma validate
```

## Gerar Prisma Client

```bash
npx prisma generate
```

## Criar Nova Migration

```bash
npx prisma migrate dev --name nome_da_migration
```

## Abrir Prisma Studio

```bash
npx prisma studio
```

## Resetar Banco de Dados

```bash
npx prisma migrate reset
```

---

# Modelo de Dados

## Cidade

* id
* nome
* estado
* pais

## Estabelecimento

* id
* nome
* categoria
* descricao
* cep
* rua
* bairro
* numero
* complemento
* url
* telefone

## Usuario

* email
* nome

## Avaliacao

* nota
* comentario
* usuario
* estabelecimento

---

# Integrantes

* Mateus Brito
* Ester Maria
* Lucas Campelo

