import { IFormat } from "app/format";

export interface IDraft {
  draft: {
    drafter: string;
    submitDate: Date;
    format: string;
    packs: [[string]];
    picks: [number];
    cracks: [{
      id: string;
      date: Date;
      picks: [number];
      archetype: string;
    }]
  };
  format: IFormat;
}
