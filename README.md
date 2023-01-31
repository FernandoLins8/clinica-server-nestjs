<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# CLINICA-SERVER-NESTJS

Criado com o propósito de estudar o framework [NestJS](https://github.com/nestjs/nest) e praticar alguns conceitos de backend.

O projeto consiste em uma api rest ([frontend](https://github.com/FernandoLins8/clinica-web-react)) que simula um fluxo de atendimento em uma clínica:

- Como cliente é possível:

  - Criar conta;
  - Fazer login;
  - Verificar profissionais e serviços;
  - Solicitar um atendimento escolhendo o profissional e os serviços;
  - Checar histórico de atendimentos;
  - Consultar informações sobre um atendimento (valores, duração, etc).

- Como administrador (atendente) é possível:
  - Fazer login;
  - Adicionar/excluir profissionais e serviços;
  - Iniciar, finalizar ou excluir um atendimento criado por um cliente;

## Conceitos/Tecnologias

### Tecnologias Usadas:

- JavaScript/Typescript/NodeJS;
- NestJS;
- PrismaORM;
- Postgres;
- Jest;
- Swagger;
- Git (git flow e commitizen);
- Docker.

### Alguns conceitos estudados:

- APIs RESTful
  - HTTP;
  - Controllers, Services e Injeção de dependências;
  - Middleware, Guards, Pipes;
  - Autenticação com JWT;
- Banco de Dados
  - ORMs, Migrations, Seeds;
- Testes unitários;
- Documentação de APIs;
- Upload de arquivo (multer);
- Git flow e documentação de commits.

## Executando

```bash
# Instalar dependências
$ npm i

# Criar arquivo .env a partir do .env.example
# Feito isso, rodar o comando abaixo para rodar migrations e seed do usuário admin
$ npm run start:database

# Executar em modo watch
$ npm run start:dev

```
