import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

declare module 'express' {
  interface Request {
    userId: string;
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = this.getToken(req);

      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = this.jwtService.verify(token);
      const userId = user.sub;

      if (!userId) {
        throw new UnauthorizedException('Invalid token');
      }

      req.userId = userId;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }

  private getToken(request: Request): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    return authorization.split(' ')[1];
  }
}
