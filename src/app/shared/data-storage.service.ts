import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from 'rxjs/operators';
 
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";

@Injectable()
export class DataStorageService{

    constructor( private http : HttpClient , 
                 private recipeService : RecipeService){}

    StoreRecipes(){
        const recipes : Recipe[] = this.recipeService.getRecipes();
        this.
            http.
            put("https://ng-recipe-book-1dc4f.firebaseio.com/recipes.json",recipes)
            .subscribe(
                Response => {
                    console.log(Response);
                }
            );
            // we can subscribe here only as no need to contact to recipes
    }

    FetchRecipes(){
                //console.log(user.token) // error
        return this.http.get <Recipe[]>
                        ("https://ng-recipe-book-1dc4f.firebaseio.com/recipes.json",).
            pipe(

            map( recipes => {
                return recipes.map( recipe =>{
                    return {
                        ...recipe ,
                         ingredients : recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }),
            tap( recipes => {
                this.recipeService.setRecipes(recipes);
            }));         
    }
}