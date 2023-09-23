import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { ShowUserDto } from 'src/users/dtos/show-user.dto';

export class SerializerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run someting before the reuest is handled
    // by the request handler
    console.log('I am running before the handler ', context);

    return next.handle().pipe(
      map((data: any) => {
        // Run something before the rsponse is sent out
        console.log('Im running before the response is sent out', data);
        return plainToClass(ShowUserDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
