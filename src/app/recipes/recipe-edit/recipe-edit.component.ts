import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,  Params,Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
//import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id:number;
  editMode = false; // to check in which mode we are in new or existing recipe
  recipeForm : FormGroup;
  constructor(private route:ActivatedRoute,
    private recipeService : RecipeService,
    private router: Router) { }

  ngOnInit() {
    this.route.params.
    subscribe(
      (params:Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        //console.log(this.editMode);
        //route params changed
        this.initForm(); // we are calling here because route params changes which indicated page reloaded
      }
    );
    
  }

  get controls(){
    //console.log(this.recipeForm);
    return (<FormArray> this.recipeForm.get('ingredients')).controls;
  }   
  
  protected initForm(){ // calling when page is changed
    let recipeName='';
    let recipeImagePath = '';
    let recipeDescription='';
    let recipeIngredients = new FormArray([]);
    
    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id)
      recipeName = recipe.name;
      recipeImagePath =  recipe.imagePath;
      recipeDescription = recipe.description;
      if(recipe['ingredients'])  {
          for( let ingredient of recipe.ingredients){
            recipeIngredients.push( new FormGroup({
              'name' : new FormControl(ingredient.name,Validators.required),
              'amount' : new FormControl(ingredient.amount,[
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)])
            }));
          }
        }
        

  }
    this.recipeForm = new FormGroup({
      'name' : new FormControl(recipeName,Validators.required),
      'imagePath' : new FormControl(recipeImagePath,Validators.required),
      'description' : new FormControl(recipeDescription,Validators.required),
      'ingredients' : recipeIngredients,
    });
  }

  onAddIngredient(){
    (<FormArray> this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name' : new FormControl(null,Validators.required),
        'amount' : new FormControl(null,[
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }

  onCancel(){
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  onDeleteIngredient(index : number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onSubmit(){
    //console.log(this.recipeForm);
    if(this.editMode === true){
      // const newRecipe = new Recipe(
      //     this.recipeForm.value.name,
      //     this.recipeForm.value.description,
      //     this.recipeForm.value.imagePath,
      //     this.recipeForm.value.recipeIngredients);
      // no need because we can directly add form.value
      this.recipeService.updateRecipe(this.id,this.recipeForm.value);
    }
    else{
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
    //There are no errors but we will not be add recipes because we need return the slice of the recipes
  }
}
