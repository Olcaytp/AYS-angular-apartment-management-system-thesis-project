import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isProgressVisible: boolean;
  firebaseErrorMessage: string;
    signupForm: FormGroup;

    constructor(
        private authService: AuthService,
        private router: Router,
        private afAuth: AngularFireAuth,
        public translateService: TranslateService
        ) {
        this.isProgressVisible = false;
        this.firebaseErrorMessage = '';
  }

    ngOnInit(): void {
        if (this.authService.userLoggedIn) {                       // if the user's logged in, navigate them to the dashboard (NOTE: don't use afAuth.currentUser -- it's never null)
            this.router.navigate(['/dashboard']);
        }

        this.signupForm = new FormGroup({
            'displayName': new FormControl('', Validators.required),
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', Validators.required),
            'phoneNumber': new FormControl('', Validators.required),
            'startDate': new FormControl('', Validators.required),
            'flatNumber': new FormControl(''),
        });
    }

    public changeLanguage(language: string): void {
        this.translateService.use(language);
      }

    signup() {
        console.log(this.signupForm.value);
        console.log(this.signupForm.valid);
        if (this.signupForm.invalid)                            // if there's an error in the form, don't submit it
            return;

        this.isProgressVisible = true;
        this.authService.signupUser(this.signupForm.value).then((result) => {
            if (result == null)                                 // null is success, false means there was an error
                this.router.navigate(['/dashboard']);
            else if (result.isValid == false)
                this.firebaseErrorMessage = result.message;
            
                console.log('SignupComponent: signupUser: success' + result);

            this.isProgressVisible = false;                     // no matter what, when the auth service returns, we hide the progress indicator
        }).catch(() => {
            this.isProgressVisible = false;
        });
    }


}
