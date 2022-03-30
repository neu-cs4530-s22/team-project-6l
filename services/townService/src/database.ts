import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";
import mikroOrmConfig from "./mikro-orm.config";

const initDatabase = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  return orm;
}

export default initDatabase;