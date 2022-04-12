import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';

async function initDatabase(): Promise<MikroORM<IDatabaseDriver<Connection>>> {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  return orm;
}

export default initDatabase;