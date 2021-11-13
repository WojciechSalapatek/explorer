import { Component, OnInit } from '@angular/core';
const shajs = require('sha.js')

@Component({
  selector: 'app-login-verifier',
  templateUrl: './login-verifier.component.html',
  styleUrls: ['./login-verifier.component.css']
})
export class LoginVerifierComponent implements OnInit {

  readonly hash = '0724def06ee67b45c7d64583dc1ff0b6632d8a06ace1ea22653671a6065d7379'
  static readonly COOKIE_NAME = 'DEXP-ID'
  verified: boolean = false;
  inputPassword = '';

  constructor() { }

  verify(): void {
    const hashedInput = shajs('sha256').update(this.inputPassword).digest('hex');
    this.verified = this.verifyHash(hashedInput);
    if (this.verified) {
      let expDate = new Date()
      expDate.setFullYear(expDate.getFullYear()+1)
      document.cookie = `${LoginVerifierComponent.COOKIE_NAME}=${hashedInput}; expires=${expDate.toUTCString()};`;
    }
  }

  verifyHash(h: string):boolean {
    return h === this.hash;
  }

  ngOnInit(): void {
    this.verified = false;
    let idCookie = document.cookie.split(';')
      .map(a => a.trim())
      .find(a => a.startsWith(LoginVerifierComponent.COOKIE_NAME))
    if (idCookie) {
      const h = idCookie.replace(`${LoginVerifierComponent.COOKIE_NAME}=`, '')
      this.verified = this.verifyHash(h);
    }
  }

}
