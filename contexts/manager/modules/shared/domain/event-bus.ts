import { DomainEvent } from "./domain-event";
import { DomainEventSubscriber } from "./domain-event-subscriber";

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
  addSubscribers(subscribers: DomainEventSubscriber<DomainEvent>[]): void;
}
