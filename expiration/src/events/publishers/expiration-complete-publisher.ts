import { Publisher, ExpirationCompleteEvent, Subjects } from '@rmytickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}