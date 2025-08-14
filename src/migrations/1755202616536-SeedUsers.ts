import { MigrationInterface, QueryRunner } from 'typeorm';
import { RoleName } from '../modules/roles/dto/roles.enum';
import * as bcrypt from 'bcrypt';

export class SeedUsers1755202616536 implements MigrationInterface {
  name = 'SeedUsers1755202616536';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Получаем id ролей
    const userRole = await queryRunner.query(
      `SELECT id FROM "role" WHERE name='${RoleName.USER}'`,
    );
    const adminRole = await queryRunner.query(
      `SELECT id FROM "role" WHERE name='${RoleName.ADMIN}'`,
    );

    if (!userRole[0] || !adminRole[0]) {
      throw new Error(
        'Roles not found. Make sure roles exist before running this migration.',
      );
    }

    const userPassword = await bcrypt.hash('user', 10);
    const adminPassword = await bcrypt.hash('admin', 10);

    // Создаём пользователей
    await queryRunner.query(`
      INSERT INTO "user" ("email", "passwordHash", "roleId", "createdAt")
      VALUES 
        ('user@user.com', '${userPassword}', ${userRole[0].id}, NOW())
      ON CONFLICT (email) DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO "user" ("email", "passwordHash", "roleId", "createdAt")
      VALUES 
        ('admin@admin.com', '${adminPassword}', ${adminRole[0].id}, NOW())
      ON CONFLICT (email) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "user" WHERE email IN ('user@user.com', 'admin@admin.com')`,
    );
  }
}
