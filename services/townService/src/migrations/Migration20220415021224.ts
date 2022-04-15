import { Migration } from '@mikro-orm/migrations';

export default class Migration20220415021224 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "invitation_message" drop constraint "invitation_message_to__id_foreign";');

    this.addSql('alter table "invitation_message" drop constraint "invitation_message_pkey";');
    this.addSql('alter table "invitation_message" drop column "_id";');
    this.addSql('alter table "invitation_message" add constraint "invitation_message_to__id_foreign" foreign key ("to__id") references "user" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "invitation_message" add constraint "invitation_message_pkey" primary key ("to__id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "invitation_message" drop constraint "invitation_message_to__id_foreign";');

    this.addSql('alter table "invitation_message" add column "_id" int4 not null default null;');
    this.addSql('alter table "invitation_message" drop constraint "invitation_message_pkey";');
    this.addSql('alter table "invitation_message" add constraint "invitation_message_to__id_foreign" foreign key ("to__id") references "user" ("_id") on update cascade on delete no action;');
    this.addSql('alter table "invitation_message" add constraint "invitation_message_pkey" primary key ("to__id", "_id");');
  }

}
