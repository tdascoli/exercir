var phases = new Map([
  ["phase1",{"id":"phase1","name":"Wir haben den Ball"}],
  ["phase2",{"id":"phase2","name":"Wir verlieren den Ball"}],
  ["phase3",{"id":"phase3","name":"Wir haben den Ball nicht"}],
  ["phase4",{"id":"phase4","name":"Wir erobern den Ball"}]]);

var topics = new Map([
	["TE", [
			{ "passspiel" : "Passspiel"},
			{ "ballmitnahme" : "Ballmitnahme"},
			{ "ballkontakt" : "1. Ballkontakt"},
			{ "unterdruck" : "Unter Druck"},
			{ "torschuss" : "Torschuss, Abschluss"},
			{ "dribbling" : "Dribbling, Finte"},
			{ "kopfball" : "Kopfball"}
		]],
	["TA", [
		  	{ "1vs1" : "1:1"},
			{ "spielaufbau" : "Spielaufbau"},
			{ "abschluss" : "Abschluss"},
			{ "toreverhindern" : "Tore verhindern"},
			{ "ballerobern" : "Ball erobern"},
			{ "umschalten" : "Umschalten"}
		]],
	["KO", [
			{ "ausdauer" : "Ausdauer"},
			{ "schnelligkeit" : "Schnelligkeit"},
			{ "koordination" : "Koordination"}
		]],
	["Kognitiv", [
			{ "orientierung" : "Orientierung, Entscheide"}
		]],
]);

function Variety(){
  var self = this;

  self.description = ko.observable();
  self.image = ko.observable();
};

function Topic(){
  var self = this;

  self.selectedTopicIds = ko.observableArray();
  self.selectedTopics = ko.computed(function() {
    return ko.utils.arrayMap(self.selectedTopicIds(),                           function(id) {
      var index = id.split("-");
      var main = index[0];
      var topic = topics.get(main)[index[1]][index[2]];
      return main +' > '+ topic;
    });
  });
};

function Phase(){
  var self = this;

  self.selectedPhasesIds = ko.observableArray();
  self.selectedPhases = ko.computed(function() {
    return ko.utils.arrayMap(self.selectedPhasesIds(),                      function(id) {
      return phases.get(id);
    });
  });
};

function Exercise(){
  var self = this;

  self.phase = new Phase();
  self.topic = new Topic();

  self.title = ko.observable();
  self.organisation = ko.observable();
  self.procedure = ko.observable();
  self.coaching = ko.observable();
  self.image = ko.observable();

  self.isExtended = ko.observable(true);

  self.varieties = ko.observableArray();

  self.addVariety = function(){
    self.varieties.push(new Variety());
  };
};

function ExercirViewModel(){
  var self = this;

  self.exercises = ko.observableArray();
  self.exercise = new Exercise();

  self.phases = Array.from(phases.values());
  self.topics = ko.observableArray();
  Array.from(topics.keys()).forEach(function(value){
    var tpcs = Array.from(topics.get(value))
                .map(function(topic){
                  return { key: Object.keys(topic)[0],
                           value: Object.values(topic)[0]};
                });
    self.topics.push({
      main: value,
      topics: tpcs});
  });

  self.save = function(){
    console.log('save',self.exercise);
  };


  self.fileData = ko.observable({
            file: ko.observable(), // will be filled with a File object
            // Read the files (all are optional, e.g: if you're certain that it is a text file, use only text:
            binaryString: ko.observable(), // FileReader.readAsBinaryString(Blob|File) - The result property will contain the file/blob's data as a binary string. Every byte is represented by an integer in the range [0..255].
            text: ko.observable(), // FileReader.readAsText(Blob|File, opt_encoding) - The result property will contain the file/blob's data as a text string. By default the string is decoded as 'UTF-8'. Use the optional encoding parameter can specify a different format.
            dataURL: ko.observable(), // FileReader.readAsDataURL(Blob|File) - The result property will contain the file/blob's data encoded as a data URL.
            arrayBuffer: ko.observable(), // FileReader.readAsArrayBuffer(Blob|File) - The result property will contain the file/blob's data as an ArrayBuffer object.

            // a special observable (optional)
            base64String: ko.observable(), // just the base64 string, without mime type or anything else

            // a "file types" observable to denote acceptable file types (optional)
            // accepts any string value that is valid for the `accept` attribute of a file input
            // if provided, will override the `accept` attribute on the target file input
            // if not provided, the value of the `accept` attribute will be used
            fileTypes: ko.observable(),

            onInvalidFileDrop: function(fileData) {
              // do something with rejected file
            },


            // you can have observable arrays for each of the properties above, useful in multiple file upload selection (see Multiple file Uploads section below)
            // in the format of xxxArray: ko.observableArray(),
            /* e.g: */ fileArray: ko.observableArray(), base64StringArray: ko.observableArray(),
          });

  self.fileData().text.subscribe(function(text){
    // do something
  });

  self.fileData().base64String.subscribe(function(base64String){
    //sendToServer(base64String);
    console.log(base64String);
  });
};

ko.fileBindings.defaultOptions = {
  wrapperClass: 'input-group',
  fileNameClass: 'disabled form-control',
  noFileText: 'No file chosen',
  buttonGroupClass: 'input-group-btn',
  buttonClass: 'btn btn-primary',
  clearButtonClass: 'btn btn-default',
  buttonText: 'Choose File',
  changeButtonText: 'Change',
  clearButtonText: 'Clear',
  fileName: true, // show the selected file name?
  clearButton: true, // show clear button?
  onClear: function(fileData, options) {
      if (typeof fileData.clear === 'function') {
          fileData.clear();
      }
  }
};

// change a default option
ko.fileBindings.defaultOptions.buttonText = 'Browse';

ko.applyBindings(new ExercirViewModel());
