export class BitqueryGraphqlFactory {

  public static historicPairData(options: HistoricPairDataOptions): any {
    return {
      query: '{\n' +
      'ethereum(network: bsc){\n' +
      'dexTrades(options: {asc: "timeInterval.minute"},\n' +
      `date: {since:"${options.since}"}\n` +
      'exchangeName: {in:["Pancake v2"]},\n' +
      `baseCurrency: {is: "${options.baseAddress}"},\n` +
      `quoteCurrency: {is: "${options.quoteAddress}"}){\n` +
      'timeInterval {\n' +
      `minute(count: ${options.intervalMinutes})\n` +
      '}quotePrice\n' +
      '}}\n' +
      '}'
    }
  }

}

export class HistoricPairDataOptions {
  constructor(public baseAddress: string,
              public quoteAddress: string,
              public intervalMinutes: number = 5,
              public since: string = '2021-10-25') {
  }
}

export interface HistoricPairDataResponse {
  dexTrades: Array<HistoricQuotePrice>
}

export interface HistoricQuotePrice {
  timeInterval: TimeInterval;
  quotePrice: number;
}

export interface TimeInterval {
  minute: Date
}
