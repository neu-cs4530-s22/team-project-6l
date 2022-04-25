import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import User from '../types/User';

export default class DatabaseContext {
  constructor(private readonly orm: MikroORM) {}

  @UseRequestContext()
  async getUser(username: string): Promise<User | null> {
    const player = await this.orm.em.findOne(
      User,
      { username },
      { populate: ['friends', 'invitations'] },
    );

    return player;
  }
}
