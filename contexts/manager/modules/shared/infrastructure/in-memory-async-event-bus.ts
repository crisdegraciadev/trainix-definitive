import { EventEmitter } from "events";
import { EventBus } from "../domain/event-bus";
import { DomainEvent } from "../domain/domain-event";
import { DomainEventSubscriber } from "../domain/domain-event-subscriber";

export class InMemoryAsyncEventBus extends EventEmitter implements EventBus {
  async publish(events: DomainEvent[]): Promise<void> {
    events.map((event) => this.emit(event.eventName, event));
  }

  addSubscribers(subscribers: DomainEventSubscriber<DomainEvent>[]): void {
    subscribers.forEach((subscriber) => {
      subscriber.subscribe().forEach((event) => {
        this.on(event.EVENT_NAME, subscriber.on.bind(subscriber));
      });
    });
  }
}
