import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {combineLatest, forkJoin, from, Observable} from "rxjs";
import {map, mergeMap, publishReplay, refCount, take} from "rxjs/operators";
import {web3} from "./def";
import {TokenDefinition} from "../../token/token-definition";

@Injectable()
export class SmartContractService {

  static BSC_API = 'https://api.bscscan.com/api'
  static API_PARAM = 'apikey=8E2NC82RDA9N7SHJRVH9NRVAGZBYWGWXB8'
  static WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

  factory: Observable<FactoryContract>

  constructor(private httpClient: HttpClient) {
    this.factory = this.getFactoryContract()
  }

  public contractUrl(address: string): string {
    return `${SmartContractService.BSC_API}?module=contract&action=getabi&address=${address}&${SmartContractService.API_PARAM}`
  }

  public tokenToUSD(tokenDefinition: TokenDefinition): Observable<number> {
    return combineLatest([this.tokenToBNB(tokenDefinition.contractAddress, tokenDefinition.reservesInverted), this.BNBtoUSD()])
      .pipe(map(([tokenBNB, bnbUsd]) => {
        console.log(`Token BNB price: ${tokenBNB}`)
        console.log(`BNB price: ${bnbUsd}`)
        return tokenBNB * bnbUsd
      }))
  }

  public BNBtoUSD(): Observable<number> {
    return this.tokenToBNB('0xe9e7cea3dedca5984780bafc599bd69add087d56')
      .pipe(
        publishReplay(1), // publishReplay(1, _time_)
        refCount(),
        take(1),
      );
  }

  public tokenToBNB(tokenAddress: string, inverted: boolean = false): Observable<number> {
    return this.getBNBTokenPairAddress(tokenAddress)
      .pipe(
        mergeMap(contractAddress => this.contractReserves(contractAddress)),
        map(reserves => this.calculatePriceFromReserves(reserves._reserve0, reserves._reserve1, inverted))
        )
  }

  public calculatePriceFromReserves(r0: number, r1: number, inverted: boolean = false): number {
    return inverted ? r0 / r1 : r1 / r0
  }

  public getBNBTokenPairAddress(tokenAddress: string): Observable<string> {
    return this.factory.pipe(mergeMap(f => f.getPairAddress(SmartContractService.WBNB_ADDRESS, tokenAddress)))
  }

  public contractReserves(address: string): Observable<Reserves> {
    return this.httpClient.get<any>(this.contractUrl(address))
      .pipe(map(data => {
          const contractABI = JSON.parse(data.result);
          const contract = new web3.eth.Contract(contractABI, address);
          return from(contract.methods.getReserves().call()) as Observable<Reserves>
        })
      ).pipe(mergeMap(i => i))
  }

  public getFactoryContract(): Observable<FactoryContract> {
    return this.httpClient.get<any>(this.contractUrl('0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'))
      .pipe(map(data => {
          const contractABI = JSON.parse(data.result);
          return new FactoryContract(new web3.eth.Contract(contractABI, '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'));
        })
      )
      .pipe(
        publishReplay(1), // publishReplay(1, _time_)
        refCount(),
        take(1),
      );
  }
}

export class FactoryContract {

  constructor(private contract: any) {
  }

  public getPairAddress(add1: string, add2: string): Observable<string> {
    return from<string>(this.contract.methods.getPair(add1, add2).call())
  }
}

export interface Reserves {
  _reserve1: number;
  _reserve0: number;
}
