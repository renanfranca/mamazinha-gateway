import * as dayjs from 'dayjs';

export interface IBabyProfile {
  id?: number;
  name?: string | null;
  pictureContentType?: string | null;
  picture?: string | null;
  birthday?: dayjs.Dayjs | null;
  sign?: string | null;
  userId?: string | null;
}

export class BabyProfile implements IBabyProfile {
  constructor(
    public id?: number,
    public name?: string | null,
    public pictureContentType?: string | null,
    public picture?: string | null,
    public birthday?: dayjs.Dayjs | null,
    public sign?: string | null,
    public userId?: string | null
  ) {}
}

export function getBabyProfileIdentifier(babyProfile: IBabyProfile): number | undefined {
  return babyProfile.id;
}
