import { OrderStatus } from '@shuratickets/common';
import { Types } from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'token',
      orderId: new Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    price: 10,
    version: 0,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'token',
      orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new Types.ObjectId().toHexString();

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId,
    price: 10,
    version: 0,
    status: OrderStatus.Cancelled
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'token',
      orderId: order.id
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = new Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000)
  const token = 'tok_visa';
  const currency = 'usd';

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId,
    price,
    version: 0,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token,
      orderId: order.id
    })
    .expect(201);

  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  // expect(chargeOptions.source).toEqual(token);
  // expect(chargeOptions.currency).toEqual(currency);
  // expect(chargeOptions.amount).toEqual(order.price * 100);

  const stripeCharges = await stripe.charges.list({ limit: 100 });
  const stripeCharge = stripeCharges.data.find(charge => charge.amount === price * 100);
  
  expect(stripeCharge).toBeDefined(); // checks only for undefined! null would works here and pass the test
  expect(stripeCharge!.currency).toEqual(currency);

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });

  expect(payment).not.toBeNull();
})
