# Angualr-Draggable
A angular directive provide html block to move on html plain.

## Usages
 
```js
import { NgDraggableModule } from 'angular-draggable'; 
@NgModule({                                   
    imports: [
        ....,                                
        NgDraggableModule                       
    ],
    declarations: [YourAppComponent ],
    exports: [YourAppComponent],
    bootstrap: [YourAppComponent],
})
.....


```

```html
<div draggable>
    content
 </div>    

```


```html
<div draggable="true">
    content
</div>    

```

```html
<div draggable="false">
    content
</div>    

```
# Example
   [#demo](https://coderajay.github.io/angular-draggable)
   
   
   