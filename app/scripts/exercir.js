var phases=new Map([["phase1",{id:"phase1",name:"Wir haben den Ball"}],["phase2",{id:"phase2",name:"Wir verlieren den Ball"}],["phase3",{id:"phase3",name:"Wir haben den Ball nicht"}],["phase4",{id:"phase4",name:"Wir erobern den Ball"}]]),topics=new Map([["TE",[{passspiel:"Passspiel"},{ballmitnahme:"Ballmitnahme"},{ballkontakt:"1. Ballkontakt"},{unterdruck:"Unter Druck"},{torschuss:"Torschuss"},{dribbling:"Dribbling, Finte"},{kopfball:"Kopfball"}]],["TA",[{"1vs1":"1:1"},{spielaufbau:"Spielaufbau"},{abschluss:"Abschluss"},{toreverhindern:"Tore verhindern"},{ballerobern:"Ball erobern"},{umschalten:"Umschalten"}]],["KO",[{ausdauer:"Ausdauer"},{schnelligkeit:"Schnelligkeit"},{koordination:"Koordination"},{orientierung:"Orientierung"},{entscheide:"Entscheide"}]]]);function uuidv4(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16))}function File(){this.fileData=ko.observable({file:ko.observable(),dataURL:ko.observable(),base64String:ko.observable()}),this.fileData().base64String.subscribe((function(e){console.log("base64String")}))}function Variety(){this.description=ko.observable(""),this.image=new File}function Topic(){var e=this;e.selectedTopicIds=ko.observableArray(),e.selectedTopics=ko.computed((function(){return ko.utils.arrayMap(e.selectedTopicIds(),(function(e){var a=e.split("-"),n=a[0];return n+" > "+topics.get(n)[a[1]][a[2]]}))}))}function Phase(){var e=this;e.selectedPhasesIds=ko.observableArray(),e.selectedPhases=ko.computed((function(){return ko.utils.arrayMap(e.selectedPhasesIds(),(function(e){return phases.get(e)}))}))}function Exercise(e=uuidv4()){var a=this;a.uuid=e,a.phase=new Phase,a.topic=new Topic,a.title=ko.observable(),a.organisation=ko.observable(""),a.procedure=ko.observable(""),a.coaching=ko.observable(""),a.image=new File,a.isExtended=ko.observable(!0),a.varieties=ko.observableArray(),a.hasVarieties=ko.computed((function(){return a.varieties().length>0})),a.addVariety=function(){a.varieties.push(new Variety)}}function ExercirViewModel(){var e=this;e.exercise=new Exercise,e.phases=Array.from(phases.values()),e.topics=ko.observableArray(),Array.from(topics.keys()).forEach((function(a){var n=Array.from(topics.get(a)).map((function(e){return{key:Object.keys(e)[0],value:Object.values(e)[0]}}));e.topics.push({main:a,topics:n})})),e.save=function(){console.log("save",ko.toJSON(e.exercise))}}ko.fileBindings.defaultOptions={wrapperClass:"input-group",fileNameClass:"disabled form-control",noFileText:"No file chosen",buttonGroupClass:"input-group-append",buttonClass:"btn btn-secondary",clearButtonClass:"btn btn-warning",buttonText:"Choose File",changeButtonText:"Change",clearButtonText:"Clear",fileName:!0,clearButton:!0,onClear:function(e,a){"function"==typeof e.clear&&e.clear()}},ko.fileBindings.defaultOptions.buttonText="Browse",ko.applyBindings(new ExercirViewModel);
//# sourceMappingURL=exercir.js.map