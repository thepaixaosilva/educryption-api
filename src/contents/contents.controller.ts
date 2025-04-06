import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, Query, HttpCode, HttpStatus, SerializeOptions, UseGuards } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ContentsService } from './contents.service'
import { CreateContentDto } from './dto/create-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Content } from './schemas/content.schema'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Contents')
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/contents',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
    })
  )
  @ApiOperation({
    summary: 'Create new content',
    description: 'Creates a new content with the provided data.',
  })
  @ApiBody({
    type: CreateContentDto,
    description: 'Content data transfer object',
  })
  @ApiResponse({
    status: 201,
    description: 'Content created successfully',
    type: Content,
  })
  @ApiResponse({
    status: 422,
    description: 'Data failed validation',
  })
  async create(@Body() createContentDto: CreateContentDto, @UploadedFile() file): Promise<Content> {
    if (file) {
      createContentDto.file = `uploads/contents/${file.filename}`
    }
    return this.contentsService.create(createContentDto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all contents',
    description: 'Retrieves a list of all contents with their details.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all contents retrieved successfully',
    type: [Content],
  })
  @ApiResponse({
    status: 404,
    description: 'No content found',
  })
  findAll(@Query('unitId') unitId?: string): Promise<Content[]> {
    if (unitId) {
      return this.contentsService.findByUnit(unitId)
    }
    return this.contentsService.findAll()
  }

  @Get(':id')
  @ApiOkResponse({
    type: Content,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get content by ID',
    description: 'Retrieves a specific content by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Content ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Content found',
    type: Content,
  })
  @ApiResponse({
    status: 404,
    description: 'Content not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid content ID',
  })
  findOne(@Param('id') id: string): Promise<Content> {
    return this.contentsService.findById(id)
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/contents',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
    })
  )
  @ApiOkResponse({
    type: Content,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiOperation({
    summary: 'Update content',
    description: "Updates a content's information by its ID.",
  })
  @ApiParam({
    name: 'id',
    description: 'Content ID to update',
    type: String,
  })
  @ApiBody({
    type: UpdateContentDto,
    description: 'Updated content data',
  })
  @ApiResponse({
    status: 200,
    description: 'Content updated successfully',
    type: Content,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid content ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Content not found',
  })
  async update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto, @UploadedFile() file): Promise<Content> {
    if (file) {
      updateContentDto.file = `uploads/contents/${file.filename}`
    }
    return this.contentsService.update(id, updateContentDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Content ID to delete',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove content',
    description: 'Removes a content from the system by its ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'Content removed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid content ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Content not found',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.contentsService.remove(id)
  }

  @Post(':id/comments/:commentId')
  @ApiOperation({
    summary: 'Add comment to content',
    description: 'Adds a comment to a specific content.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Content ID to add comment to',
  })
  @ApiParam({
    name: 'commentId',
    type: String,
    description: 'Comment ID to be added',
  })
  @ApiResponse({
    status: 201,
    description: 'Comment added successfully',
    type: Content,
  })
  @ApiResponse({
    status: 422,
    description: 'Data failed validation',
  })
  addComment(@Param('id') id: string, @Param('commentId') commentId: string): Promise<Content> {
    return this.contentsService.addComment(id, commentId)
  }
}
