import { Publisher, Subjects, OrderCancelledEvent } from '@rmytickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}