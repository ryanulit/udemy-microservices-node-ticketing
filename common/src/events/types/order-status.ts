export enum OrderStatus {
  // order created, but ticket being ordered is not reserved
  Created = 'created',

  // ticket trying to be ordered is already reserved,
  // or user has cancelled the order
  // order expires before payment
  Cancelled = 'cancelled',

  // order successfully reserved ticket
  AwaitingPayment = 'awaiting:payment',
  
  // order reserved ticket and user provided payment successfully
  Complete = 'complete'
}