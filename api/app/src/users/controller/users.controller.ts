import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Put,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuardLocal } from '../../auth/auth.guard';
import { JWTExceptionFilter } from '../../exception/jwt.filter';
import { AuthService } from '../../auth/auth.service';
import { add } from 'winston';

@UseGuards(AuthGuardLocal)
@SetMetadata('roles', ['admin'])
@Controller('api/users')
export class UsersController {
  private readonly logger: Logger;
  constructor(private users: UsersService, private auth: AuthService) {
    this.logger = new Logger();
  }

  @Get()
  findOne() {
    return this.users.findAll();
  }

  // getJoin() {
  //     // return [1, 2, 3];
  //     return this.users.findJoin();
  // }

  @Get()
  getAll() {
    // return [1, 2, 3];
    return this.users.findAll();
  }

  //분리 ???
  @Get('/my')
  @HttpCode(200)
  @Header('Access-Control-Allow-Origin', 'https://gilee.click')
  @Header('Access-Control-Allow-Credentials', 'true')
  getOne(@Req() request: Request, @Param('id') tid: string) {
    const intra = this.auth.getIntra(this.auth.extractToken(request, 'http'));
    // + achievement;
    return this.users.findByIntra(intra);
  }

  @Get('/my/friends')
  @HttpCode(200)
  @Header('Access-Control-Allow-Origin', 'https://gilee.click')
  @Header('Access-Control-Allow-Credentials', 'true')
  findFriend(@Req() request: Request) {
    const intra = this.auth.getIntra(this.auth.extractToken(request, 'http'));
    // return this.users.findByIntra(intra);
    return this.users.findFriend(intra);
  }

  // @Get('/my/Isfriends') // Post
  @Post()
  @HttpCode(201)
  @Header('Access-Control-Allow-Origin', 'https://gilee.click')
  @Header('Access-Control-Allow-Credentials', 'true')
  IsFriend(@Body('intra') addIntra: string, @Req() request: Request): string {
    const intra = this.auth.getIntra(this.auth.extractToken(request, 'http'));
    // return this.users.findByIntra(intra);
    this.users.addmyfriend(intra, addIntra);
    return addIntra;
  }

  @Put()
  @HttpCode(201)
  @Header('Access-Control-Allow-Origin', 'https://gilee.click')
  @Header('Access-Control-Allow-Credentials', 'true')
  editMyNick(
    @Body('nick') editNick: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const intra = this.auth.getIntra(this.auth.extractToken(req, 'http'));
    return this.users.editNick(intra, editNick);
  }

  @Put('/avatar/:uuid')
  @HttpCode(204)
  @Header('Access-Control-Allow-Origin', 'https://gilee.click')
  @Header('Access-Control-Allow-Credentials', 'true')
  editMyAvatar(
    @Param('uuid') uuid: string,
    @Req()
    req: Request,
  ) {
    const intra = this.auth.getIntra(this.auth.extractToken(req, 'http'));
    return this.users.updateAvatarByIntra(intra, uuid);
  }

  @Get('/avatar')
  @HttpCode(200)
  @Header('Access-Control-Allow-Origin', 'https://gilee.click')
  @Header('Access-Control-Allow-Credentials', 'true')
  getMyAvatar(
    @Req()
    req: Request,
  ) {
    const intra = this.auth.getIntra(this.auth.extractToken(req, 'http'));
    return this.users
      .findByIntra(intra)
      .then((res) => res.avatar)
      .catch((err) => {
        this.logger.error(err.message);
        this.logger.debug(err);
        return 'default';
      });
  }

  // @Post()
  // @HttpCode(200)
  // @Header('Access-Control-Allow-Origin', 'https://gilee.click')
  // @Header('Access-Control-Allow-Credentials', 'true')
  // addFriend(@Body() body, @Req() request : Request) {
  //   const intra = this.auth.getIntra(this.auth.extractToken(request, 'http'));
  //   // + achievement;
  //   return this.users.addfriend(intra, body);
  // }

  @Get('/:id')
  @HttpCode(200)
  @Header('Access-Control-Allow-Origin', 'https://gilee.click')
  @Header('Access-Control-Allow-Credentials', 'true')
  getOther(@Param('id') tid: string) {
    // const intra = this.auth.getIntra(this.auth.extractToken(request, 'http'));
    return this.users.findByIntra(tid);
  }

  // @Get('')
  // getJoin(@Param('id') tid : number) {
  //     return this.users.findJoin(tid);
  // }

  // @Post()
  // create(@Body() body: any) {
  //   // return body;
  //   return this.users.create(body);
  // }

  // @Put(':id')
  // update(@Param('id') tid: number, @Body() body: any) {
  //   // return body;
  //   return this.users.update(tid, body);
  // }

  // @Delete(':id')
  // delete(@Param('id') tid: number) {
  //   // return true;
  //   return this.users.delete(tid);
  // }
}
