import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  // UseGuards
} from '@nestjs/common'
// iimport { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { Comment } from './schemas/comment.schema'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto)
  }

  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findById(id)
  }

  @Get('content/:contentId')
  findByContent(@Param('contentId') contentId: string): Promise<Comment[]> {
    return this.commentsService.findByContent(contentId)
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string): Promise<Comment[]> {
    return this.commentsService.findByUser(userId)
  }

  @Get(':id/replies')
  findReplies(@Param('id') id: string): Promise<Comment[]> {
    return this.commentsService.findReplies(id)
  }

  // @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto)
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.commentsService.delete(id)
  }
}
