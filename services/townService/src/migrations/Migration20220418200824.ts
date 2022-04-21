import { Migration } from '@mikro-orm/migrations';

export default class Migration20220418200824 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "invitation_message" ("_id" serial primary key, "to__id" int not null, "from" varchar(255) not null, "from_email" varchar(255) not null, "message" varchar(255) not null default \'\', "invitation_type" smallint not null);',
    );

    this.addSql(
      'alter table "invitation_message" add constraint "invitation_message_to__id_foreign" foreign key ("to__id") references "user" ("_id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "invitation_message" cascade;');
  }
}
