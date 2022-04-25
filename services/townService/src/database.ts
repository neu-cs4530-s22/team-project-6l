import { Configuration, Connection, IDatabaseDriver, MikroORM, Options } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';

async function initDatabase(
  config?: Configuration | Options,
): Promise<MikroORM<IDatabaseDriver<Connection>>> {
  if (config === undefined) {
    config = mikroOrmConfig;
  }
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();

  return orm;
}

export default initDatabase;
