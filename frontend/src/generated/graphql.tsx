import gql from 'graphql-tag';
import * as Urql from 'urql';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** File name for avatar image */
export enum Avatar {
  BubbleGum = 'BubbleGum',
  Dog = 'Dog',
  Dragon = 'Dragon',
  Monkey = 'Monkey',
  OrangeBlackSkull = 'OrangeBlackSkull',
  Panda = 'Panda',
  SmileyFace = 'SmileyFace',
  ThreeSixty = 'ThreeSixty',
}

/** Describes the field causing the error along with an error message */
export type FieldError = {
  __typename?: 'FieldError';
  /** The field that is causing the error */
  field: Scalars['String'];
  /** Detailed message regarding error */
  message: Scalars['String'];
};

export type InvitationMessage = {
  __typename?: 'InvitationMessage';
  /** Unique identifier for user */
  _id: Scalars['ID'];
  /** Friendly display name of invitation sender */
  from: Scalars['String'];
  /** Email of the invitation sender */
  fromEmail: Scalars['String'];
  /** Type of invitation */
  invitationType: InvitationType;
  /** Message to display the receiver of invitation */
  message: Scalars['String'];
  /** User that is sending the invitation */
  to: User;
};

/** Type of invitation (friend, town join) */
export enum InvitationType {
  Friend = 'Friend',
  TownJoin = 'TownJoin',
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Delete a user */
  delete: Scalars['Boolean'];
  /** Delete pending invitation */
  deleteFriendInvitation: Scalars['Boolean'];
  /** Create a new user */
  register: UserResponse;
  /** Send friend invitation to another user */
  sendFriendInvitation?: Maybe<UserResponse>;
  /** Update a user's avatar and/or add a friend */
  update?: Maybe<UserResponse>;
};

export type MutationDeleteArgs = {
  username: Scalars['String'];
};

export type MutationDeleteFriendInvitationArgs = {
  from: Scalars['String'];
  to: Scalars['String'];
};

export type MutationRegisterArgs = {
  options: UserCreationInput;
};

export type MutationSendFriendInvitationArgs = {
  from: Scalars['String'];
  message: Scalars['String'];
  to: Scalars['String'];
};

export type MutationUpdateArgs = {
  avatar?: InputMaybe<Avatar>;
  friend?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** Get a user with a given username */
  user?: Maybe<User>;
  /** Get all users */
  users: Array<User>;
};

export type QueryUserArgs = {
  username: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  /** Unique identifier for user */
  _id: Scalars['ID'];
  /** Name of the file containting avatar image */
  avatar: Avatar;
  /** The user's creation datetime */
  createdAt: Scalars['String'];
  /** The name to display when connected to a town */
  displayName: Scalars['String'];
  /** The user's email */
  email: Scalars['String'];
  /** List of the user's friends */
  friends: Array<User>;
  /** List of pending invitations */
  invitations: Array<InvitationMessage>;
  /** Time the user was last online */
  lastOnline: Scalars['String'];
  /** The user's unique username */
  username: Scalars['String'];
};

/** Contains the necessary data to create a user */
export type UserCreationInput = {
  /** The selected avatar */
  avatar: Avatar;
  /** Name to be displayed in the frontend */
  displayName: Scalars['String'];
  /** Email that is registered to user */
  email: Scalars['String'];
  /** The new user's username */
  username: Scalars['String'];
};

/** If no errors, returns the user. Otherwise, return the error alongside null for user */
export type UserResponse = {
  __typename?: 'UserResponse';
  /** A list of FieldErrors */
  errors?: Maybe<Array<FieldError>>;
  /** The resulting user if no errors were returned */
  user?: Maybe<User>;
};

export type AddFriendMutationVariables = Exact<{
  username: Scalars['String'];
  friend?: InputMaybe<Scalars['String']>;
}>;

export type AddFriendMutation = {
  __typename?: 'Mutation';
  update?: {
    __typename?: 'UserResponse';
    user?: {
      __typename?: 'User';
      username: string;
      friends: Array<{ __typename?: 'User'; username: string }>;
    } | null;
  } | null;
};

export type DeleteFriendInvitationMutationVariables = Exact<{
  to: Scalars['String'];
  from: Scalars['String'];
}>;

export type DeleteFriendInvitationMutation = {
  __typename?: 'Mutation';
  deleteFriendInvitation: boolean;
};

export type GetFriendInvitationsQueryVariables = Exact<{
  username: Scalars['String'];
}>;

