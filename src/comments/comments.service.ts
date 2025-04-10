import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Validators } from 'src/utils/helpers/validators.helper';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const createdComment = new this.commentModel(createCommentDto);

    if (createCommentDto.comment_id) {
      await this.addReference(
        createCommentDto.comment_id,
        createdComment._id.toString(),
      );
    }

    return createdComment.save();
  }

  async findAll(): Promise<Comment[]> {
    const comments = await this.commentModel.find().exec();

    if (comments.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'noCommentFound',
        },
      });
    }

    return comments;
  }

  async findById(id: string): Promise<Comment> {
    Validators.validateId(id, 'Unit');
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'userNotFound',
        },
      });
    }
    return comment;
  }

  async findByUser(userId: string): Promise<Comment[]> {
    Validators.validateId(userId, 'User');
    const comments = await this.commentModel.find({ user_id: userId }).exec();

    if (comments.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'noCommentFound',
        },
      });
    }

    return comments;
  }

  async findByContent(contentId: string): Promise<Comment[]> {
    Validators.validateId(contentId, 'Content');
    const comments = await this.commentModel
      .find({ content_id: contentId, comment_id: { $exists: false } })
      .populate('user_id', 'username')
      .exec();

    if (comments.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'noCommentFound',
        },
      });
    }

    return comments;
  }

  async findReplies(commentId: string): Promise<Comment[]> {
    Validators.validateId(commentId, 'Comment');
    const replies = await this.commentModel
      .find({ comment_id: commentId })
      .populate('user_id', 'username')
      .exec();

    if (replies.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'noReplyFound',
        },
      });
    }

    return replies;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    Validators.validateId(id, 'Unit');
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .exec();

    if (!updatedComment) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'commentNotFound',
        },
      });
    }

    return updatedComment;
  }

  async delete(id: string): Promise<void> {
    Validators.validateId(id, 'Unit');
    const comment = await this.findById(id);

    if (comment.comment_id) {
      await this.removeReference(comment.comment_id.toString(), id);
    }

    await this.commentModel
      .updateMany({ comment_id: id }, { $unset: { comment_id: '' } })
      .exec();
    const deletedComment = await this.commentModel.findByIdAndDelete(id).exec();

    if (!deletedComment) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'commentNotFound',
        },
      });
    }
  }

  private async addReference(
    commentId: string,
    referenceId: string,
  ): Promise<void> {
    Validators.validateId(commentId, 'Comment');
    Validators.validateId(referenceId, 'Reference');
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(commentId, { $push: { references: referenceId } })
      .exec();

    if (!updatedComment) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'commentNotFound',
        },
      });
    }
  }

  private async removeReference(
    commentId: string,
    referenceId: string,
  ): Promise<void> {
    Validators.validateId(commentId, 'Comment');
    Validators.validateId(referenceId, 'Reference');
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(commentId, { $pull: { references: referenceId } })
      .exec();

    if (!updatedComment) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'commentNotFound',
        },
      });
    }
  }
}
