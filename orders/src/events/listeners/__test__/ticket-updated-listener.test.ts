import { TicketUpdatedEvent } from "@rmytickets/common"
import mongoose from 'mongoose'
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { Ticket } from '../../../models/ticket'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })
  await ticket.save()

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'asjldjls'
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  
  return { listener, ticket, data, msg }
}

it('finds, updates and saves a ticket', async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the messgae', async () => {
  const { listener, ticket, data, msg } = await setup()
})

it('does not call ack if event has a skipped version number', async () => {
  const { listener, ticket, data, msg } = await setup()

  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled()
})