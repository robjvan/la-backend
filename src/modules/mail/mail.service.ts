import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SendMailClient } from 'zeptomail';
import { FORGOT_PASS_TEMPLATE_KEY, WELCOME_TEMPLATE_KEY } from 'src/constants';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new SendMailClient({
  url: process.env.MAIL_RELAY_URL,
  token: process.env.MAIL_RELAY_TOKEN,
});

@Injectable()
export class MailService {
  constructor() {}

  /** Logger instance scoped to MailService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(MailService.name);

  /** Handles common error logging and throwing for service methods. */
  private handleError(error: string, errorMsg: string) {
    this.logger.error(error, errorMsg);
    throw new InternalServerErrorException(error, errorMsg);
  }

  private sendMessage(templateKey: string, toAddress: string, mergeInfo: any) {
    try {
      client
        .sendMailWithTemplate({
          template_key: templateKey,
          from: {
            address: process.env.MAIL_FROM_ADDRESS,
            name: process.env.MAIL_FROM_NAME,
          },
          to: [
            {
              email_address: {
                address: toAddress,
                // address: 'robjvan@gmail.com', // Used for testing
              },
            },
          ],
          merge_info: mergeInfo,
          reply_to: [
            {
              address: process.env.MAIL_REPLY_TO_ADDRESS,
              name: process.env.MAIL_REPLY_TO_NAME,
            },
          ],
        })
        .then((res: any) => console.log('success', res))
        .catch((error: any) => console.error(error));
    } catch (err: any) {
      this.handleError(
        `Filed to send forgot password message to ${toAddress}`,
        err.message,
      );
    }
  }

  /** Sends a confirmation email to the specified email address with the provided token.
   *
   * @param {string} email - The email address to which the confirmation email will be sent.
   * @param {string} token - The token used for confirming the email address.
   * @returns {Promise<any>} A promise representing the result of the email sending process.
   */
  public async sendConfirmEmailMessage(
    email: string,
    token: string,
  ): Promise<any> {
    try {
      console.log(email, token);
      // TODO(RV): Add logic
      return null;
    } catch (err: any) {
      this.handleError(
        `Failed to send "confirm email" message to ${email}`,
        err.message,
      );
    }
  }

  /** Sends a password reset email to the specified email address with the provided token.
   *
   * @param {string} email - The email address to which the password reset email will be sent.
   * @param {string} token - The token used for resetting the password.
   * @returns {Promise<any>} A promise representing the result of the email sending process.
   */
  // async sendForgotPasswordEmail(email: string, token: string): Promise<any> {
  sendForgotPasswordEmail(email: string, token: string): any {
    this.sendMessage(FORGOT_PASS_TEMPLATE_KEY, email, {
      token,
      username: email,
    });
  }

  async sendWelcomeEmail(email: string, token: string) {
    this.sendMessage(WELCOME_TEMPLATE_KEY, email, { username: email, token });
  }

  async sendAccountClosedEmail(email: string) {
    // TODO(RV): Add logic
    this.logger.log(email);
    return null;
  }

  async sendNewsletterEmail(email: string, newsletterData: any) {
    // TODO(RV): Add logic
    this.logger.log(email, newsletterData);
    return null;
  }
}
