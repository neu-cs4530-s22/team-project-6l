import { Migration } from '@mikro-orm/migrations';

export default class Migration20220413030737 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "friend_invitations" text[] not null default \'{}\';',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "friend_invitations";');
  }
}
