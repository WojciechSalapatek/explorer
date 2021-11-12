import {Injectable} from "@angular/core";
import {PancakeswapApiService} from "./pancakeswap-api-service";
import {Token} from "../token/token-definition";
import {Observable, of} from "rxjs";
import {BinancePriceApiService} from "./binance-price-api.service";
import {ApiService} from "./api-service";

@Injectable()
export class TokenApiService {
  apiServices: Array<ApiService>;

  constructor(private pancakeswapApiService: PancakeswapApiService,
              private binancePriceApiService: BinancePriceApiService
  ) {
    this.apiServices = [this.pancakeswapApiService, this.binancePriceApiService]
  }

  public getTokenHoldingData(name: Token): Observable<TokenHoldingData> {
    const apiProvider = this.apiServices.find(s => s.supportedTokens().indexOf(name) > -1);
    if (apiProvider) {
      return apiProvider.getForToken(name)
    }
    return of({} as TokenHoldingData);
  }
}

export interface TokenHoldingData {
  name: string;
  symbol: string;
  price: number;
}
