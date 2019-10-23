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
			{ "torschuss" : "Torschuss"},
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
			{ "koordination" : "Koordination"},
			{ "orientierung" : "Orientierung"},
    	{ "entscheide" : "Entscheide"}
		]],
]);

// utils
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
};

function File(){
  var self = this;

  self.fileData = ko.observable({
    file: ko.observable(), // will be filled with a File object
    dataURL: ko.observable(), // FileReader.readAsDataURL(Blob|File) - The result property will contain the file/blob's data encoded as a data URL.
    base64String: ko.observable() // just the base64 string, without mime type or anything else
  });

  self.fileData().base64String.subscribe(function(base64String){
    //sendToServer(base64String);
    console.log('base64String');
  });
}

function Variety(){
  var self = this;

  self.description = ko.observable('');
  self.image = new File();
};

function Topic(){
  var self = this;

  self.selectedTopicIds = ko.observableArray();
  self.selectedTopics = ko.computed(function() {
    return ko.utils.arrayMap(self.selectedTopicIds(),
    function(id) {
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
    return ko.utils.arrayMap(self.selectedPhasesIds(),
    function(id) {
      return phases.get(id);
    });
  });
};

function Exercise(uuid = uuidv4()){
  var self = this;

  self.uuid = uuid;

  self.phase = new Phase();
  self.topic = new Topic();

  self.title = ko.observable();
  self.organisation = ko.observable('');
  self.procedure = ko.observable('');
  self.coaching = ko.observable('');
  self.image = new File();

  self.isExtended = ko.observable(true);

  self.varieties = ko.observableArray();
  self.hasVarieties = ko.computed(function(){
    return (self.varieties().length>0);
  });
  self.addVariety = function(){
    self.varieties.push(new Variety());
  };
};

function ExercirViewModel(){
  var self = this;

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
    console.log('save',ko.toJSON(self.exercise));
  };
};

ko.fileBindings.defaultOptions = {
  wrapperClass: 'input-group',
  fileNameClass: 'disabled form-control',
  noFileText: 'No file chosen',
  buttonGroupClass: 'input-group-append',
  buttonClass: 'btn btn-secondary',
  clearButtonClass: 'btn btn-warning',
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
