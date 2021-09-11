import * as dayjs from 'dayjs';
import { IBabyProfile } from 'app/entities/babyprofile/baby-profile/baby-profile.model';

export interface IHeight {
  id?: number;
  value?: number | null;
  date?: dayjs.Dayjs | null;
  idealWight?: number | null;
  babyProfile?: IBabyProfile | null;
}

export class Height implements IHeight {
  constructor(
    public id?: number,
    public value?: number | null,
    public date?: dayjs.Dayjs | null,
    public idealWight?: number | null,
    public babyProfile?: IBabyProfile | null
  ) {}
}

export function getHeightIdentifier(height: IHeight): number | undefined {
  return height.id;
}
