import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutingModule } from "../app-routing.module";
import { RecipesModule } from "../recipes/recipes.module";
import { SharedModule } from "../shared/shared.module";

import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";


const shoppingRoute : Routes = [
        
    {path:'shopping-list',component: ShoppingListComponent}
];

@NgModule({
    declarations :[
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    imports:[ 
        FormsModule,
        RecipesModule,
        AppRoutingModule,
        RouterModule.forChild(shoppingRoute),
        SharedModule
    ],
    exports:[
        ShoppingListComponent,
        ShoppingEditComponent,
        RouterModule
    ]
})
export class ShoppingListModule{
  
}