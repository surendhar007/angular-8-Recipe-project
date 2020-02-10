import { Injectable } from "@angular/core";
import { HttpClient,HttpErrorResponse } from "@angular/common/http";
import { catchError , tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError, Subject, BehaviorSubject } from 'rxjs';

import { User } from "./user.model";

export interface AuthResponseData{
    kind : string;
     idToken : string;
    email : string;
    refreshToken : string;
    expiresIn : string;
    localId : string;
    registered ?: boolean;
}


@Injectable({providedIn:'root'})
export class AuthService{

  //    user = new  Subject<User>();    
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer : any ; 

    constructor( private http : HttpClient ,
                 private router : Router){}
    
    signUp(email:string , password : string) {
    return this.
            http.
            post< AuthResponseData >(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAxPmf2rUmmZjMP_GCPXW3ytHj-fbKoisk",
            {
                email : email,
                password : password,
                returnSecureToken : true
            })
            .pipe( catchError(this.HandleError) , 
            tap( resData => {
                this.HandleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn);
            }));
    }

    LogIn(email :string ,password :string){
     return this.
            http.
            post< AuthResponseData >(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAxPmf2rUmmZjMP_GCPXW3ytHj-fbKoisk',
            {
                email : email,
                password : password,
                returnSecureToken : true
            })
            .pipe( catchError(this.HandleError) , 
            tap( resData => {
                this.HandleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn);
            }
            )
            );
    }

    AutoLogin(){
        const userData : {
            email : string;
            id : string;
            _token : string;
            _tokenExpirationDate : string;
        } = JSON.parse(localStorage.getItem('userData')); // getting userData from browser
        if(!userData){
            return;
        }
        const loadedUser = new User(userData.email,userData.id,userData._token,
                new Date( userData._tokenExpirationDate));
        
        if(loadedUser.token){
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime(); 
            this.AutoLogout(expirationDuration);
        }
    }

    LogOut(){
        this.user.next(null);
        this.router.navigate(['/auth']); // after logging out redirecting to auth page
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    AutoLogout(expirationDuration : number){
        console.log(expirationDuration);
        this.tokenExpirationTimer =   
        setTimeout( () => {
            this.LogOut();
        },expirationDuration);
    }

    private HandleAuthentication(
         email : string, 
         userId : string, 
         token : string , 
         expiresIn : number
    ){
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000 );
        const user = new User(email,userId,token,expirationDate); 
        this.user.next(user);
        this.AutoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user)); // stroing in the local storage in key-value pair
        //console.log("from authService " + expirationDate.getSeconds() + user.token);
    }

    private HandleError( errorRes : HttpErrorResponse){
        let errorMessage  = "An unknown error occured"; 
        if( !errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }
        switch(errorRes.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage = "The email exists already !!";
                break; //signup page
            case 'EMAIL_NOT_FOUND':
                errorMessage = "The email had not been registered !";
                break; // login page
            case 'INVALID_PASSWORD':
                errorMessage = " The password is wrong !!!";
                break; //login page
        }
        return throwError(errorMessage);
    }
}