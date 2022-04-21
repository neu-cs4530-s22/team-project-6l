import { registerEnumType } from 'type-graphql';

enum InvitationType {
  Friend,
  TownJoin,
}


registerEnumType(InvitationType, {
  name: 'InvitationType',
  description: 'Type of invitation (friend, town join)',
});

export default InvitationType;