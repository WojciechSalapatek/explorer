import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Token, TokenDefinitionService} from "../token/token-definition";
import {Observable} from "rxjs";

@Injectable()
export class PancakeswapApiService {
  static readonly BASE_URL = 'https://api.pancakeswap.info/api/v2'
  static readonly TOKENS_URL = `${PancakeswapApiService.BASE_URL}/tokens`

  constructor(private httpClient: HttpClient,
              private tokenDefinitionService: TokenDefinitionService) {
  }

  public getUrlForToken(tokenAddress: string): string {
    return `${PancakeswapApiService.TOKENS_URL}/${tokenAddress}`
  }

  public getForToken(name: Token): Observable<PancakeswapTokenApiResponse> {
    const def = this.tokenDefinitionService.getTokenDefinition(name)
    return this.httpClient.get(this.getUrlForToken(def.contractAddress)) as Observable<PancakeswapTokenApiResponse>
  }
}

export interface PancakeswapTokenApiResponse {
  updated_at: number;
  data: PancakeswapTokenData;
}

export interface PancakeswapTokenData {
  name: string;
  symbol: string;
  price: number;
  price_BNB: number;
}
