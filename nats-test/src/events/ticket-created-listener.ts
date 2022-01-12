import { Message } from "node-nats-streaming";

import { Listener } from "./listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';
 

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data:', data);

    msg.ack();
  }
};