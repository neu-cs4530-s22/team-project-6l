import { Factory, Faker } from '@mikro-orm/seeder';
import Avatar from '../types/Avatar';
import User from '../types/User';

export default class UserFactory extends Factory<User> {
  model = User;

  private _factory = '';

  protected definition(_faker: Faker): Partial<User> {
    this._factory = 'User';
    const email = _faker.internet.email();
    return {
      displayName: _faker.internet.userName(),
      email,
      avatar: Avatar.Dog,
      username: email,
      createdAt: new Date(Date.now()),
      lastOnline: new Date(Date.now()),
    };
  }
}
