import { Permission } from './permission.enum';

export const USER_PERMISSIONS: Permission[] = [
  Permission.CREATE_POST,
  Permission.EDIT_OWN_POST,
  Permission.DELETE_OWN_POST,
  Permission.VIEW_ALL_POSTS,
  Permission.VIEW_OWN_POSTS,
  Permission.CREATE_COMMENT,
  Permission.EDIT_OWN_COMMENT,
  Permission.DELETE_OWN_COMMENT,
  Permission.VIEW_COMMENTS,
  Permission.LIKE_POST,
  Permission.DISLIKE_POST,
  Permission.FAVORITE_POST,
  Permission.VIEW_PROFILE,
  Permission.EDIT_PROFILE,
];

export const ADMIN_PERMISSIONS: Permission[] = [
  ...USER_PERMISSIONS,
  Permission.MANAGE_USERS,
  Permission.EDIT_ALL_POSTS,
  Permission.DELETE_ALL_POSTS,
  Permission.SET_POST_PRIORITY,
  Permission.EDIT_ALL_COMMENTS,
  Permission.DELETE_ALL_COMMENTS,
];
