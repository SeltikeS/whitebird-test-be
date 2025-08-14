import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/roles.entity';
import { Post } from '../../posts/entities/posts.entity';
import { Comment } from '../../comments/entities/comments.entity';
import { UserProfile } from './user-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @ManyToMany(() => Post, (post) => post.likedBy)
  likedPosts: Post[];

  @ManyToMany(() => Post, (post) => post.dislikedBy)
  dislikedPosts: Post[];

  @ManyToMany(() => Post, (post) => post.favoriteBy)
  favoritePosts: Post[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  lastLogin?: Date;

  @ManyToMany(() => Comment, (comment) => comment.likedBy)
  likedComments: Comment[];

  @ManyToMany(() => Comment, (comment) => comment.dislikedBy)
  dislikedComments: Comment[];
}
