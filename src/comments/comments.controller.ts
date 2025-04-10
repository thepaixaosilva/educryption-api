import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './schemas/comment.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new comment',
    description: 'Creates a new comment with the provided data.',
  })
  @ApiBody({
    type: CreateCommentDto,
    description: 'Comment data transfer object',
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: Comment,
  })
  @ApiResponse({
    status: 422,
    description: 'Data failed validation',
  })
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all comments',
    description: 'Retrieves a list of all comments with their details.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all comments retrieved successfully',
    type: [Comment],
  })
  @ApiResponse({
    status: 404,
    description: 'No comment found',
  })
  findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: Comment,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get comment by ID',
    description: 'Retrieves a specific comment by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Comment found',
    type: Comment,
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid comment ID',
  })
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findById(id);
  }

  @Get('content/:contentId')
  @ApiOkResponse({
    type: Comment,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get comments by content ID',
    description:
      'Retrieves all comments associated with a specific content ID.',
  })
  @ApiParam({
    name: 'contentId',
    description: 'Content ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Comments found for content',
    type: [Comment],
  })
  @ApiResponse({
    status: 404,
    description: 'No comments found for content',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid content ID',
  })
  findByContent(@Param('contentId') contentId: string): Promise<Comment[]> {
    return this.commentsService.findByContent(contentId);
  }

  @Get('user/:userId')
  @ApiOkResponse({
    type: Comment,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get comments by user ID',
    description: 'Retrieves all comments made by a specific user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Comments found for user',
    type: [Comment],
  })
  @ApiResponse({
    status: 404,
    description: 'No comments found for user',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID',
  })
  findByUser(@Param('userId') userId: string): Promise<Comment[]> {
    return this.commentsService.findByUser(userId);
  }

  @Get(':id/replies')
  @ApiOkResponse({
    type: Comment,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get replies to a comment',
    description: 'Retrieves all replies to a specific comment by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Replies found for comment',
    type: [Comment],
  })
  @ApiResponse({
    status: 404,
    description: 'No replies found for comment',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid comment ID',
  })
  findReplies(@Param('id') id: string): Promise<Comment[]> {
    return this.commentsService.findReplies(id);
  }

  @Put(':id')
  @ApiOkResponse({
    type: Comment,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiOperation({
    summary: 'Update comment',
    description: "Updates a comment's information by its ID.",
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID to update',
    type: String,
  })
  @ApiBody({
    type: UpdateCommentDto,
    description: 'Updated comment data',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: Comment,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid comment ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Comment ID to delete',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove comment',
    description: 'Removes a comment from the system by its ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'Comment removed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid comment ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.commentsService.delete(id);
  }
}
