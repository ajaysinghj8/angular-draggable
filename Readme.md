# Ng2Draggable
A angular2 directive provide html block to move block on html plain.

# USES
 
>Using NgModule


<code>
<br>import {DraggableModule} from 'ng2-draggable'; 
<br>@NgModule({                                   
<br>    imports: [
<br>        ....,                                
<br>        DraggableModule                       
<br>    ],
<br>    declarations: [YourAppComponent ],
<br>    exports: [YourAppComponent],
<br>    bootstrap: [YourAppComponent],
<br>})
</code> 

 #### For more information have a look at example files.

>Basic
`import {Draggable} from 'ng2-draggable';`

`@Component({`
    `template:'<div [draggable]> I am a draggable component.</div>',`
    `directives: [Draggable]` 
`})`
...`

>OR

`@Component({
    templateUrl:'x.template.html',
    directives: [Draggable] 
})
...`

>in `x.template.html`

`<div [draggable]> I am a draggable component.</div>`


# Example
   [#demo](https://coderajay.github.io/ng2Draggable)
   
   
   