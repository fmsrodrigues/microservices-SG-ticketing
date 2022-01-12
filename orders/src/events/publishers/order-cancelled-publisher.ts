import { Publisher, OrderCancelledEvent, Subjects } from "@shuratickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}