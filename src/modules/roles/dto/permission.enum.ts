export enum Permission {
  // Пользователи (только админ)
  MANAGE_USERS = 'manage_users', // админ: управлять всеми пользователями

  // Посты
  CREATE_POST = 'create_post', // создавать пост
  EDIT_OWN_POST = 'edit_own_post', // редактировать свой пост
  EDIT_ALL_POSTS = 'edit_all_posts', // * админ: редактировать любой пост
  DELETE_OWN_POST = 'delete_own_post', // удалять свой пост
  DELETE_ALL_POSTS = 'delete_all_posts', // * админ: удалять любой пост
  VIEW_ALL_POSTS = 'view_all_posts', // просматривать все посты
  VIEW_OWN_POSTS = 'view_own_posts', // просматривать свои посты
  SET_POST_PRIORITY = 'set_post_priority', // * админ: менять приоритет постов / поднимать в топ

  // Комменты
  CREATE_COMMENT = 'create_comment', // оставлять комменты
  EDIT_OWN_COMMENT = 'edit_own_comment', // редактировать свой коммент
  EDIT_ALL_COMMENTS = 'edit_all_comments', // * админ: редактировать любой коммент
  DELETE_OWN_COMMENT = 'delete_own_comment', // удалять свой коммент
  DELETE_ALL_COMMENTS = 'delete_all_comments', // * админ: удалять любой коммент
  VIEW_COMMENTS = 'view_comments', // просматривать комменты

  // Взаимодействие с постами
  LIKE_POST = 'like_post', // ставить лайк
  DISLIKE_POST = 'dislike_post', // ставить дизлайк
  FAVORITE_POST = 'favorite_post', // добавлять в избранное

  // Личный кабинет
  VIEW_PROFILE = 'view_profile', // просматривать свой профиль
  EDIT_PROFILE = 'edit_profile', // редактировать свой профиль
}
