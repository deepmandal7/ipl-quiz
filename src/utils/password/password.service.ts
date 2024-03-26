import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcryptjs';
import * as randomString from 'randomstring';

@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}

  get bcryptSaltRounds(): string {
    return this.configService.get('bcrypt_salt_or_round');
  }

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, this.bcryptSaltRounds);
  }

  async generatePassword() {
    let randomAlphanumericString = '';
    let isMatch = false;
    let attempts = 0;

    while (!isMatch && attempts < 100) {
      randomAlphanumericString = randomString.generate({
        length: 8,
        charset: 'alphanumeric',
      });

      const specialCharIndex = Math.floor(Math.random() * 8);
      const specialChar = '!@#$%^&*()_+=[\\]{}|;:,.<>?/'.charAt(
        Math.floor(Math.random() * 23),
      );
      randomAlphanumericString =
        randomAlphanumericString.slice(0, specialCharIndex) +
        specialChar +
        randomAlphanumericString.slice(specialCharIndex);

      isMatch =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\;',./<>?])[A-Za-z\d!@#$%^&*()_+=[\]{}|\\;',./<>?]{8,}$/.test(
          randomAlphanumericString,
        );
      attempts++;
    }
    return isMatch ? randomAlphanumericString : null;
  }
}
