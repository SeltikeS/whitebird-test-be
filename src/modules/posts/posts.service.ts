import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: number): Promise<Post> {
    const author = await this.usersRepository.findOne({
      where: { id: authorId },
    });
    if (!author) throw new NotFoundException('Author not found');

    const post = this.postsRepository.create({
      ...createPostDto,
      author,
    });

    return this.postsRepository.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['author', 'comments', 'likedBy', 'dislikedBy', 'favoriteBy'],
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'likedBy', 'dislikedBy', 'favoriteBy'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<Post> {
    const post = await this.findOne(id);
    if (post.author.id !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }
    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.findOne(id);
    if (post.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.postsRepository.delete(id);
  }

  private addUserToRelation(users: User[] | undefined, user: User): User[] {
    const set = new Set(users?.map((u) => u.id));
    if (!set.has(user.id)) {
      users = [...(users || []), user];
    }
    return users || [];
  }

  private removeUserFromRelation(
    users: User[] | undefined,
    user: User,
  ): User[] {
    return users?.filter((u) => u.id !== user.id) || [];
  }

  async likePost(postId: number, userId: number): Promise<Post> {
    const [post, user] = await Promise.all([
      this.findOne(postId),
      this.usersRepository.findOne({ where: { id: userId } }),
    ]);
    if (!user) throw new NotFoundException('User not found');

    post.likedBy = this.addUserToRelation(post.likedBy, user);
    post.dislikedBy = this.removeUserFromRelation(post.dislikedBy, user);

    return this.postsRepository.save(post);
  }

  async dislikePost(postId: number, userId: number): Promise<Post> {
    const [post, user] = await Promise.all([
      this.findOne(postId),
      this.usersRepository.findOne({ where: { id: userId } }),
    ]);
    if (!user) throw new NotFoundException('User not found');

    post.dislikedBy = this.addUserToRelation(post.dislikedBy, user);
    post.likedBy = this.removeUserFromRelation(post.likedBy, user);

    return this.postsRepository.save(post);
  }

  async addToFavorites(postId: number, userId: number): Promise<Post> {
    const [post, user] = await Promise.all([
      this.findOne(postId),
      this.usersRepository.findOne({ where: { id: userId } }),
    ]);
    if (!user) throw new NotFoundException('User not found');

    post.favoriteBy = this.addUserToRelation(post.favoriteBy, user);

    return this.postsRepository.save(post);
  }
}
