import { Component, OnInit, OnDestroy} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy{

  isAuthenticated = false;
  private userSub : Subscription;

  constructor(private dataStorageService : DataStorageService,
              private authService : AuthService){}
  // @Output() featureSelected = new EventEmitter<string>();

  // onSelect(feature: string) {
  //   this.featureSelected.emit(feature);
  // }
  //the above commented code not needed anymore because we are replacing that with routerLink from Router

  ngOnInit(){

    this.userSub =
      this.authService.user.subscribe(
        user => {
         // this.isAuthenticated = !user? false : true;
         this.isAuthenticated = !!user; // same as above terniary operation
         console.log(!user);
         console.log(!!user);
        }
      )
  }   

  onAddRecipes(){
    this.dataStorageService.StoreRecipes();
  }

  onFetchRecipes(){
    this.dataStorageService.FetchRecipes().subscribe();
  }

  onLogOut(){
    this.authService.LogOut();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
