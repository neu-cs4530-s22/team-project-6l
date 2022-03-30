import { Migration } from '@mikro-orm/migrations';

export class Migration20220330023402 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("_id" serial primary key, "created_at" timestamptz(0) not null, "last_online" timestamptz(0) not null, "email" varchar(255) not null, "username" varchar(255) not null, "display_name" varchar(255) not null, "avatar" text check ("avatar" in (\'path1\', \'path2\', \'path3\', \'path4\', \'path5\', \'path6\')) not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('create table "user_friends" ("user_1__id" int not null, "user_2__id" int not null);');
    this.addSql('alter table "user_friends" add constraint "user_friends_pkey" primary key ("user_1__id", "user_2__id");');

    this.addSql('alter table "user_friends" add constraint "user_friends_user_1__id_foreign" foreign key ("user_1__id") references "user" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "user_friends" add constraint "user_friends_user_2__id_foreign" foreign key ("user_2__id") references "user" ("_id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_friends" drop constraint "user_friends_user_1__id_foreign";');

    this.addSql('alter table "user_friends" drop constraint "user_friends_user_2__id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "user_friends" cascade;');
  }

}
