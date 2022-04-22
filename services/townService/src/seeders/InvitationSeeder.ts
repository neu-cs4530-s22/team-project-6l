import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import InvitaitonFactory from '../factories/InvitationFactory';

export default class InvitationSeeder extends Seeder {
  private _seeder = '';

  async run(_em: EntityManager): Promise<void> {
    this._seeder = 'InvitationMessage';

    new InvitaitonFactory(_em).make(5);
  }

}
