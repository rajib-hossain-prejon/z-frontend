import IUpload from './IUpload';
import IUser from './IUser';

export default interface IWorkspace {
  user: IUser;
  _id: string;
  name: string;
  coverImage?: string;
  uploads?: IUpload[];
}
