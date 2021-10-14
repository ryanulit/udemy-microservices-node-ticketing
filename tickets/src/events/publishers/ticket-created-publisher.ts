import { Publisher, Subjects, TicketCreatedEvent } from '@rmytickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}