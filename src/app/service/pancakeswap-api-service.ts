import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Token, TokenDefinitionService} from "../token/token-definition";
import {Observable} from "rxjs";
import {TokenHoldingData} from "./token-api-service";
import {map} from "rxjs/operators";
import {ApiService} from "./api-service";

@Injectable()
export class PancakeswapApiService extends ApiService {
  static readonly BASE_URL = 'https://api.pancakeswap.info/api/v2'
  static readonly TOKENS_URL = `${PancakeswapApiService.BASE_URL}/tokens`

  constructor(private httpClient: HttpClient,
              private tokenDefinitionService: TokenDefinitionService) {
    super()
  }

  public supportedTokens(): Array<Token> {
    return [Token.GHC, Token.SQUID, Token.TABOO, Token.SQUIDGAMES, Token.COCK, Token.ONE, Token.SANTA]
  }


  public getUrlForToken(tokenAddress: string): string {
    return `${PancakeswapApiService.TOKENS_URL}/${tokenAddress}`
  }

  public getForToken(name: Token): Observable<TokenHoldingData> {
    const def = this.tokenDefinitionService.getTokenDefinition(name)
    return (this.httpClient.get(this.getUrlForToken(def.contractAddress)) as Observable<PancakeswapTokenApiResponse>)
      .pipe(map(
        d => ({
          name: d.data.name,
          symbol: d.data.symbol,
          price: d.data.price
        } as TokenHoldingData)
      ));
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
