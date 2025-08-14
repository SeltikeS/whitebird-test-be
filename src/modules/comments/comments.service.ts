import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comments.entity';
import { Post } from '../posts/entities/posts.entity';
import { User } from '../users/entities/users.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    authorId: number,
    postId: number,
  ): Promise<Comment> {
    const author = await this.usersRepository.findOne({
      where: { id: authorId },
    });
    if (!author) throw new NotFoundException('Author not found');

    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      author,
      post,
    });

    return this.commentsRepository.save(comment);
  }

  findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['author', 'post'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentsRepository.delete(id);
  }

  async likeComment(userId: number, commentId: number): Promise<Comment> {
    return this.toggleCommentReaction(
      userId,
      commentId,
      'likedBy',
      'dislikedBy',
    );
  }

  async dislikeComment(userId: number, commentId: number): Promise<Comment> {
    return this.toggleCommentReaction(
      userId,
      commentId,
      'dislikedBy',
      'likedBy',
    );
  }

  private async toggleCommentReaction(
    userId: number,
    commentId: number,
    addRelation: 'likedBy' | 'dislikedBy',
    removeRelation: 'likedBy' | 'dislikedBy',
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['likedBy', 'dislikedBy'],
    });
    if (!comment) throw new NotFoundException('Comment not found');

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (comment[removeRelation]?.some((u) => u.id === userId)) {
      await this.commentsRepository
        .createQueryBuilder()
        .relation(Comment, removeRelation)
        .of(comment)
        .remove(user);
    }

    if (!comment[addRelation]?.some((u) => u.id === userId)) {
      await this.commentsRepository
        .createQueryBuilder()
        .relation(Comment, addRelation)
        .of(comment)
        .add(user);
    }

    const updatedComment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['likedBy', 'dislikedBy'],
    });

    if (!updatedComment) throw new NotFoundException('Comment not found');

    return updatedComment;
  }
}
