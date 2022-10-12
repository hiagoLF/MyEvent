import {createServer, Model, Response} from 'miragejs';
import {generateRandomString} from './randomString';

interface User {
  id: string;
  login: string;
  name: string;
  password: string;
}

interface Models {
  users: User;
}

interface Token {
  userId: string;
  token: string;
}

export function startServer() {
  // @ts-ignore
  if (window.server) {
    // @ts-ignore
    server.shutdown();
  }

  // @ts-ignore
  window.server = createServer<Models>({
    models: {
      user: Model.extend<Partial<User>>({}),
      token: Model.extend<Partial<Token>>({}),
    },
    seeds(server) {
      server.create('user', {
        // @ts-ignore
        login: 'hiago',
        name: 'Hiago Leão Ferreira',
        password: '123456',
      });
    },
    routes() {
      this.namespace = '/api';
      this.timing = 1000;

      this.post('/users', (schema, req) => {
        const data = JSON.parse(req.requestBody);

        // @ts-ignore
        const found = schema.users.findBy({login: data.login});

        if (found) {
          return new Response(400, {}, {message: 'Login já existe'});
        }

        schema.create('user', data);

        return {message: 'OK'};
      });

      this.post('/login', (schema, req) => {
        const data = JSON.parse(req.requestBody);

        // @ts-ignore
        const found = schema.users.findBy({login: data.login});

        if (!found) {
          return new Response(400, {}, {message: 'Usuário não encontrado'});
        }

        if (found.password !== data.password) {
          return new Response(400, {}, {message: 'Senha incorreta'});
        }

        const tokenCreated = schema.create('token', {
          // @ts-ignore
          userId: found.id,
          token: generateRandomString(50),
        });

        // @ts-ignore
        return {token: tokenCreated.token, user: {name: found.name}};
      });
    },
  });
}
