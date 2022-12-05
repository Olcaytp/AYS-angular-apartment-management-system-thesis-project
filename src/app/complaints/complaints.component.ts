import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from '../services/firebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import Complaint from '../models/complaint';
import { ComplaintService } from '../services/complaint.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit {

  complaints?: Complaint[];
  currentIndex = -1;
  currentComplaint?: Complaint;
  title = '';
  user: Observable<any>;
  searchValue: string = "";
  items: Array<any>;
  name_filtered_items: Array<any>;
  email_filtered_items: Array<any>;
  
  constructor(
    private ComplaintService: ComplaintService,
    public firebaseService: FirebaseService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    ) {
      this.user = null;
     }

  ngOnInit(): void {
    this.getData();
    const dataSource = this.items;
    this.afAuth.authState.subscribe(user => {               // grab the user object from Firebase Authorization
      if (user) {
          let emailLower = user.email.toLowerCase();
          this.user = this.firestore.collection('users').doc(user.uid).valueChanges(); // get the user's doc in Cloud Firestore
      }
  });
    this.retrieveComplaints();
  }

  getData(){
    this.firebaseService.getUsers()
    .subscribe(result => {
      this.items = result;
      this.name_filtered_items = result;
      this.email_filtered_items = result;
      console.log('UserListComponent: items', this.items.length);
    })
  }

  refreshList(): void {
    this.currentComplaint = undefined;
    this.currentIndex = -1;
    this.retrieveComplaints();
  }

  retrieveComplaints(): void {
    console.log('retrieveComplaints() is called');
    this.ComplaintService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.complaints = data;
    });
  }

  setActiveComplaint(complaint: Complaint, index: number): void {
    this.currentComplaint = complaint;
    this.currentIndex = index;
    console.log('setActiveComplaint() is called' + this.currentComplaint.title);
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