import * as dayjs from 'dayjs';
import { IBabyProfile } from 'app/entities/babyprofile/baby-profile/baby-profile.model';

export interface IWeight {
  id?: number;
  value?: number | null;
  date?: dayjs.Dayjs | null;
  idealWight?: number | null;
  babyProfile?: IBabyProfile | null;
}

export class Weight implements IWeight {
  constructor(
    public id?: number,
    public value?: number | null,
    public date?: dayjs.Dayjs | null,
    public idealWight?: number | null,
    public babyProfile?: IBabyProfile | null
  ) {}
}

export function getWeightIdentifier(weight: IWeight): number | undefined {
  return weight.id;
}
