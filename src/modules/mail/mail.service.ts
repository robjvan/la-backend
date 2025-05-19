import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SendMailClient } from 'zeptomail';
import {
  FORGOT_PASS_TEMPLATE_KEY,
  MAIL_FROM_ADDRESS,
  MAIL_FROM_NAME,
  MAIL_RELAY_TOKEN,
  MAIL_RELAY_URL,
  MAIL_REPLY_TO_ADDRESS,
  MAIL_REPLY_TO_NAME,
} from 'src/constants';

const client = new SendMailClient({ MAIL_RELAY_URL, MAIL_RELAY_TOKEN });

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
  async sendForgotPasswordEmail(email: string, token: string): Promise<any> {
    try {
      client
        .sendMailWithTemplate({
          template_key: FORGOT_PASS_TEMPLATE_KEY,
          template_alias: "<template's alias>",
          from: {
            address: MAIL_FROM_ADDRESS,
            name: MAIL_FROM_NAME,
          },
          to: [
            {
              email_address: {
                // address: email,
                address: 'robjvan@gmail.com',
              },
            },
          ],
          merge_info: {
            token: token,
            username: email,
          },
          reply_to: [
            {
              address: MAIL_REPLY_TO_ADDRESS,
              name: MAIL_REPLY_TO_NAME,
            },
          ],
        })
        .then((res: any) => console.log('success', res))
        .catch((error: any) => console.error(error));
    } catch (err: any) {
      this.handleError(
        `Filed to send forgot password message to ${email}`,
        err.message,
      );
    }
  }

  async sendWelcomeEmail(email: string) {
    // TODO(RV): Add logic
    this.logger.log(email);
    return null;
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
