import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";

import { AuthService, AuthResponseData } from "./auth.service";
import { AlertComponent } from '../shared/alert/alert.component'
import { PlaceholderDirective } from "../shared/placeHolder/placeholder.directive";

@Component({
    selector :'app-auth',
    templateUrl:'./auth.component.html'
})

export class AuthComponent implements OnDestroy{

   constructor ( private authService : AuthService,
                private router : Router ,
                private componentFactoryResolver : ComponentFactoryResolver){}

   isLoginMode = false;
   isLoading = false;
   error : string = null ;
   @ViewChild('containerRef',{static:false , read : PlaceholderDirective}) alertHost : PlaceholderDirective ; 
    
    private closeSub : Subscription ;

   onHandleError(){
       this.error = null;
   } 

   onSwitchMode(){
       this.isLoginMode = !this.isLoginMode;
   }

   onSubmit(form : NgForm){
        if(!form.valid){
            return;
        }
        //console.log(form.value);
        const email = form.value.email;
        const password = form.value.password;

        let authObs : Observable< AuthResponseData >;

        this.isLoading = true;

        if(this.isLoginMode ){

           authObs =   this.authService.LogIn(email,password);
        }
        else{
         
            authObs =   this.authService.signUp(email,password);
        }

        authObs.subscribe(
            resData => {
                console.log(resData);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                console.log(errorMessage); 
                this.error = errorMessage;
                this.ShowErrorAlert(errorMessage);
                this.isLoading = false;
               // this.error = "An Error occured";
            }
        );

        form.reset();
       // this.error = null;
    }

    ngOnDestroy(){
        if(this.closeSub){
            this.closeSub.unsubscribe();
        }
    }

    private ShowErrorAlert( message : string){
       // const alertCmp = new AlertComponent(); // valid ts code but not angular
      const AlertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
      const hostViewContainerRef  = this.alertHost.viewContainerRef;
      hostViewContainerRef.clear();
      
     const componentRef =  hostViewContainerRef.createComponent(AlertCmpFactory);

     componentRef.instance.message = message;

     this.closeSub =  componentRef.instance.close.subscribe( () => {

                this.closeSub.unsubscribe();
                hostViewContainerRef.clear();    
    });
    }   
}