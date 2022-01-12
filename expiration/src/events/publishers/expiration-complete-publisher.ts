import { ExpirationCompleteEvent, Publisher, Subjects } from "@shuratickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>  {
  readonly subject = Subjects.ExpirationComplete;
}