import { MigrationInterface, QueryRunner } from 'typeorm';
import { RoleName } from '../modules/roles/dto/roles.enum';
import { Permission } from '../modules/roles/dto/permission.enum';

export class CreateDefaultRoles1755202267838 implements MigrationInterface {
  name = 'CreateDefaultRoles1755202267838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Пользователь
    await queryRunner.query(`
            INSERT INTO "role" ("name", "permissions")
            VALUES ('${RoleName.USER}', '${[
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
            ].join(',')}')
            ON CONFLICT (name) DO NOTHING
        `);

    // Админ
    await queryRunner.query(`
            INSERT INTO "role" ("name", "permissions")
            VALUES ('${RoleName.ADMIN}', '${[
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
              Permission.MANAGE_USERS,
              Permission.EDIT_ALL_POSTS,
              Permission.DELETE_ALL_POSTS,
              Permission.SET_POST_PRIORITY,
              Permission.EDIT_ALL_COMMENTS,
              Permission.DELETE_ALL_COMMENTS,
            ].join(',')}')
            ON CONFLICT (name) DO NOTHING
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "role" WHERE "name" IN ('${RoleName.USER}', '${RoleName.ADMIN}')`,
    );
  }
}
