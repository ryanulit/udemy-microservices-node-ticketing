import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns 404 if ticket not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .get(`/api/tickets/${id}`)
    .expect(404)
})

it('returns ticket if it is found', async () => {
  const title = 'concert'
  const price = 20

  const res = await request(app)  
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ 
      title, price
    })
    .expect(201)

    const ticketRes = await request(app)
      .get(`/api/tickets/${res.body.id}`)
      .expect(200)

    expect(ticketRes.body.title).toEqual(title)
    expect(ticketRes.body.price).toEqual(price)
})