import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    fakeAuthService = {
      //   signin: () => {},
      //   signup: () => {},
    };

    fakeUserService = {
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'some_password' } as User]),
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'myemail@gmail.com',
          password: 'my_password',
        } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