export type GetFriendInvitationsQuery = {
  __typename?: 'Query';
  user?: {
    __typename?: 'User';
    invitations: Array<{
      __typename?: 'InvitationMessage';
      from: string;
      fromEmail: string;
      message: string;
      invitationType: InvitationType;
      to: { __typename?: 'User'; username: string; displayName: string };
    }>;
  } | null;
};

export type RegisterUserMutationVariables = Exact<{
  options: UserCreationInput;
}>;

export type RegisterUserMutation = {
  __typename?: 'Mutation';
  register: {
    __typename?: 'UserResponse';
    user?: {
      __typename?: 'User';
      _id: string;
      username: string;
      createdAt: string;
      lastOnline: string;
      email: string;
      displayName: string;
      avatar: Avatar;
      friends: Array<{ __typename?: 'User'; username: string }>;
    } | null;
    errors?: Array<{ __typename?: 'FieldError'; field: string; message: string }> | null;
  };
};

export type SendFriendInvitationMutationVariables = Exact<{
  message: Scalars['String'];
  to: Scalars['String'];
  from: Scalars['String'];
}>;

export type SendFriendInvitationMutation = {
  __typename?: 'Mutation';
  sendFriendInvitation?: {
    __typename?: 'UserResponse';
    user?: { __typename?: 'User'; displayName: string } | null;
    errors?: Array<{ __typename?: 'FieldError'; field: string; message: string }> | null;
  } | null;
};

export type GetUserQueryVariables = Exact<{
  username: Scalars['String'];
}>;

export type GetUserQuery = {
  __typename?: 'Query';
  user?: {
    __typename?: 'User';
    _id: string;
    displayName: string;
    avatar: Avatar;
    createdAt: string;
    lastOnline: string;
    email: string;
    username: string;
    friends: Array<{ __typename?: 'User'; username: string }>;
    invitations: Array<{
      __typename?: 'InvitationMessage';
      from: string;
      fromEmail: string;
      message: string;
      invitationType: InvitationType;
    }>;
  } | null;
};

export const AddFriendDocument = gql`
  mutation AddFriend($username: String!, $friend: String) {
    update(username: $username, friend: $friend) {
      user {
        username
        friends {
          username
        }
      }
    }
  }
`;

export function useAddFriendMutation() {
  return Urql.useMutation<AddFriendMutation, AddFriendMutationVariables>(AddFriendDocument);
}
export const DeleteFriendInvitationDocument = gql`
  mutation DeleteFriendInvitation($to: String!, $from: String!) {
    deleteFriendInvitation(to: $to, from: $from)
  }
`;

export function useDeleteFriendInvitationMutation() {
  return Urql.useMutation<DeleteFriendInvitationMutation, DeleteFriendInvitationMutationVariables>(
    DeleteFriendInvitationDocument,
  );
}
export const GetFriendInvitationsDocument = gql`
  query GetFriendInvitations($username: String!) {
    user(username: $username) {
      invitations {
        from
        fromEmail
        message
        invitationType
        to {
          username
          displayName
        }
      }
    }
  }
`;

export function useGetFriendInvitationsQuery(
  options: Omit<Urql.UseQueryArgs<GetFriendInvitationsQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetFriendInvitationsQuery>({
    query: GetFriendInvitationsDocument,
    ...options,
  });
}
export const RegisterUserDocument = gql`
  mutation RegisterUser($options: UserCreationInput!) {
    register(options: $options) {
      user {
        _id
        username
        createdAt
        lastOnline
        email
        displayName
        avatar
        friends {
          username
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export function useRegisterUserMutation() {
  return Urql.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(
    RegisterUserDocument,
  );
}
export const SendFriendInvitationDocument = gql`
  mutation sendFriendInvitation($message: String!, $to: String!, $from: String!) {
    sendFriendInvitation(message: $message, to: $to, from: $from) {
      user {
        displayName
      }
      errors {
        field
        message
      }
    }
  }
`;

export function useSendFriendInvitationMutation() {
  return Urql.useMutation<SendFriendInvitationMutation, SendFriendInvitationMutationVariables>(
    SendFriendInvitationDocument,
  );
}
export const GetUserDocument = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      _id
      displayName
      avatar
      createdAt
      lastOnline
      email
      username
      friends {
        username
      }
      invitations {
        from
        fromEmail
        message
        invitationType
      }
    }
  }
`;

export function useGetUserQuery(options: Omit<Urql.UseQueryArgs<GetUserQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserQuery>({ query: GetUserDocument, ...options });
}
