import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import UserFactory from '../factories/UserFactory';

export default class UserSeeder extends Seeder {
  // eslint-disable-next-line class-methods-use-this
  async run(_em: EntityManager): Promise<void> {
    new UserFactory(_em).make(5);
  }

}
