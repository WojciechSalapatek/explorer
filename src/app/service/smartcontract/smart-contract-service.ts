import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import Web3 from "web3";

@Injectable()
export class SmartContractService {

  static BSC_API = 'https://api.bscscan.com/api'
  static API_PARAM = 'apikey=8E2NC82RDA9N7SHJRVH9NRVAGZBYWGWXB8'

  constructor(private httpClient: HttpClient) {
  }

  public contractUrl(address: string): string {
    return `${SmartContractService.BSC_API}?module=contract&action=getabi&address=${address}&${SmartContractService.API_PARAM}`
  }

  public connect() {
    const web3 = new Web3(Web3.givenProvider);
    const version = web3.version;
    this.httpClient.get<any>(this.contractUrl('0x0000000000000000000000000000000000001004')).subscribe(data => {
      const contractABI = JSON.parse(data.result);
      if (contractABI != '') {
        const contract = new web3.eth.Contract(contractABI, '0x0000000000000000000000000000000000001004');
        console.log(contract.methods)
      }
    });
  }
}
