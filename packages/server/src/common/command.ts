export abstract class Command<T extends object> {
  constructor(
    readonly tenantId: string,
    readonly data: T,
  ) {}
}
