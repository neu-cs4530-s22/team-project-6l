import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import UserFactory from '../factories/UserFactory';

export default class UserSeeder extends Seeder {
  private _seeder = '';

  async run(_em: EntityManager): Promise<void> {
    this._seeder = 'User';
    new UserFactory(_em).make(5);
  }

}
