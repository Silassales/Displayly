import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  emailValidator = new FormControl('', [Validators.required, Validators.email]);
  passwordValidator = new FormControl('', [Validators.required]);
  hide = true;
  error = '';
  loading = false;

  constructor(private auth: AuthenticationService, private router: Router) {}

  getErrorMessage() {
    return this.emailValidator.hasError('required') ? 'You must enter a value' :
      this.emailValidator.hasError('emailValidator') ? 'Not a valid emailValidator' :
        '';
  }

  buttonDisabled() {
    return this.emailValidator.hasError('required') ||
      this.emailValidator.hasError('emailValidator') ||
      this.passwordValidator.hasError('required') ||
      this.loading;
  }

  submit() {
    this.error = '';
    this.loading = true;
    // Attempt to do an authentication using the auth service
    this.auth.authenticate(this.emailValidator.value, this.passwordValidator.value).subscribe(data => {
      this.loading = false;

      this.router.navigate(['/dashboard']); // If authentication was successful, navigate to the dashboard
    }, err => {
      this.loading = false;
      // If authentication was not successful, display the error. If no error was provided, show a generic error
      this.error = (err.error.error) ? err.error.error : 'There was an error with the system, try again later';
    });
  }

}
