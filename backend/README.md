# Projeto Scrum

## Inicializando o projeto

Instale as dependências do projeto e rode o comando de migração do knex para gerar seu banco de dados inicial.
Aproveite para fazer uma cópia do arquivo de variáveis de ambiente `.env` também.

```console
$ npm install
$ npm run knex:migrate
$ cp .env.example .env
```

Atualize os dados do arquivo de variáveis de ambiente `.env`, preenchendo e alterando os campos que vocẽ achar necessário.
O resultado deve ser parecido com o exemplo abaixo:

```
PORT=3000
ADMIN_PASSWORD=1234
```

Após fazer estas configurações iniciais, execute o comando de preenchimento estático do knex.
Caso esteja em desenvolvimento, execute o script para adicionar dados falsos ao banco e poder fazer os testes localmente.
Com o arquivo .env configurado você já pode executar os testes existentes da aplicação.

```console
$ npm run knex:seed

$ # Comando opcional para adicionar dados falsos
$ node script/addFakeData.js

$ # Comando para executar os testes
$ npm test
```

Após realizar estes passos o projeto já está pronto para ser executado.
Inicie o servidor utilizando em modo de desenvolvimento utilizando o seguinte comando:

```console
$ npm run dev
```

Após tudo isso, você já será capaz de acessar pelo seu navegador uma aplicação rodando no endereço http://localhost:3000 (Porta 3000 é o valor padrão existente no .env. Fique atento caso você tenha alterado ele).

## Referencias

- [Configurando TS](https://khalilstemmler.com/blogs/typescript/node-starter-project/)
