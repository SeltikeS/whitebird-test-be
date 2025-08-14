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
import { UserAuthJwtPayload } from '../auth/dto/user-auth-jwt-payload';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: { user: UserAuthJwtPayload },
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(createCommentDto, req.user.id, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: UserAuthJwtPayload },
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: UserAuthJwtPayload },
  ) {
    return this.commentsService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/like')
  like(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: UserAuthJwtPayload },
  ) {
    return this.commentsService.likeComment(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/dislike')
  dislike(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: UserAuthJwtPayload },
  ) {
    return this.commentsService.dislikeComment(req.user.id, id);
  }
}
