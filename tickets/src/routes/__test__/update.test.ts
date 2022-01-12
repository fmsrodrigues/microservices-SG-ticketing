import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 10
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .send({
      title: 'title',
      price: 10
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 10
    })
    .expect(401)
});

it('returns a 400 if the user provides and invalid title or price', async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10
    })
    .expect(400)

    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: -5
    })
    .expect(400)
});

it('updates the ticket provided valid input', async () => {
  const cookie = global.signin();
  const title = 'title';
  const price = 10;

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price
    })
    .expect(200)

  const resTicket = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200)

  expect(resTicket.body.title).toEqual(title);
  expect(resTicket.body.price).toEqual(price);
});


it('publishes an event', async () => {
  const cookie = global.signin();
  const title = 'title';
  const price = 10;

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price
    })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();
  const title = 'title';
  const price = 10;

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20
    })
    .expect(201)

  const ticket = await Ticket.findById(res.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price
    })
    .expect(400)
});