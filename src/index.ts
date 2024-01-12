import 'dotenv/config';
import cron from 'node-cron';
import { CULTURE_ROOM_URL } from './constants';
import { addSecondsToCurrentTime, unixTimestampConverter } from './utils';
import type { Seed, SeedResponse } from './type';
import { APIService } from './APIService';
import { TelegramService } from './TelegramService';

// this solution is not working, as the HTML is not rendered
// only I just get the HTML file and locate the element,
// but it is not the same as the HTML rendered in the browser
// consider headless browser: puppeteer
// async function requestMyPlantHTML() {
//   const html = await APIService.callAPI(
//     'https://seed.futunn.com/friends?scroll=0&friendsIndex=0&panel=cultureroom&lang=en-us',
//     {
//       responseType: 'text'
//     }
//   );
//   const dom = new JSDOM(html);
//   const document = dom.window.document;

//   // Use standard DOM methods to find elements
//   const nickName = document.getElementsByClassName('nickName');
//   if (nickName) {
//     console.log('Your nick name:', nickName[0].textContent);
//   }
//   const waterCanvas = document.getElementById('waterCanvas');
//   if (waterCanvas) {
//     console.log('found waterCanvas, water it now');
//     waterCanvas.click();
//   }
// }

export class FutuPlant {
  seed: Seed;

  constructor(_seed: Seed) {
    this.seed = _seed;
  }

  static async getMyPlantData(): Promise<SeedResponse> {
    const response = await APIService.callAPI(CULTURE_ROOM_URL, {
      responseType: 'json'
    });
    return response;
  }

  get isMatured() {
    const { mature_at } = this.seed;
    const matureAt = unixTimestampConverter(mature_at);
    const currentDate = new Date();
    return currentDate > matureAt;
  }

  async waterMyPlant() {
    const { data } = await FutuPlant.getMyPlantData();
    this.seed = data.seed;
    const formData = new URLSearchParams();
    formData.append('seed_id', this.seed.seed_id.toString());

    const response = await APIService.callAPI(
      'https://seed.futunn.com/main/water',
      {
        method: 'POST',
        body: formData,
        'Content-Type': 'application/x-www-form-urlencoded',
        headers: {
          'x-csrf-token': process.env.CUSTOM_X_CSRF_TOKEN || ''
        }
      }
    );

    if (response.code === 0) {
      const { boost_time, current_timestamp } = response.data;
      const waterResultLog = `✅✅✅ Watering succeeded. You have gained ${boost_time} mintues of watering boost on ${unixTimestampConverter(
        current_timestamp
      ).toLocaleString()}`;
      return waterResultLog;
    } else {
      const { code, message } = response;
      const errorMessage = `❌❌❌ Watering failed. Error code: ${code}, message: ${message}`;
      return errorMessage;
    }
  }

  /**
   * you gain 3 times water_limit_num daily (TBC when the daily reset is)
   * water_done_num: number of times you have watered the plant
   * frozen_to_timestamp: number of seconds until the next watering
   */
  async getCurrentStatusLog() {
    // FIXME: this is not working, we should use another method to check if the plant is matured or watered
    // if (this.isMatured) {
    // get the new seed data now;
    const { data } = await FutuPlant.getMyPlantData();
    this.seed = data.seed;
    // }

    const {
      seed_id,
      mature_at,
      water_limit_num,
      water_done_num,
      frozen_to_timestamp,
      create_at
    } = this.seed;
    const seedMatureLocalTime = unixTimestampConverter(
      mature_at
    ).toLocaleString('en-US', { timeZone: 'US/Central' });
    const seedCreatedAtLocalTime = unixTimestampConverter(
      create_at
    ).toLocaleString('en-US', { timeZone: 'US/Central' });
    const numberOfWaterLeftToday = water_limit_num - water_done_num;
    const seedStatusLog =
      `🌱🌱🌱 Your seed (id: ${seed_id}) was created at: ${seedCreatedAtLocalTime}\n` +
      `🌸🌸🌸 Your seed will be mature at: ${seedMatureLocalTime}\n` +
      `🚿🚿🚿 You watered this plant for ${water_done_num} times today (out of ${water_limit_num} times). You can water it for ${numberOfWaterLeftToday} more times today. (this.isMatured ${this.isMatured})`;
    const seedWaterStatusLog = `${
      numberOfWaterLeftToday === 0
        ? '👆👆👆 You have no more water left today!'
        : frozen_to_timestamp === 0
        ? '👆👆👆 Water now!'
        : `🙌🙌🙌 You can water this plant again in ~${(
            frozen_to_timestamp / 60
          ).toFixed(0)} minutes, which is at ${addSecondsToCurrentTime(
            frozen_to_timestamp
          )}`
    }`;
    return `${seedStatusLog}\n${seedWaterStatusLog}`;
  }

  // Schedule the task to run at 2 PM, 4 PM, and 6 PM EST every day
  // The cron syntax is '0 19,21,23 * * *', which means at minute 0 of hour 19, 21, and 23 UTC
  // This corresponds to 2 PM, 4 PM, and 6 PM EST
  startWateringCronJob() {
    console.log("🌱🌱🌱 I'm starting the cron job now");
    cron.schedule('0 19,21,23 * * *', () => {
      this.waterMyPlant();
    });
  }
}

async function main() {
  const { data } = await FutuPlant.getMyPlantData();
  const { seed } = data;
  if (!seed) {
    throw new Error('No seed data found');
  }
  const mySeed = new FutuPlant(seed);
  mySeed.startWateringCronJob();

  const telegramBot = new TelegramService(
    () => mySeed.getCurrentStatusLog(),
    () => mySeed.waterMyPlant()
  );
}

main();
