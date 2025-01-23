import MyAccountInfoController from './MyAccountInfoController';
import { UserPublicAlgorithmsGetter } from './user-public-algorithms-getter';
import UserAuthenticationController from './UserAuthenticationController';
import UserSearchController from './UserSearchController';

export const userPublicAlgorithmsGetter =
  new UserPublicAlgorithmsGetter();

export const userSearchController = new UserSearchController();
export const userAuthenticationController =
  new UserAuthenticationController();
export const myAccountInfoController = new MyAccountInfoController();
