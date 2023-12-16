import TelegramBot, { CallbackQuery, Message } from 'node-telegram-bot-api';
import axios from 'axios';

export class TelegramService {
  private static botToken = process.env.TELEGRAM_BOT_TOKEN || '';

  bot: TelegramBot;

  private getStatusLogCallback: () => Promise<string>;
  private waterPlantCallback: () => Promise<string>;

  constructor(
    getStatusLogCallback: () => Promise<string>,
    waterPlantCallback: () => Promise<string>
  ) {
    this.bot = new TelegramBot(TelegramService.botToken, { polling: true });
    this.getStatusLogCallback = getStatusLogCallback;
    this.waterPlantCallback = waterPlantCallback;
    this.initializeHandlers();
  }

  private initializeHandlers() {
    console.log('Initializing Telegram handlers');
    this.bot.onText(/\/start/, (msg: Message) => {
      console.log('now listening to /start');
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, 'Welcome! Use the buttons below:', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Water Plant', callback_data: 'water' },
              { text: 'Get Status', callback_data: 'status' }
            ]
          ]
        }
      });
    });

    // Handle callback queries
    this.bot.on('callback_query', async (query: CallbackQuery) => {
      const chatId = query.message!.chat.id;
      const action = query.data;

      if (action === 'water') {
        const seedWaterResultLog = await this.waterPlantCallback();
        this.bot.sendMessage(chatId, seedWaterResultLog);
      } else if (action === 'status') {
        const seedStatusLog = await this.getStatusLogCallback();
        this.bot.sendMessage(chatId, seedStatusLog);
      }
    });
  }

  static async sendMessage(chatId: string, message: string): Promise<void> {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    try {
      await axios.post(url, {
        chat_id: chatId,
        text: message
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error sending Telegram message:', error);
        throw new Error(`Failed to send Telegram message: ${error.message}`);
      }
    }
  }

  static async sendMessageWithKeyboard(
    chatId: number,
    text: string,
    keyboard: any
  ): Promise<void> {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    try {
      await axios.post(url, {
        chat_id: chatId,
        text: text,
        reply_markup: {
          inline_keyboard: keyboard
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error sending Telegram message:', error);
        throw new Error(`Failed to send Telegram message: ${error.message}`);
      }
    }
  }
}
