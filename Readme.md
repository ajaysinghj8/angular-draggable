# Ng2Draggable
A angular2 directive provide html block to move block on html plain.

## Usages
 
```js
import { Ng2DraggableModule } from 'ng2-draggable'; 
@NgModule({                                   
    imports: [
        ....,                                
        Ng2DraggableModule                       
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
   [#demo](https://coderajay.github.io/ng2Draggable)
   
   
   