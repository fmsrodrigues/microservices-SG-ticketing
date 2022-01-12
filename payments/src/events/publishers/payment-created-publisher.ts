import { PaymentCreatedEvent, Publisher, Subjects } from "@shuratickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}