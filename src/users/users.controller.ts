import { Controller, Get, Post, Body, Patch, Param, Delete, SerializeOptions, HttpCode, HttpStatus } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { Roles } from '../roles/roles.decorator'
import { RoleEnum } from '../roles/roles.enum'
import { User } from './schemas/user.schema'
// import { RolesGuard } from 'src/roles/roles.guard'
// import { AuthGuard } from 'src/auth/auth.guard'

@ApiBearerAuth()
@Roles(RoleEnum.admin)
// @UseGuards(AuthGuard, RolesGuard)
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    return this.usersService.create(createProfileDto)
  }

  @Get()
  async findAll() {
    return this.usersService.findAll() // Chama o método findAll para retornar todos os usuários sem a senha
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id)
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    return this.usersService.update(id, updateProfileDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id)
  }
}
