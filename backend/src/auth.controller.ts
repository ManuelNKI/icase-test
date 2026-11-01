import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('auth/login') @HttpCode(200) login(@Body() body: any, @Req() req: any) { return this.auth.core.login(body?.email, body?.password, req.ip); }
  @Post('auth/register') register(@Body() body: any, @Req() req: any) { return this.auth.core.register(body, req.ip); }
  @Get('auth/me') me(@Req() req: any) { return { usuario: this.auth.core.publicUser(req.user), permisos: this.auth.core.permissionsOf(req.user) }; }
  @Get('users') users() { return this.auth.core.users.list(); }
  @Post('users') createUser(@Body() body: any) { return this.auth.core.users.create(body); }
  @Patch('users/:id') async updateUser(@Param('id') id: string, @Body() body: any) {
    const user = await this.auth.core.users.update(id, body);
    if (!user) throw new NotFoundException('Usuario inexistente');
    return user;
  }
  @Delete('users/:id') async removeUser(@Param('id') id: string, @Req() req: any) {
    const removed = await this.auth.core.users.remove(id, req.user);
    if (!removed) throw new NotFoundException('Usuario inexistente');
    return { deleted: true, id };
  }
}
