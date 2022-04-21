import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import UserFactory from '../factories/UserFactory';

// eslint-disable-next-line import/prefer-default-export
export class DatabaseSeeder extends Seeder {
  // eslint-disable-next-line class-methods-use-this
  async run(_em: EntityManager): Promise<void> {
    new UserFactory(_em).make(5);
  }
}
