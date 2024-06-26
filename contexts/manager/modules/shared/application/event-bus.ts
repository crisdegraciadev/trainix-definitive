import { DomainEvent } from "../domain/domain-event";
import { DomainEventSubscriber } from "../domain/domain-event-subscriber";

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
  addSubscribers(subscribers: DomainEventSubscriber<DomainEvent>[]): void;
}
