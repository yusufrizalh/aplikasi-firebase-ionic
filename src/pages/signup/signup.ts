import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  Loading, LoadingController,
  Alert, AlertController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  // global variable
  public loading: Loading;
  public signupForm: FormGroup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder) {

      // validasi form
      this.signupForm = formBuilder.group({
        email: [
          '',     // mendeteksi nilai string
          Validators.compose([Validators.required])
        ],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(6)])
        ]
      });
  }

  // fungsi untuk proses signup user baru
  signupUser(): void {
    // cek validasi form
    if (!this.signupForm.valid){
      console.log(`Form belum valid: ${this.signupForm.value}`);
    } else {
      const email: string = this.signupForm.value.email;
      const password: string = this.signupForm.value.password;

      // panggil fungsi signupUser dari provider Auth
      this.authProvider.signupUser(email, password).then(
        user => {     // resolve
          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot(HomePage);
          });
        },
        error => {    // reject
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'OK', role: 'cancel' }]
            });
            alert.present();
          });
        }
      );
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

}
