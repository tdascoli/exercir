var phases=new Map([["phase1",{id:"phase1",name:"Wir haben den Ball"}],["phase2",{id:"phase2",name:"Wir verlieren den Ball"}],["phase3",{id:"phase3",name:"Wir haben den Ball nicht"}],["phase4",{id:"phase4",name:"Wir erobern den Ball"}]]),topics=new Map([["TE",[{passspiel:"Passspiel"},{ballmitnahme:"Ballmitnahme"},{ballkontakt:"1. Ballkontakt"},{unterdruck:"Unter Druck"},{torschuss:"Torschuss, Abschluss"},{dribbling:"Dribbling, Finte"},{kopfball:"Kopfball"}]],["TA",[{"1vs1":"1:1"},{spielaufbau:"Spielaufbau"},{abschluss:"Abschluss"},{toreverhindern:"Tore verhindern"},{ballerobern:"Ball erobern"},{umschalten:"Umschalten"}]],["KO",[{ausdauer:"Ausdauer"},{schnelligkeit:"Schnelligkeit"},{koordination:"Koordination"}]],["Kognitiv",[{orientierung:"Orientierung, Entscheide"}]]]);function Variety(){this.description=ko.observable(),this.image=ko.observable()}function Topic(){var e=this;e.selectedTopicIds=ko.observableArray(),e.selectedTopics=ko.computed((function(){return ko.utils.arrayMap(e.selectedTopicIds(),(function(e){var a=e.split("-"),r=a[0];return r+" > "+topics.get(r)[a[1]][a[2]]}))}))}function Phase(){var e=this;e.selectedPhasesIds=ko.observableArray(),e.selectedPhases=ko.computed((function(){return ko.utils.arrayMap(e.selectedPhasesIds(),(function(e){return phases.get(e)}))}))}function Exercise(){var e=this;e.phase=new Phase,e.topic=new Topic,e.title=ko.observable(),e.organisation=ko.observable(),e.procedure=ko.observable(),e.coaching=ko.observable(),e.image=ko.observable(),e.isExtended=ko.observable(!0),e.varieties=ko.observableArray(),e.hasVarieties=ko.computed((function(){return e.varieties().length>0})),e.addVariety=function(){e.varieties.push(new Variety)}}function ExercirViewModel(){var e=this;e.exercises=ko.observableArray(),e.exercise=new Exercise,e.phases=Array.from(phases.values()),e.topics=ko.observableArray(),Array.from(topics.keys()).forEach((function(a){var r=Array.from(topics.get(a)).map((function(e){return{key:Object.keys(e)[0],value:Object.values(e)[0]}}));e.topics.push({main:a,topics:r})})),e.save=function(){console.log("save",e.exercise)},e.fileData=ko.observable({file:ko.observable(),binaryString:ko.observable(),text:ko.observable(),dataURL:ko.observable(),arrayBuffer:ko.observable(),base64String:ko.observable(),fileTypes:ko.observable(),onInvalidFileDrop:function(e){},fileArray:ko.observableArray(),base64StringArray:ko.observableArray()}),e.fileData().text.subscribe((function(e){})),e.fileData().base64String.subscribe((function(e){console.log(e)}))}ko.fileBindings.defaultOptions={wrapperClass:"input-group",fileNameClass:"disabled form-control",noFileText:"No file chosen",buttonGroupClass:"input-group-btn",buttonClass:"btn btn-primary",clearButtonClass:"btn btn-default",buttonText:"Choose File",changeButtonText:"Change",clearButtonText:"Clear",fileName:!0,clearButton:!0,onClear:function(e,a){"function"==typeof e.clear&&e.clear()}},ko.fileBindings.defaultOptions.buttonText="Browse",ko.applyBindings(new ExercirViewModel);
//# sourceMappingURL=exercir.js.map