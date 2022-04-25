import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../mikro-orm.config';

const testConn = async (): Promise<MikroORM> => {
  const testMikroOrmConfig = {
    ...mikroOrmConfig,
    clientUrl: process.env.DATABASE_URL,
    debug: false,
  };
  const orm = await MikroORM.init(testMikroOrmConfig);
  return orm;
};

export default testConn;
