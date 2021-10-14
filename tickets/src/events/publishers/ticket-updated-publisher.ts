import { Publisher, Subjects, TicketUpdatedEvent } from '@rmytickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}