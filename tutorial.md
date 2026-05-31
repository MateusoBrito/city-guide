# Configuração do Projeto

## Pré-requisitos

Antes de iniciar, instale:

* Node.js (versão 20 ou superior)
* MySQL Server
* Git

---

## 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd city-guide
```

---

## 2. Instalar dependências

```bash
npm install
```

---

## 3. Criar o banco de dados

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

Saia do MySQL:

```sql
EXIT;
```

---

## 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
DATABASE_URL="mysql://USUARIO:SENHA@HOST:PORTA/city_guide"
```

Exemplo local:

```env
DATABASE_URL="mysql://root:minhaSenha@localhost:3306/city_guide"
```

---

## 5. Validar o schema Prisma

```bash
npx prisma validate
```

Se tudo estiver correto, deve aparecer:

```text
The schema at prisma/schema.prisma is valid
```

---

## 6. Criar as tabelas do banco

```bash
npx prisma migrate dev --name init
```

Esse comando irá:

* Criar as tabelas no MySQL
* Criar as migrations do Prisma
* Gerar o Prisma Client

---

## 7. Abrir o Prisma Studio (opcional)

```bash
npx prisma studio
```

O Prisma Studio permite visualizar e editar os dados do banco através de uma interface web.

---

## 8. Executar o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

---

## Comandos Úteis

### Gerar novamente o Prisma Client

```bash
npx prisma generate
```

### Criar uma nova migration após alterar o schema

```bash
npx prisma migrate dev --name nome_da_migration
```

### Visualizar dados do banco

```bash
npx prisma studio
```

### Verificar schema Prisma

```bash
npx prisma validate
```
