import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Token, TokenDefinitionService} from "../../token/token-definition";
import {Observable} from "rxjs";
import {
  BitqueryGraphqlFactory,
  HistoricPairDataOptions,
  HistoricPairDataResponse
} from "./bitquery-graphql-factory";

@Injectable()
export class BitqueryApiService {
  static readonly BASE_URL = 'https://graphql.bitquery.io/'
  static BUSD_ADDRESS = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
  static WBNB_ADDRESS = '0xe9e7cea3dedca5984780bafc599bd69add087d56'

  constructor(private httpClient: HttpClient,
              private tokenDefinitionService: TokenDefinitionService) {
  }

  public getBNBtoUSD(intervalMinutes: number = 5,
                     since: string = '2021-10-25'): Observable<HistoricPairDataResponse> {
    return this.getHistoricPairData(new HistoricPairDataOptions(
      BitqueryApiService.BUSD_ADDRESS,
      BitqueryApiService.WBNB_ADDRESS,
      intervalMinutes,
      since
    ))
  }

  public getHistoricPairData(options: HistoricPairDataOptions): Observable<HistoricPairDataResponse> {
    return this.httpClient.post<HistoricPairDataResponse>(
      BitqueryApiService.BASE_URL,
      BitqueryGraphqlFactory.historicPairData(options), {headers: new HttpHeaders({'X-API-KEY': 'BQYgUpCqoK3ivi4SUL2cg1dK2GeqJHUv', "Content-Type": "application/json",})})
  }
}
