import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  emailValidator = new FormControl('', [Validators.required, Validators.email]);
  passwordValidator = new FormControl('', [Validators.required]);
  hide = true;

  getErrorMessage() {
    return this.emailValidator.hasError('required') ? 'You must enter a value' :
      this.emailValidator.hasError('emailValidator') ? 'Not a valid emailValidator' :
        '';
  }

  buttonDisabled() {
    return this.emailValidator.hasError('required') ||
      this.emailValidator.hasError('emailValidator') ||
      this.passwordValidator.hasError('required');
  }

}
