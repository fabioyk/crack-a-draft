import { IFormat } from "app/format";
import { ICrack } from "app/crack";
import { ICard } from "app/card";

export interface IDraft {
  draft: {
    _id: string;
    drafter: string;
    submitDate: Date;
    format: string;
    packs: [[string]];
    picks: [number];
    cracks: [ICrack];
  };
  format: IFormat;
  cards: [ICard]
  error: string;
}