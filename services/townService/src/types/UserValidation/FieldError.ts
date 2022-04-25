import { Field, ObjectType } from 'type-graphql';

/**
 * Each FieldError contains the field that is causing the error and a descriptive message.
 * */
@ObjectType({ description: 'Describes the field causing the error along with an error message' })
export default class FieldError {
  /** The field that is causing the error */
  @Field({ description: 'The field that is causing the error' })
  field!: string;

  /** Detailed message about the error */
  @Field({ description: 'Detailed message regarding error' })
  message!: string;
}
