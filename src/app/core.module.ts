import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { ShoppingListService } from './shopping-list/shopping-list.service';
import { RecipeService } from './recipes/recipe.service';
import { DataStorageService } from './shared/data-storage.service';
import { RecipeResolverService } from './recipes/recipe-resolver.service';
import { AuthService } from "./auth/auth.service";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";


@NgModule({
    providers:[
        ShoppingListService,
        RecipeService,
        DataStorageService,
        RecipeResolverService,
        AuthService,
        { 
            provide : HTTP_INTERCEPTORS ,
            useClass : AuthInterceptorService ,
            multi: true
        } 
    ]
})
export class CoreModule{

}