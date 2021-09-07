import * as dayjs from 'dayjs';
import { IProfile } from 'app/entities/profile/profile/profile.model';

export interface IHeight {
  id?: number;
  value?: number | null;
  date?: dayjs.Dayjs | null;
  idealWight?: number | null;
  profile?: IProfile | null;
}

export class Height implements IHeight {
  constructor(
    public id?: number,
    public value?: number | null,
    public date?: dayjs.Dayjs | null,
    public idealWight?: number | null,
    public profile?: IProfile | null
  ) {}
}

export function getHeightIdentifier(height: IHeight): number | undefined {
  return height.id;
}
