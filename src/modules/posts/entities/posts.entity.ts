import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Comment } from '../../comments/entities/comments.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  priority: number; // для админа, поднимать пост

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.likedPosts)
  @JoinTable()
  likedBy: User[];

  @ManyToMany(() => User, (user) => user.dislikedPosts)
  @JoinTable()
  dislikedBy: User[];

  @ManyToMany(() => User, (user) => user.favoritePosts)
  favoriteBy: User[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
