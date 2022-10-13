import {createServer, Factory, Model, Response} from 'miragejs';
import {generateRandomString} from './randomString';
import {faker} from '@faker-js/faker';

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

interface Event {
  id: string;
  name: string;
  description: string;
  valor: number;
  imageUrl: string;
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
      event: Model.extend<Partial<Event>>({}),
    },
    factories: {
      event: Factory.extend({
        name() {
          return faker.lorem.words(3);
        },
        description() {
          return faker.lorem.paragraph(3);
        },
        valor() {
          return faker.random.numeric(2);
        },
        imageUrl() {
          return faker.image.image();
        },
      }),
    },
    seeds(server) {
      server.create('user', {
        // @ts-ignore
        login: 'hiago',
        name: 'Hiago Leão Ferreira',
        password: '123456',
      });
      server.createList('event', 20);
    },
    routes() {
      this.namespace = '/api';
      this.timing = 400;

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

      this.get('/events', (schema, req) => {
        // const token = req.requestHeaders['Authorization'];
        // const stractedToken = token.split(' ')[1];
        // // @ts-ignore
        // const tokenFound = schema.tokens.findBy({token: stractedToken});
        // if (!tokenFound) {
        //   return new Response(403, {}, {message: 'Token Inválido'});
        // }

        const page = req.queryParams?.page as number;

        // @ts-ignore
        const found = schema.events.all().slice((page - 1) * 5, page * 5);

        return {data: found.models};
      });

      this.get('/valid_token', (schema, req) => {
        const token = req.requestHeaders['Authorization'];
        const stractedToken = token.split(' ')[1];
        // @ts-ignore
        const tokenFound = schema.tokens.findBy({token: stractedToken});

        if (tokenFound) {
          return {message: 'OK'};
        }

        return new Response(404, {}, {message: 'Token inválido'});
      });

      this.get('/event', (schema, req) => {
        // const token = req.requestHeaders['Authorization'];
        // const stractedToken = token.split(' ')[1];
        // // @ts-ignore
        // const tokenFound = schema.tokens.findBy({token: stractedToken});
        // if (!tokenFound) {
        //   return new Response(403, {}, {message: 'Token Inválido'});
        // }

        const id = req.queryParams?.id;

        // @ts-ignore
        const event = schema.events.findBy({id});

        console.log('Event >>> ', event);

        return {event};
      });
    },
  });
}
