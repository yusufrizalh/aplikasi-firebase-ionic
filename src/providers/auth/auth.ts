import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';

@Injectable()
export class AuthProvider {

  constructor() {
  }

  // fungsi untuk login
  loginUser(email: string, password: string): Promise<User> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  // fungsi untuk signup
  signupUser(email: string, password: string): Promise<void> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        firebase
          .database()
          .ref(`/userProfile/${newUser.uid}/email`)
          .set(email);
          console.log('data uid:', newUser.uid);
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  // fungsi reset password
  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  // fungsi logout user
  logoutUser(): Promise<void> {
    const userId: string = firebase.auth().currentUser.uid;
    firebase.database()
      .ref(`/userProfile/${userId}`)
      .off();
    return firebase.auth().signOut();
  }

}
