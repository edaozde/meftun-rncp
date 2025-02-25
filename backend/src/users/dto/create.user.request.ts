import { IsEmail, IsStrongPassword, IsBoolean } from 'class-validator';

export class CreateUserRequest {
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @IsStrongPassword()
  password: string;

  @IsBoolean({
    message: 'Vous devez accepter la politique de confidentialité.',
  })
  acceptedPrivacyPolicy: boolean;
}
