import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
 // @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
 // @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;

   subscription : Subscription;
   editMode :boolean = false;
   editIndex : number;
   editItem : Ingredient ;
   @ViewChild('f',{static : false}) item : NgForm;
  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
   this.subscription =  this.slService.startedEditing.subscribe(
       (index : number) => { 
         this.editMode  = true;
         this.editIndex = index; 
         this.editItem = this.slService.getIngredient(index);
        // console.log(this.editItem);
         this.item.setValue({
            'name' : this.editItem.name,
            'amount' : this.editItem.amount,
         });
       }
    )
  }

  ngOnDestroy(){
    this.subscription.unsubscribe(); // destroying the subscription
  }

  onDelete(){
    this.slService.removeIngredients(this.editIndex);
     this.onClear();
  }

  onClear(){
    this.item.reset();
    this.editMode = false;
  }

  onSubmit() {
    //const ingName = this.nameInputRef.nativeElement.value;
    //const ingAmount = this.amountInputRef.nativeElement.value;
    const newIngredient = new Ingredient(this.item.value.name, this.item.value.amount);
    if(this.editMode){
      this.slService.updateIngredients(this.editIndex,newIngredient);
    }
    else{
      this.slService.addIngredient(newIngredient);
    } 
    this.editMode = false;
    this.item.reset();
  }

}
