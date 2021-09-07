import * as dayjs from 'dayjs';
import { IProfile } from 'app/entities/profile/profile/profile.model';

export interface IWeight {
  id?: number;
  value?: number | null;
  date?: dayjs.Dayjs | null;
  idealWight?: number | null;
  profile?: IProfile | null;
}

export class Weight implements IWeight {
  constructor(
    public id?: number,
    public value?: number | null,
    public date?: dayjs.Dayjs | null,
    public idealWight?: number | null,
    public profile?: IProfile | null
  ) {}
}

export function getWeightIdentifier(weight: IWeight): number | undefined {
  return weight.id;
}
