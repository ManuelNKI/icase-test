import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = String(request.originalUrl || request.url).split('?')[0];
    const core = this.auth.core;
    if (!path.startsWith('/api') || core.isPublic(request.method, path)) return true;
    request.user = await core.authenticate(request.headers.authorization);
    core.authorize(request.user, request.method, path);
    return true;
  }
}
