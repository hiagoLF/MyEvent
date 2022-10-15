/* eslint-disable no-undef */
import {
  belongsTo,
  createServer,
  Factory,
  hasMany,
  Model,
  Response,
  RestSerializer,
} from 'miragejs';
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
      event: Model.extend({
        purchase: hasMany(),
        user: belongsTo(),
      }),
      reservation: Model.extend({
        event: belongsTo(),
        user: belongsTo(),
      }),
      purchase: Model.extend({
        event: belongsTo(),
        user: belongsTo(),
      }),
    },
    factories: {
      event: Factory.extend({
        userId: 2,
        name() {
          return faker.lorem.words(3);
        },
        description() {
          return faker.lorem.paragraph(3);
        },
        valor() {
          return faker.random.numeric(4);
        },
        imageUrl() {
          return faker.image.image();
        },
        sell() {
          return Math.round(Math.random() * (50 - 1) + 1);
        },
        rest() {
          return Math.round(Math.random() * (15 - 0) + 0);
        },
        closed() {
          return faker.datatype.boolean();
        },
        ticketsNumber() {
          return Math.round(Math.random() * (100 - 50) + 50);
        },
      }),
      user: Factory.extend({
        login() {
          return faker.word(6);
        },
        name() {
          return faker.name.fullName();
        },
        password() {
          return faker.word(6);
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
      const hiagoLogado = server.create('user', {
        id: 2,
        login: 'logado',
        name: 'Loago Ferreira',
        password: '123456',
        sales: 65423,
        available: 10000,
      });
      server.create('token', {
        userId: 2,
        token: 'ljlglksjgdgdfgd9989323',
      });
      const events = server.createList('event', 20);
      server.create('reservation', {
        id: 1,
        userId: 2,
        eventId: 1,
      });
      server.create('purchase', {
        event: events[0],
        user: hiagoLogado,
        phone: '(77) 98876-3434',
        cep: '34234-333',
        name: 'Hiago Logado no App',
        adress: 'Rua do Galo',
        city: 'Smallvile',
        state: 'Piauí',
        qr: generateRandomString(20),
      });
      server.create('event', {
        user: hiagoLogado,
        sell: 0,
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
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const page = req.queryParams?.page;

        const found = schema.events
          .all()
          .sort((a, b) => {
            return Number(b.id) > Number(a.id) ? 1 : 0;
          })
          .slice((page - 1) * 5, page * 5);

        console.log(found.models.forEach(item => console.log(item.id)));

        return {data: found.models};
      });

      this.get('/valid_token', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];

        const tokenFound = schema.tokens.findBy({token: stractedToken});

        if (tokenFound) {
          return {message: 'OK'};
        }

        return new Response(404, {}, {message: 'Token inválido'});
      });

      this.get('/event', (schema, req) => {
        const token = req.requestHeaders.Authorization;
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
        const userFound = schema.users.find(tokenFound.userId);

        const body = JSON.parse(req.requestBody);

        const eventFound = schema.events.find(body.id);

        const reservationFound = schema.reservations.findBy({
          eventId: body.id,
          userId: tokenFound.userId,
        });

        if (reservationFound) {
          return {id: reservationFound.id};
        }

        const createdReservation = schema.reservations.create({
          user: userFound,
          event: eventFound,
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

        console.log('Reservation >>> ', reservationFound);
        console.log(schema.reservations.all().models);

        const eventFound = schema.events.find(reservationFound.eventId);
        const userFound = schema.users.find(reservationFound.userId);

        const {phone, cep, name, adress, city, state} = body.purchaseValues;

        schema.purchases.create({
          event: eventFound,
          user: userFound,
          phone,
          cep,
          name,
          adress,
          city,
          state,
          qr: generateRandomString(20),
        });

        reservationFound.destroy();

        return {message: 'OK'};
      });

      this.get('/purchases', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const page = req.queryParams?.page;

        const user = schema.users.find(tokenFound.userId);

        const found = schema.purchases
          .where({userId: user.id})
          .sort((a, b) => {
            return Number(b.id) > Number(a.id) ? 1 : 0;
          })
          .slice((page - 1) * 5, page * 5);

        const formated = found.models.map(item => {
          return {
            ...item.attrs,
            event: item.event,
          };
        });

        console.log(formated);

        return {purchases: formated};
      });

      this.get('/purchase', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const id = req.queryParams?.id;

        const purchaseFound = schema.purchases.find(id);

        const purchase = {
          qr: purchaseFound.qr,
          imageUrl: purchaseFound.event.imageUrl,
          name: purchaseFound.event.name,
          value: purchaseFound.event.valor,
          description: purchaseFound.event.description,
        };

        return {purchase};
      });

      this.get('/my_events', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const page = req.queryParams?.page;

        const found = schema.events
          .where({userId: tokenFound.userId})
          .sort((a, b) => {
            return Number(b.id) > Number(a.id) ? 1 : 0;
          })
          .slice((page - 1) * 5, page * 5);

        const formated = found.models.map(item => ({
          id: item.id,
          title: item.name,
          sell: item.sell,
        }));

        console.log(formated);

        return {myEvents: formated};
      });

      this.get('/my_event', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const id = req.queryParams?.id;

        const found = schema.events.find(id);

        const myEvent = {
          name: found.name,
          description: found.description,
          valor: found.valor,
          sell: found.sell,
          gain: found.sell * found.valor,
          rest:
            found.sell >= found.ticketsNumber
              ? 0
              : found.ticketsNumber - found.sell,
          closed: found.closed,
          ticketsNumber: found.ticketsNumber,
          imageUrl: found.imageUrl,
        };

        return {myEvent};
      });

      this.put('/event/close', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const id = req.queryParams?.id;

        const found = schema.events.find(id);

        found.update({
          closed: true,
        });

        return {message: 'OK'};
      });

      this.put('/event/open', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const id = req.queryParams?.id;

        const found = schema.events.find(id);

        found.update({
          closed: false,
        });

        return {message: 'OK'};
      });

      this.put('/event', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const id = req.queryParams?.id;
        const body = JSON.parse(req.requestBody);

        const found = schema.events.find(id);

        found.update({
          name: body.name,
          description: body.description,
          valor: body.valor,
          ticketsNumber: body.ticketsNumber,
        });

        return {id: found.id};
      });

      this.put('/event/image', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const id = req.queryParams?.id;
        const body = JSON.parse(req.requestBody);

        const newImageUrl = body._parts[0][1].uri;

        const found = schema.events.find(id);

        found.update({
          imageUrl: newImageUrl,
        });

        return {message: 'OK', eventId: id};
      });

      this.post('/event', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const body = JSON.parse(req.requestBody);

        created = schema.events.create({
          userId: tokenFound.userId,
          sell: 0,
          rest: body.ticketsNumber,
          closed: true,
          name: body.name,
          description: body.description,
          valor: body.valor,
          ticketsNumber: body.ticketsNumber,
        });

        return {id: created.id};
      });

      this.delete('/event', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const id = req.queryParams?.id;

        const found = schema.events.find(id);

        found.destroy();

        return {message: 'OK'};
      });

      this.get('/sails', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const user = schema.users.find(tokenFound.userId);

        const data = {
          sales: user.sales,
          available: user.available,
        };

        return data;
      });

      this.post('/transfer', (schema, req) => {
        const token = req.requestHeaders.Authorization;
        const stractedToken = token.split(' ')[1];
        const tokenFound = schema.tokens.findBy({token: stractedToken});
        if (!tokenFound) {
          return new Response(403, {}, {message: 'Token Inválido'});
        }

        const user = schema.users.find(tokenFound.userId);

        const body = JSON.parse(req.requestBody);

        user.update({
          available: user.available - body.valor,
        });

        return {message: 'OK'};
      });
    },
  });
}
