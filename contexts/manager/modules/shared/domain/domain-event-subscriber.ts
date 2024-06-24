import { DomainEvent, DomainEventClass } from "./domain-event";

export interface DomainEventSubscriber<T extends DomainEvent> {
  subscribe(): DomainEventClass[];
  on(domainEvent: T): Promise<void>;
}
