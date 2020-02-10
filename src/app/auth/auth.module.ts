import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "../app-routing.module";
import { SharedModule } from "../shared/shared.module";

import { AuthComponent } from "./auth.component";

const routes : Routes = [
    { path : 'auth',component: AuthComponent},
]

@NgModule({
    declarations:[
        AuthComponent,

    ],
    imports :[
        FormsModule,
        AppRoutingModule, 
        SharedModule,
        RouterModule.forChild(routes),
    ],
    exports :[
        AuthComponent,
        RouterModule
    ]
})
export class AuthModule{

}