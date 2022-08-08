// Makes switch cases exhaustive: https://github.com/ts-essentials/ts-essentials#exhaustive-switch-cases
export class UnreachableCaseError extends Error {
  constructor(value: never) {
    super(`Unreachable case: ${value}`);
  }
}
