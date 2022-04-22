export const registerMutation = `
mutation RegisterUser($options: UserCreationInput!) {
  register(options: $options) {
    user {
      username
      email
      displayName
      avatar
    }
    errors {
      field
      message
    }
  }
}`;

export const addFriendMutation = `
  mutation AddFriend($username: String!, $friend: String) {
    update(username: $username, friend: $friend) {
      user {
        friends {
          username
          displayName
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const sendFriendInvitationMutation = `
  mutation sendFriendInvitation($message: String!, $to: String!, $from: String!) {
    sendFriendInvitation(message: $message, to: $to, from: $from) {
      user {
        invitations {
          to {
            username
            displayName
          }
          from
          fromEmail
          message
          invitationType
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const deleteFriendInvitation = `
  mutation DeleteFriendInvitation($to: String!, $from: String!) {
    deleteFriendInvitation(to: $to, from: $from)
  } 
`;