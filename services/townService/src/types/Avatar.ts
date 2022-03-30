import { registerEnumType } from 'type-graphql';

/**
 *  Enum to represent the file path of the selected avatar image
 * */
enum Avatar {
  AVATAR_1 = 'path1',
  AVATAR_2 = 'path2',
  AVATAR_3 = 'path3',
  AVATAR_4 = 'path4',
  AVATAR_5 = 'path5',
  AVATAR_6 = 'path6',
}

registerEnumType(Avatar, {
  name: 'Avatar',
  description: 'File name for avatar image',
});

export default Avatar;
