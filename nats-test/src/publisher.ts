import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
})

stan.on('connect', async () => {
  console.log('publisher connected to NATS')

  await new TicketCreatedPublisher(stan).publish({
    id: '123',
    title: 'concert',
    price: 20
  })
})