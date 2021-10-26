import { Ticket } from '../ticket'

it('implements optimistic concurrency control', async () => {
  // create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  })

  // save it
  await ticket.save()

  // fetch twice
  const first = await Ticket.findById(ticket.id)
  const second = await Ticket.findById(ticket.id)

  // make 2 separate changes to tickets fetched
  first!.set({ price: 10 })
  second!.set({ price: 15 })

  // save first fetched ticket
  await first!.save()

  // save second fetched ticket and expect error
  try {
    await second!.save() 
  } catch (err) {
    return
  }

  throw new Error('should not reach this point')
})

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123'
  })
  
  await ticket.save()
  expect(ticket.version).toEqual(0)
  
  await ticket.save()
  expect(ticket.version).toEqual(1)

  await ticket.save()
  expect(ticket.version).toEqual(2)
})