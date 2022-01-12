import { Publisher, Subjects, TicketUpdatedEvent } from "@shuratickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}