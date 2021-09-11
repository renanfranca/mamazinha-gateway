import * as dayjs from 'dayjs';
import { IBabyProfile } from 'app/entities/babyprofile/baby-profile/baby-profile.model';
import { Humor } from 'app/entities/enumerations/humor.model';

export interface IHumorHistory {
  id?: number;
  humor?: Humor | null;
  date?: dayjs.Dayjs | null;
  babyProfile?: IBabyProfile | null;
}

export class HumorHistory implements IHumorHistory {
  constructor(
    public id?: number,
    public humor?: Humor | null,
    public date?: dayjs.Dayjs | null,
    public babyProfile?: IBabyProfile | null
  ) {}
}

export function getHumorHistoryIdentifier(humorHistory: IHumorHistory): number | undefined {
  return humorHistory.id;
}
