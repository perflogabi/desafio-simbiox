export type CardSearchErrorKind =
  "network" | "invalid" | "unavailable" | "unexpected";

export class CardSearchError extends Error {
  readonly kind: CardSearchErrorKind;

  constructor(kind: CardSearchErrorKind) {
    super(kind);
    this.name = "CardSearchError";
    this.kind = kind;
  }
}
