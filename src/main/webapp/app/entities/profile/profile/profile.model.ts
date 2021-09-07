import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';

export interface IProfile {
  id?: number;
  name?: string | null;
  pictureContentType?: string | null;
  picture?: string | null;
  birthday?: dayjs.Dayjs | null;
  sign?: string | null;
  user?: IUser | null;
}

export class Profile implements IProfile {
  constructor(
    public id?: number,
    public name?: string | null,
    public pictureContentType?: string | null,
    public picture?: string | null,
    public birthday?: dayjs.Dayjs | null,
    public sign?: string | null,
    public user?: IUser | null
  ) {}
}

export function getProfileIdentifier(profile: IProfile): number | undefined {
  return profile.id;
}
