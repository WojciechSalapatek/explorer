import {Injectable} from '@angular/core';
import {Token, TokenDefinition, TokenDefinitionService} from "../token/token-definition";
import {combineLatest, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {TokenHoldingData} from "./token-api-service";
import {map} from "rxjs/operators";
import {ApiService} from "./api-service";

@Injectable({
  providedIn: 'root'
})
export class BinancePriceApiService extends ApiService{
  static readonly BASE_URL = 'https://api.binance.com/api/v3/ticker/price?symbol='

  bnbPrice = of(0);

  constructor(private httpClient: HttpClient,
              private tokenDefinitionService: TokenDefinitionService) {
    super()
    this.bnbPrice = (this.httpClient.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT') as Observable<BinanceTokenData>)
      .pipe(map(d => d.price))
  }

  public supportedTokens(): Array<Token> {
    return [Token.XRP, Token.ADA, Token.HBAR, Token.SOL, Token.BTC]
  }

  public getUrlForToken(tokenDef: TokenDefinition): string {
    return `${BinancePriceApiService.BASE_URL}${tokenDef.symbol}BUSD`
  }

  public getForToken(name: Token): Observable<TokenHoldingData> {
    const def = this.tokenDefinitionService.getTokenDefinition(name)
    const tokenPrice = (this.httpClient.get(this.getUrlForToken(def)) as Observable<BinanceTokenData>)
    return tokenPrice
      .pipe(map(
        (d) => ({
          name: def.name,
          symbol: def.symbol,
          price: d.price
        } as TokenHoldingData)
      ));
  }
}

export interface BinanceTokenData {
  price: number;
}
