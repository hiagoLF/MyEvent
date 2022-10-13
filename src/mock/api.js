/* eslint-disable no-undef */
import {createServer, Factory, Model, Response} from 'miragejs';
import {generateRandomString} from './randomString';
import {faker} from '@faker-js/faker';

// interface User {
//   id: string;
//   login: string;
//   name: string;
//   password: string;
// }

// interface Models {
//   users: User;
// }

// interface Token {
//   userId: string;
//   token: string;
// }

// interface Event {
//   id: string;
//   name: string;
//   description: string;
//   valor: number;
//   imageUrl: string;
// }

// interface Reservation {
//   id: string;
//   userId: string;
//   eventId: string;
// }

// interface Purchase {
// phone: string;
// cep: string;
// name: string;
// adress: string;
// city: string;
// state: string;
// }

export function startServer() {
  if (window.server) {
    server.shutdown();
  }

  window.server = createServer({
    models: {
      user: Model.extend({}),
      token: Model.extend({}),
      event: Model.extend({}),
      reservation: Model.extend({}),
      purchase: Model.extend({}),
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
        id: 1,
        login: 'hiago',
        name: 'Hiago Leão Ferreira',
        password: '123456',
      });
      server.create('user', {
        id: 2,
        login: 'logado',
        name: 'Loago Ferreira',
        password: '123456',
      });
      server.create('token', {
        userId: 2,
        token: 'ljlglksjgdgdfgd9989323',
      });
      server.createList('event', 20);
      server.create('reservation', {
        id: 1,
        userId: 2,
        eventId: 1,
      });
    },
    routes() {
      this.namespace = '/api';
      this.timing = 400;

      this.post('/users', (schema, req) => {
        const data = JSON.parse(req.requestBody);

        const found = schema.users.findBy({login: data.login});

        if (found) {
          return new Response(400, {}, {message: 'Login já existe'});
        }

        schema.create('user', data);

        return {message: 'OK'};
      });

      this.post('/login', (schema, req) => {
        const data = JSON.parse(req.requestBody);

        const found = schema.users.findBy({login: data.login});

        console.log('Usuário logando >>> ', found);

        if (!found) {
          return new Response(400, {}, {message: 'Usuário não encontrado'});
        }

        if (found.password !== data.password) {
          return new Response(400, {}, {message: 'Senha incorreta'});
        }

        const tokenGenerated =
          found.id === '2'
            ? 'ljlglksjgdgdfgd9989323'
            : generateRandomString(50);

        const tokenCreated = schema.create('token', {
          userId: found.id,
          token: tokenGenerated,
        });

        return {token: tokenCreated.token, user: {name: found.name}};
      });

      this.get('/events', (schema, req) => {
        const token = req.requestHeaders['Authorization'];
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const page = req.queryParams?.page;

        const found = schema.events.all().slice((page - 1) * 5, page * 5);

        return {data: found.models};
      });

      this.get('/valid_token', (schema, req) => {
        const token = req.requestHeaders['Authorization'];
        const stractedToken = token.split(' ')[1];

        const tokenFound = schema.tokens.findBy({token: stractedToken});

        if (tokenFound) {
          return {message: 'OK'};
        }

        return new Response(404, {}, {message: 'Token inválido'});
      });

      this.get('/event', (schema, req) => {
        const token = req.requestHeaders['Authorization'];
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const id = req.queryParams?.id;

        const event = schema.events.findBy({id});

        return {event};
      });

      this.post('/event/reservation', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const eventId = req.requestBody?.id;

        const reservationFound = schema.reservations.findBy({
          eventId,
          userId: tokenFound.userId,
        });

        if (reservationFound) {
          console.log('Reserva já existe');
          return {id: reservationFound.id};
        }

        const createdReservation = schema.reservations.create({
          userId: tokenFound.userId,
          eventId,
        });

        return {id: createdReservation.id};
      });

      this.post('/event/reservation/finalize', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const body = JSON.parse(req.requestBody);

        const reservationFound = schema.reservations.find(body.reservationId);

        const {phone, cep, name, adress, city, state} = body.purchaseValues;

        const created = schema.purchases.create({
          phone,
          cep,
          name,
          adress,
          city,
          state,
        });

        console.log('Criado >>> ', created);

        reservationFound.destroy();

        return {message: 'OK'};
      });
    },
  });
}
