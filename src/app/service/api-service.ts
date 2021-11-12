import {Token} from "../token/token-definition";
import {Observable} from "rxjs";
import {TokenHoldingData} from "./token-api-service";

export abstract class ApiService {
  abstract getForToken(name: Token): Observable<TokenHoldingData>;
  abstract supportedTokens(): Array<Token>;
}
