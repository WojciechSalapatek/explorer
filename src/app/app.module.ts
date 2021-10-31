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

@NgModule({
  declarations: [
    AppComponent,
    SummaryTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    TokenDefinitionService,
    TokenBalanceService,
    PancakeswapApiService,
    TokenApiService,
    BitqueryApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
