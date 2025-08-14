import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserAuthJwtPayload } from '../auth/dto/user-auth-jwt-payload';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  async create(
    @Req() req: { user: UserAuthJwtPayload },
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(createPostDto, req.user.id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: { user: UserAuthJwtPayload },
  ) {
    return this.postsService.update(id, updatePostDto, req.user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: UserAuthJwtPayload },
  ) {
    return this.postsService.remove(id, req.user.id);
  }

  @Patch(':id/like')
  async likePost(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: UserAuthJwtPayload },
  ) {
    return this.postsService.likePost(req.user.id, id);
  }

  @Patch(':id/dislike')
  async dislikePost(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: UserAuthJwtPayload },
  ) {
    return this.postsService.dislikePost(req.user.id, id);
  }

  @Patch(':id/favorite')
  async favoritePost(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: UserAuthJwtPayload },
  ) {
    return this.postsService.addToFavorites(req.user.id, id);
  }
}
