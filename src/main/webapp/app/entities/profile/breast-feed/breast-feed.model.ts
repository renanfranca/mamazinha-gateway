import * as dayjs from 'dayjs';
import { IProfile } from 'app/entities/profile/profile/profile.model';
import { Pain } from 'app/entities/enumerations/pain.model';

export interface IBreastFeed {
  id?: number;
  start?: dayjs.Dayjs | null;
  end?: dayjs.Dayjs | null;
  pain?: Pain | null;
  profile?: IProfile | null;
}

export class BreastFeed implements IBreastFeed {
  constructor(
    public id?: number,
    public start?: dayjs.Dayjs | null,
    public end?: dayjs.Dayjs | null,
    public pain?: Pain | null,
    public profile?: IProfile | null
  ) {}
}

export function getBreastFeedIdentifier(breastFeed: IBreastFeed): number | undefined {
  return breastFeed.id;
}
