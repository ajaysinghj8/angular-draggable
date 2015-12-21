#Ng2Draggable
A angular2 directive provide html block to move block on html plain.

#USE
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


