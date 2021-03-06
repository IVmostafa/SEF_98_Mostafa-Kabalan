import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { MessagingComponent } from '../classes/messaging.component';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../data.service";

import * as firebase from 'firebase/app';

@Component({
    selector: 'app-chat-screen',
    templateUrl: './chat-screen.component.html',
    styleUrls: ['./chat-screen.component.css']
})

export class ChatScreenComponent implements OnInit {

    error: any;
    user: any;
    state: string = '';
    secondParty: any = null;
    conversations = [];

    constructor(
        public af: AngularFireAuth, 
        private router: Router, 
        public messaging: MessagingComponent,
        private httpClient:HttpClient,
        private data: DataService
    ) {
        var that = this;
        that.af.authState.subscribe(auth => {
            if (auth) {
                firebase.database().ref('users/' + auth.uid)
                .on('value', (snapshot) => {
                    that.user = {
                        id: auth.uid,
                        info: snapshot.val()
                    };
                    var signOutButton = document.getElementById('sign-out');
                    var userPic = document.getElementById('user-pic');
                    var userName = document.getElementById('user-name');

                    var profilePicUrl = that.user.info.photoURL;
                    var usrName = that.user.info.name;
                    userPic.style.background = 'url(assets/images/profile_placeholder.png)';
                    userPic.style.backgroundSize = 'contain';
                    userName.textContent = usrName;
                });

                firebase.database().ref('users/' + auth.uid).on('value', (snapshot) => {
                    that.user = {
                        id: auth.uid,
                        info: snapshot.val()
                    };

                    that.messaging.setFormValues(that.user, httpClient); 

                    that.data.localStorage.getItem<Object>('secondParty').subscribe((secondParty) => {
                        if (secondParty) {
                            that.secondParty = secondParty;

                            that.messaging.setSecondParty(that.secondParty);

                            that.messaging.loadMessages();

                        } else {
                            that.messaging.messageList.innerHTML = '<h4> The username you have provided isn\'t currently registered in our system. </h4>';
                            that.messaging.messageInput.value = '';
                            that.messaging.messageInput.setAttribute('disabled', 'true');
                        }
                    });
                });
            }
        });
    }

    ngOnInit() {
    }
}