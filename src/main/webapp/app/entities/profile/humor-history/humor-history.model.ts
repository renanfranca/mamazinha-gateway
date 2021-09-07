import * as dayjs from 'dayjs';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { Humor } from 'app/entities/enumerations/humor.model';

export interface IHumorHistory {
  id?: number;
  humor?: Humor | null;
  date?: dayjs.Dayjs | null;
  profile?: IProfile | null;
}

export class HumorHistory implements IHumorHistory {
  constructor(public id?: number, public humor?: Humor | null, public date?: dayjs.Dayjs | null, public profile?: IProfile | null) {}
}

export function getHumorHistoryIdentifier(humorHistory: IHumorHistory): number | undefined {
  return humorHistory.id;
}
