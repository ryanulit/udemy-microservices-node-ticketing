import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

import { natsWrapper } from '../../nats-wrapper'

it('has a route handler listening to /api/tickets for posts', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .send()
  
    expect(res.status).not.toEqual(404)
})

it('can only be accessed if user signed in', async () => {
   await request(app)
    .post('/api/tickets')
    .send()
    .expect(401)
})

it('returns status other than 401 if signed in', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send()

  expect(res.status).not.toEqual(401)
})

it('returns error for invalid title', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400)
})

it('returns error for invalid price', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'shdshkdsk',
      price: -10
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'shdshkdsk'
    })
    .expect(400)
})

it('creates ticket with valid parameters', async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sjjls',
      price: 20
    })
    .expect(201)
  
  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].price).toEqual(20)
  expect(tickets[0].title).toEqual('sjjls')
})

it('publishes an event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sjjls',
      price: 20
    })
    .expect(201)
  
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})