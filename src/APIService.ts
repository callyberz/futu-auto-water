import { my_custom_header } from './constants';

export class APIService {
  static async fetchData(url: string, options = {}, responseType = 'json') {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (responseType === 'json') {
        return await response.json();
      } else if (responseType === 'text') {
        return await response.text();
      } else {
        throw new Error(`Invalid response type: ${responseType}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error);
        throw new Error(`Failed to fetch data from ${url}: ${error.message}`);
      }
    }
  }

  static async callAPI(apiUrl: string, option?: any) {
    const { responseType = 'json', headers, ...options } = option;
    try {
      const data = await this.fetchData(
        apiUrl,
        {
          headers: { ...my_custom_header, ...headers },
          ...options
        },
        responseType
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching data from ${apiUrl}:`, error);
        throw new Error(
          `Failed to fetch data from ${apiUrl}: ${error.message}`
        );
      }
    }
  }
}
