import * as dayjs from 'dayjs';
import { IBabyProfile } from 'app/entities/babyprofile/baby-profile/baby-profile.model';
import { Humor } from 'app/entities/enumerations/humor.model';
import { Place } from 'app/entities/enumerations/place.model';

export interface INap {
  id?: number;
  start?: dayjs.Dayjs | null;
  end?: dayjs.Dayjs | null;
  humor?: Humor | null;
  place?: Place | null;
  babyProfile?: IBabyProfile | null;
}

export class Nap implements INap {
  constructor(
    public id?: number,
    public start?: dayjs.Dayjs | null,
    public end?: dayjs.Dayjs | null,
    public humor?: Humor | null,
    public place?: Place | null,
    public babyProfile?: IBabyProfile | null
  ) {}
}

export function getNapIdentifier(nap: INap): number | undefined {
  return nap.id;
}
