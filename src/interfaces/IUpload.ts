import IUser from './IUser';
import IWorkspace from './IWorkspace';

export default interface IUpload {
  user: IUser;
  workspace: IWorkspace;
  _id: string;
  name: string;
  files: { filename: string; size: number }[];
  downloads: number;
  color: string;
  coverImage: string;
  createdAt: string;
  sizeInBytes: number;
}
