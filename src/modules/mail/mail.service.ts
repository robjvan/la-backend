import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SendMailClient } from 'zeptomail';
import {
  FORGOT_PASS_TEMPLATE_KEY,
  PASSWORD_UPDATED_TEMPLATE_KEY,
  WELCOME_TEMPLATE_KEY,
} from 'src/constants';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize ZeptoMail client with provided API credentials
const client = new SendMailClient({
  url: process.env.MAIL_RELAY_URL,
  token: process.env.MAIL_RELAY_TOKEN,
});

/**
 * MailService is responsible for sending transactional emails such as
 * password resets, welcome messages, confirmations, and newsletters.
 */
@Injectable()
export class MailService {
  /** Logger instance scoped to MailService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(MailService.name);

  /** Handles common error logging and throwing for service methods. */
  private handleError(error: string, errorMsg: string) {
    this.logger.error(error, errorMsg);
    throw new InternalServerErrorException(error, errorMsg);
  }

  /**
   * Generic wrapper around the ZeptoMail template-based sending API.
   * Used internally by all public send methods.
   *
   * @param templateKey - The key of the template to use.
   * @param toAddress - The recipient email address.
   * @param mergeInfo - Dynamic template fields for rendering the message.
   */
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
                // Use a test email instead during dev if needed
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

  /**
   * Sends a password reset email with a secure token.
   *
   * @param email - Recipient's email address.
   * @param token - Unique token to reset the password.
   */
  public sendForgotPasswordEmail(email: string, token: string): any {
    this.sendMessage(FORGOT_PASS_TEMPLATE_KEY, email, {
      token: token,
      username: email,
    });
  }

  /**
   * Notifies the user that their password was successfully updated.
   *
   * @param email - Recipient's email address.
   */
  public sendPasswordUpdatedEmail(email: string) {
    this.sendMessage(PASSWORD_UPDATED_TEMPLATE_KEY, email, {});
  }

  /**
   * Sends a welcome email after registration with a verification token.
   *
   * @param email - Recipient's email address.
   * @param token - Token to confirm the account.
   */
  public sendWelcomeEmail(email: string, token: string) {
    this.sendMessage(WELCOME_TEMPLATE_KEY, email, {
      username: email,
      token: token,
    });
  }

  /**
   * Sends a notification that the user’s account has been closed.
   * (Implementation pending).
   *
   * @param email - Recipient's email address.
   */
  public sendAccountClosedEmail(email: string) {
    // TODO(RV): Add template and logic
    this.logger.log(email);
    return null;
  }

  /**
   * Sends a newsletter message with dynamic content to the user.
   * (Implementation pending).
   *
   * @param email - Recipient's email address.
   * @param newsletterData - Object containing newsletter content.
   */
  public sendNewsletterEmail(email: string, newsletterData: any) {
    // TODO(RV): Add template and logic
    this.logger.log(email, newsletterData);
    return null;
  }
}
