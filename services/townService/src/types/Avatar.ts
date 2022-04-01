import { registerEnumType } from 'type-graphql';

/**
 *  Enum to represent the file path of the selected avatar image
 * */
enum Avatar {
  Dog = 'Dog',
  ThreeSixty = 'ThreeSixty',
  BubbleGum = 'BubbleGum',
  Dragon = 'Dragon',
  Monkey = 'Monkey',
  OrangeBlackSkull = 'OrangeBlackSkull',
  SmileyFace = 'SmileyFace',
  Panda = 'Panda',
}

registerEnumType(Avatar, {
  name: 'Avatar',
  description: 'File name for avatar image',
});

export default Avatar;
