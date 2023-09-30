import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake user service
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with hashed and salted password', async () => {
    const user = await service.signup('asdaa@aa.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error is user signs up with an email that is already in use', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'asac@ass.com',
          password: 'adad',
        } as User,
      ]);

    await expect(service.signup('asac@ass.com', 'adad')).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('throws an error is user signs in with an email that is not present', async () => {
    await expect(
      service.signin('abc@example.com', 'adafadf'),
    ).rejects.toThrowError(NotFoundException);
  });

  it('throws an error is user signs in with a password that is incorrect', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'asac@ass.com',
          password: 'adadafaf',
        } as User,
      ]);
    await expect(
      service.signin('abc@example.com', 'adadafaf'),
    ).rejects.toThrowError(BadRequestException);
  });

  it('signsin if user signs in with an email and password that is correct', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'asac@ass.com',
          password:
            '7d5bbbc09f36de2c.07ec64bfe9e5b18ba1aaa7a271aad521534055584d9d12832078b2313ae305d4',
        } as User,
      ]);
    await expect(
      service.signin('asdaa@aa.com', 'my_password_123'),
    ).resolves.toBeDefined();
  });
});
