import { Publisher, Subjects, TicketCreatedEvent } from "@shuratickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}