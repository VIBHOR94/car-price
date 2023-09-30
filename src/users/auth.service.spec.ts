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
    const users: User[] = [];
    fakeUserService = {
      find: async (email: string) => {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.ceil(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
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
    await service.signup('asac@ass.com', 'adad');
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
    await service.signup('abc@example.com', 'some_password');
    await expect(
      service.signin('abc@example.com', 'adadafaf'),
    ).rejects.toThrowError(BadRequestException);
  });

  it('signsin if user signs in with an email and password that is correct', async () => {
    await service.signup('asdaa@aa.com', 'my_password_123');
    await expect(
      service.signin('asdaa@aa.com', 'my_password_123'),
    ).resolves.toBeDefined();
  });
});
