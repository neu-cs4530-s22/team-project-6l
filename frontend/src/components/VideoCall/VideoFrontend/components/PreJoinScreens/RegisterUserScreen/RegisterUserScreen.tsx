import {
  Button, FormControl, FormLabel, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  useDisclosure, Image, Stack, Box, RadioGroup, Radio, useRadio, chakra, useRadioGroup
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { User, useRegisterUserMutation } from "../../../../../../generated/graphql";
import { Avatar } from "../../../../../../generated/graphql"
import BubbleGum from "avatars/BubbleGum.jpg"
import ThreeSixty from "avatars/ThreeSixty.jpg";
import Dragon from "avatars/Dragon.jpg";
import Monkey from "avatars/Monkey.jpg";
import OrangeBlackSkull from "avatars/OrangeBlackSkull.jpg";
import SmileyFace from "avatars/SmileyFace.jpg";
import Panda from "avatars/Panda.jpg";
import Dog from "avatars/Dog.jpg";
import useCoveyAppState from "hooks/useCoveyAppState";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import useUserAccount from "hooks/useUserAccount";

interface RegisterUserScreenProps {
}

const avatarsTopRow = [
  { name: Avatar.BubbleGum, image: BubbleGum },
  { name: Avatar.ThreeSixty, image: ThreeSixty },
  { name: Avatar.Dog, image: Dog },
  { name: Avatar.Dragon, image: Dragon },
]

const avatarsBottomRow = [
  { name: Avatar.Monkey, image: Monkey },
  { name: Avatar.OrangeBlackSkull, image: OrangeBlackSkull },
  { name: Avatar.SmileyFace, image: SmileyFace },
  { name: Avatar.Panda, image: Panda },
]

export default function RegisterUserScreen({ }: RegisterUserScreenProps) {
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
          p={1.5}
        >
          <Image src={avatar} boxSize='75px' objectFit='cover' {...getLabelProps()} />
        </Box>
      </chakra.label>
    )
  }

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const [, register] = useRegisterUserMutation();
  const { userDispatch } = useUserAccount();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  const auth = getAuth();
  onAuthStateChanged(auth, user => {
    if (user) {
      setEmail(user.email!);
    }
  });

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: Avatar.Dog,

  })

  const handleSubmit = async (e: any) => {
    // use to prevent submitting a request before hand. done input sanitizing
    e.preventDefault();

    const response = await register({
      options: {
        avatar: Avatar[value as keyof typeof Avatar],
        displayName: displayName,
        email: email,
        username: username
      }
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
      }
    });

    // const doesUserAlreadyExist = response.register.errors?.map((err) => err.field === 'username');

    // console.log(doesUserAlreadyExist);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='xl'
    >
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
              <FormLabel>Username</FormLabel>
              <Input placeholder='Username' onChange={e => setUsername(e.currentTarget.value)} />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Display Name</FormLabel>
              <Input placeholder='Display name' onChange={e => setDisplayName(e.currentTarget.value)} />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Avatar</FormLabel>

              <Stack direction='column' align={"center"} {...getRootProps()} spacing={"5"}>
                <Stack direction='row' spacing={"7"} wrap={"wrap"} align={"center"}>
                  {avatarsTopRow.map((avatar) => {
                    return (
                      <AvatarRadio
                        key={avatar.name}
                        avatar={avatar.image}
                        {...getRadioProps({ value: avatar.name })}
                      />
                    )
                  })}

                </Stack>
                <Stack direction='row' spacing={"7"} wrap={"wrap"} align={"center"}>
                  {avatarsBottomRow.map((avatar) => {
                    return (
                      <AvatarRadio
                        key={avatar.name}
                        avatar={avatar.image}
                        {...getRadioProps({ value: avatar.name })}
                      />
                    )
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
  )
};