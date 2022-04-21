import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
  Stack,
  Box,
  RadioGroup,
  Radio,
  useRadio,
  chakra,
  useRadioGroup,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import {
  InvitationMessage,
  User,
  useRegisterUserMutation,
} from '../../../../../../generated/graphql';
import { Avatar } from '../../../../../../generated/graphql';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useUserAccount from 'hooks/useUserAccount';

interface RegisterUserScreenProps {}

const avatarsTop = Object.values(Avatar).map(value => {
  return { name: value, image: `/avatars/${value}.jpg` };
});

export default function RegisterUserScreen({}: RegisterUserScreenProps) {
  const { userState, userDispatch } = useUserAccount();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: Avatar.Dog,
  });
  const [, register] = useRegisterUserMutation();

  useEffect(() => {
    if (!userState.displayName) {
      onOpen();
    } else {
      onClose();
    }
  }, [userState]);

  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
  function AvatarRadio(props: any) {
    const { avatar, ...radioProps } = props;
    const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
      useRadio(radioProps);

    return (
      <chakra.label {...htmlProps} cursor='pointer'>
        <input {...getInputProps({})} hidden />
        <Box
          boxSize='85px'
          {...getCheckboxProps()}
          bg={state.isChecked ? 'green.300' : 'transparent'}
          p={1.5}>
          <Image src={avatar} boxSize='75px' objectFit='cover' {...getLabelProps()} />
        </Box>
      </chakra.label>
    );
  }

  const auth = getAuth();
  onAuthStateChanged(auth, user => {
    if (user) {
      setEmail(user.email!);
    }
  });

  const handleSubmit = async (e: any) => {
    // use to prevent submitting a request before hand. done input sanitizing
    e.preventDefault();

    const response = await register({
      options: {
        avatar: Avatar[value as keyof typeof Avatar],
        displayName: displayName,
        email: email,
        username: email,
      },
    });

    userDispatch({
      action: 'registerUser',
      data: {
        _id: response.data?.register.user?._id!,
        email: response.data?.register.user?.email!,
        avatar: response.data?.register.user?.avatar!,
        createdAt: response.data?.register.user?.createdAt!,
        lastOnline: response.data?.register.user?.lastOnline!,
        displayName: response.data?.register.user?.displayName!,
        username: response.data?.register.user?.username!,
        friends: new Array<User>(),
        invitations: new Array<InvitationMessage>(),
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='xl'
      closeOnOverlayClick={false}
      closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create your account</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input value={email} isReadOnly />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Display Name</FormLabel>
              <Input
                placeholder='Display name'
                onChange={e => setDisplayName(e.currentTarget.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Avatar</FormLabel>

              <Stack direction='column' align={'center'} {...getRootProps()} spacing={'5'}>
                <Stack direction='row' spacing={'7'} wrap={'wrap'} align={'center'}>
                  {avatarsTop.slice(0, 4).map(avatar => {
                    return (
                      <AvatarRadio
                        key={avatar.name}
                        avatar={avatar.image}
                        {...getRadioProps({ value: avatar.name })}
                      />
                    );
                  })}
                </Stack>
                <Stack direction='row' spacing={'7'} wrap={'wrap'} align={'center'}>
                  {avatarsTop.slice(4, avatarsTop.length).map(avatar => {
                    return (
                      <AvatarRadio
                        key={avatar.name}
                        avatar={avatar.image}
                        {...getRadioProps({ value: avatar.name })}
                      />
                    );
                  })}
                </Stack>
              </Stack>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} type='submit' onClick={onClose}>
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
