import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './modules/roles/roles.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/entities/users.entity';
import { Role } from './modules/roles/entities/roles.entity';
import { Post } from './modules/posts/entities/posts.entity';
import { Comment } from './modules/comments/entities/comments.entity';
import { UserProfile } from './modules/users/entities/user-profile.entity';

export const ALL_ENTITIES = [User, Role, Post, Comment, UserProfile];

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'whitebird',
      entities: ALL_ENTITIES,
      synchronize: false,
    }),
    RolesModule,
    PostsModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
