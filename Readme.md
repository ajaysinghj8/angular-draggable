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


#Example
   Clone repository and Use following commands 
   `sudo npm install`
   `npm run start `
   > Will result in some error don't worry about these.
   `python -m SimpleHTTPServer `
   >open browser with localhost:8000/example
   
   
   