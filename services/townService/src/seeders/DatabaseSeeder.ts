import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import UserFactory from '../factories/UserFactory';

export default class DatabaseSeeder extends Seeder {
  private _seeder = '';

  async run(_em: EntityManager): Promise<void> {
    this._seeder = 'Database';
    new UserFactory(_em).make(5);
  }
}
