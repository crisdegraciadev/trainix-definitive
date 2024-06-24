import { Uuid } from "./value-objects/uuid";

type DomainEventDto = {
  aggregateId: string;
  eventId: string;
  eventName: string;
  ocurredOn: Date;
};

type FromPrimitivesDto = Omit<DomainEventDto, "eventName"> & {
  attributes: DomainEventAttributes;
};

type DomainEventAttributes = any;

export type DomainEventClass = {
  EVENT_NAME: string;
  fromPrimitives(dto: FromPrimitivesDto): DomainEvent;
};

export abstract class DomainEvent {
  static EVENT_NAME: string;
  static fromPrimitives: (dto: FromPrimitivesDto) => DomainEvent;

  readonly aggregateId: string;
  readonly eventId: string;
  readonly eventName: string;
  readonly ocurredOn: Date;

  constructor(dto: DomainEventDto) {
    const { aggregateId, eventId, eventName, ocurredOn } = dto;

    this.aggregateId = aggregateId;
    this.eventId = eventId ?? Uuid.random().value;
    this.eventName = eventName;
    this.ocurredOn = ocurredOn ?? new Date();
  }

  abstract toPrimitives(): DomainEventAttributes;
}
