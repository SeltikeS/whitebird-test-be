import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddLikesDislikes1755207547373 implements MigrationInterface {
  name = 'AddLikesDislikes1755207547373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Лайки для комментариев
    const hasLikedTable = await queryRunner.hasTable('comment_liked_by_user');
    if (!hasLikedTable) {
      await queryRunner.createTable(
        new Table({
          name: 'comment_liked_by_user',
          columns: [
            { name: 'commentId', type: 'integer', isPrimary: true },
            { name: 'userId', type: 'integer', isPrimary: true },
          ],
        }),
        true,
      );

      await queryRunner.createForeignKey(
        'comment_liked_by_user',
        new TableForeignKey({
          columnNames: ['commentId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'comment',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'comment_liked_by_user',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'CASCADE',
        }),
      );
    }

    // Дизлайки для комментариев
    const hasDislikedTable = await queryRunner.hasTable(
      'comment_disliked_by_user',
    );
    if (!hasDislikedTable) {
      await queryRunner.createTable(
        new Table({
          name: 'comment_disliked_by_user',
          columns: [
            { name: 'commentId', type: 'integer', isPrimary: true },
            { name: 'userId', type: 'integer', isPrimary: true },
          ],
        }),
        true,
      );

      await queryRunner.createForeignKey(
        'comment_disliked_by_user',
        new TableForeignKey({
          columnNames: ['commentId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'comment',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'comment_disliked_by_user',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasLikedTable = await queryRunner.hasTable('comment_liked_by_user');
    if (hasLikedTable) await queryRunner.dropTable('comment_liked_by_user');

    const hasDislikedTable = await queryRunner.hasTable(
      'comment_disliked_by_user',
    );
    if (hasDislikedTable)
      await queryRunner.dropTable('comment_disliked_by_user');
  }
}
