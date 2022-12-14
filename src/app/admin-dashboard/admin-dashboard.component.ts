import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import Payment from '../models/payment';
import Anounce from '../models/anounce';
import { PaymentService } from '../services/payment.service';
import { AnounceService } from '../services/anounce.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {

    anounce: Anounce = new Anounce();
    payment: Payment = new Payment();

  user: Observable<any>; 
  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

    constructor(
        private afAuth: AngularFireAuth,
        private firestore: AngularFirestore,
        private router: Router,
        private AnounceService: AnounceService,
        private PaymentService: PaymentService,
        public translateService: TranslateService
        ) {
        this.user = null;

    }


    ngOnInit(): void {
        this.afAuth.authState.subscribe(user => {               // grab the user object from Firebase Authorization
            if (user) {
                this.user = this.firestore.collection('users').doc(user.uid).valueChanges(); // get the user's doc in Cloud Firestore
            }
        });
    }

    public changeLanguage(language: string): void {
      this.translateService.use(language);
    }

    saveAnouncement(): void {
        this.AnounceService.create(this.anounce).then(() => {
          console.log('Created new item successfully!');
          this.router.navigate(['/announces']);
        });
      }

    savePayment(): void {
    this.PaymentService.create(this.payment).then(() => {
      console.log('Created new item successfully!');
      this.router.navigate(['/payments']);
    });
  }

    logout(): void {
        this.afAuth.signOut()
        .then(() => {
            this.router.navigate(['/login']);                    // when we log the user out, navigate them to home
        })
        .catch(error => {
            console.log('Auth Service: logout error...');
            console.log('error code', error.code);
            console.log('error', error);
            if (error.code)
                return error;
        });
    }

}
