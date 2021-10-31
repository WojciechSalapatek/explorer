import {Injectable} from "@angular/core";
import {PancakeswapApiService} from "./pancakeswap-api-service";
import {Token} from "../token/token-definition";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class TokenApiService {
  constructor(private pancakeswapApiService: PancakeswapApiService) {
  }

  public getTokenHoldingData(name: Token): Observable<TokenHoldingData> {
    return this.fromPancakeswap(name)
  }

  private fromPancakeswap(name: Token): Observable<TokenHoldingData> {
    return this.pancakeswapApiService.getForToken(name)
      .pipe(map(
        d => ({
          name: d.data.name,
          symbol: d.data.symbol,
          price: d.data.price
        } as TokenHoldingData)
      ));
  }
}

export interface TokenHoldingData {
  name: string;
  symbol: string;
  price: number;
}
