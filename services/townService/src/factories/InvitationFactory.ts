import { Factory, Faker } from '@mikro-orm/seeder';
import InvitationMessage from '../types/InvitationMessage';
import InvitationType from '../types/InvitationType';

export default class InvitaitonFactory extends Factory<InvitationMessage> {
  model = InvitationMessage;

  // eslint-disable-next-line class-methods-use-this
  protected definition(_faker: Faker): Partial<InvitationMessage> {
    return {
      _id: _faker.datatype.number(999),
      from: _faker.internet.userName(),
      fromEmail: _faker.internet.email(),
      message: 'hello friend',
      invitationType: InvitationType.Friend,
    };
  }
}