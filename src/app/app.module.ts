import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {SummaryTableComponent} from './summary-table/summary-table.component';
import {HttpClientModule} from "@angular/common/http";
import {TokenDefinitionService} from "./token/token-definition";
import {TokenBalanceService} from "./token/token-balance";
import {PancakeswapApiService} from "./service/pancakeswap-api-service";
import {TokenApiService} from "./service/token-api-service";
import {BitqueryApiService} from "./service/bitquery/bitquery-api-service";
import {SmartContractService} from "./service/smartcontract/smart-contract-service";
import {BinancePriceApiService} from "./service/binance-price-api.service";
import { LoginVerifierComponent } from './login-verifier/login-verifier.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    SummaryTableComponent,
    LoginVerifierComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    TokenDefinitionService,
    TokenBalanceService,
    PancakeswapApiService,
    TokenApiService,
    BitqueryApiService,
    SmartContractService,
    BinancePriceApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
