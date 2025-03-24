import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  // UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
import { ContentsService } from './contents.service'
import { CreateContentDto } from './dto/create-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'teacher')
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
  async create(@Body() createContentDto: CreateContentDto, @UploadedFile() file) {
    if (file) {
      createContentDto.file = `uploads/contents/${file.filename}`
    }
    return this.contentsService.create(createContentDto)
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('unitId') unitId?: string) {
    if (unitId) {
      return this.contentsService.findByUnit(unitId)
    }
    return this.contentsService.findAll()
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentsService.findById(id)
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'teacher')
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
  async update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto, @UploadedFile() file) {
    if (file) {
      updateContentDto.file = `uploads/contents/${file.filename}`
    }
    return this.contentsService.update(id, updateContentDto)
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'teacher')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentsService.remove(id)
  }

  // @UseGuards(JwtAuthGuard)
  @Post(':id/comments/:commentId')
  addComment(@Param('id') id: string, @Param('commentId') commentId: string) {
    return this.contentsService.addComment(id, commentId)
  }
}
