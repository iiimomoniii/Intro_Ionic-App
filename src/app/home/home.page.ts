import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  posts : any;
  constructor(
    private loadingCtrl : LoadingController,
    private toastCtrl : ToastController,
    private firestore : AngularFirestore
  ) {}

  ionViewWillEnter(){
    this.getPosts();
  }

  async getPosts(){
    let loader = this.loadingCtrl.create({
      message : "Please wait..."
    });
    (await loader).present(); 
    
    try {
      this.firestore
      .collection("posts")
      .snapshotChanges()
      .subscribe(data=> {
        this.posts = data.map(e => {
          return {
            id: e.payload.doc.id,
            title: e.payload.doc.data()["title"],
            details : e.payload.doc.data()["details"]
          };
        });
      });

      (await loader).dismiss();
    } catch(e) {
      this.showToast(e);
    }
  }

  async deletePost(id: string) {
    //show loader
    let loader = this.loadingCtrl.create({
      message : "Please wait..."
    });
    (await loader).present(); 

    await this.firestore.doc("posts/" + id).delete();

    //dismiss loader
    (await loader).dismiss();

  }


  showToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 3000,
      })
      .then((toastData) => toastData.present());
  }
}
