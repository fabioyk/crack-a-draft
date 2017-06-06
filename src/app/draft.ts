import { IFormat } from "app/format";
import { ICrack } from "app/crack";
import { ICard } from "app/card";

export interface IDraft {
  draft: {
    _id: string;
    drafter: string;
    submitDate: Date;
    modifiedDate: Date;
    format: string;
    packs: [[string]];
    picks: [number];
    cracks: [ICrack];
    numCracks: number;
  };
  format: IFormat;
  cards: [ICard]
  error: string;
}
