import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1755201376419 implements MigrationInterface {
  name = 'InitMigration1755201376419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "role" (
                "id" SERIAL PRIMARY KEY,
                "name" character varying UNIQUE NOT NULL,
                "permissions" text NOT NULL
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id" SERIAL PRIMARY KEY,
                "email" character varying UNIQUE NOT NULL,
                "passwordHash" character varying NOT NULL,
                "roleId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "lastLogin" TIMESTAMP,
                CONSTRAINT "FK_user_role" FOREIGN KEY ("roleId") REFERENCES "role"("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user_profile" (
                "id" SERIAL PRIMARY KEY,
                "firstName" character varying,
                "lastName" character varying,
                "address" character varying,
                "phone" character varying,
                "avatarUrl" character varying,
                "userId" integer UNIQUE,
                CONSTRAINT "FK_user_profile_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "post" (
                "id" SERIAL PRIMARY KEY,
                "title" character varying NOT NULL,
                "content" text NOT NULL,
                "priority" integer NOT NULL DEFAULT 0,
                "authorId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FK_post_author" FOREIGN KEY ("authorId") REFERENCES "user"("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "comment" (
                "id" SERIAL PRIMARY KEY,
                "content" text NOT NULL,
                "authorId" integer,
                "postId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FK_comment_author" FOREIGN KEY ("authorId") REFERENCES "user"("id"),
                CONSTRAINT "FK_comment_post" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "post_liked_by_user" (
                "postId" integer NOT NULL,
                "userId" integer NOT NULL,
                PRIMARY KEY ("postId", "userId"),
                CONSTRAINT "FK_post_liked_post" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_post_liked_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "post_disliked_by_user" (
                "postId" integer NOT NULL,
                "userId" integer NOT NULL,
                PRIMARY KEY ("postId", "userId"),
                CONSTRAINT "FK_post_disliked_post" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_post_disliked_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "post_favorite_by_user" (
                "postId" integer NOT NULL,
                "userId" integer NOT NULL,
                PRIMARY KEY ("postId", "userId"),
                CONSTRAINT "FK_post_favorite_post" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_post_favorite_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "post_favorite_by_user"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "post_disliked_by_user"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "post_liked_by_user"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "comment"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "post"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_profile"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role"`);
  }
}
