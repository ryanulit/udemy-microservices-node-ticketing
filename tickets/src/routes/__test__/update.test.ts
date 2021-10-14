import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'

it('returns 404 if provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'sjjsks',
      price: 20
    })
    .expect(404)
})

it('returns 401 if user not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sjjsks',
      price: 20
    })
    .expect(401)
})

it('returns 401 if user does not own ticket', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'aksjsdks',
      price: 20
    })
  
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'sjsjldsss',
      price: 1000
    })
    .expect(401)
})

it('returns 400 if user provides invalid title or price', async () => {
  const cookie = global.signin()
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'aksjsdks',
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400)
  
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'wddssdsds',
      price: -10
    })
    .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin()
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'aksjsdks',
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200)

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)

  expect(ticketRes.body.title).toEqual('new title')
  expect(ticketRes.body.price).toEqual(100)
})

it('publishes an event', async () => {
  const cookie = global.signin()
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'aksjsdks',
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200)
  
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})