import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import InvitaitonFactory from '../factories/InvitationFactory';

export default class InvitationSeeder extends Seeder {
  // eslint-disable-next-line class-methods-use-this
  async run(_em: EntityManager): Promise<void> {
    new InvitaitonFactory(_em).make(5);
  }

}
