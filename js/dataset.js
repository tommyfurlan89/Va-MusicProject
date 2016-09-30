/**************************************************************
DATASET
**************************************************************/


/*Utilizzamo una funzione per richiamare tutte quelle che 
inizalizzano e riempiono la struttura dati che andremo ad 
utilizzare per maneggiare al meglio i dati di cui 
avremo bisogno*/
function start() {
  
  create_struture();
  crete_sameDatasetStructure();
  attr_population(); 
  all_population();
  add_option(); 
}




/*
//crea la struttura dati vuota
//Versione funzionante su Firefox
function create_struture() {
  _GENRES10_.forEach(function(name){
    _WORKDATASET_[name] = {};
    var i=0;
    Object.keys(_ATTR_).forEach(function(stat){
      _WORKDATASET_[name][stat] = [];
      
    for (j=0 ; j<Object.values(_ATTR_)[i].length ; j++){
      _WORKDATASET_[name][stat].push([Object.values(_ATTR_)[i][j],0]);
    }
    i++;
  });
});

 
  console.log(_WORKDATASET_);
  //console.log(_WORKDATASET_["Pop/Rock"]);
  //console.log(_WORKDATASET_["Pop/Rock"]["acousticness"]);
  //console.log(_WORKDATASET_["Pop/Rock"]["acousticness"].length);
  //console.log(_WORKDATASET_["Pop/Rock"]["acousticness"][1]);
  //console.log(_WORKDATASET_["Pop/Rock"]["acousticness"][1][1]);


  
}
*/




//Versione funzionante su Chrome
function create_struture() {
  _GENRES10_.forEach(function(name){
    _WORKDATASET_[name] = {};
    var i=0;
    Object.keys(_ATTR_).forEach(function(stat){
      _WORKDATASET_[name][stat] = [];
      
       var aux = Object.keys(_ATTR_).map(function(key) {
    return _ATTR_[key];
    });

    for (j=0 ; j<aux[i].length ; j++){
      _WORKDATASET_[name][stat].push([aux[i][j],0]);
    }
    i++;
  });
});

}


function crete_sameDatasetStructure() {

  for (var i=0 ; i<10000 ; i++) {

    _DATASET_[i] = {};
    _DATASET_[i]["Tempo"] = "";
    _DATASET_[i]["Time_Signature"]= 0;
    _DATASET_[i]["Danceability"]= "";
    _DATASET_[i]["Songs"]= 0;
    _DATASET_[i]["x"]= 0;
    _DATASET_[i]["y"]= 0;
    _DATASET_[i]["Genre"]= "";

  }

  d3.csv("csv/donutpie.csv",function(songs){

    for (var i=0 ; i<songs.length ; i++) {
    _DATASET_[i]["Tempo"] = songs[i].tempo;
    _DATASET_[i]["Time_Signature"]= songs[i].time_signature;
    _DATASET_[i]["Danceability"]= songs[i].danceability;
    _DATASET_[i]["Songs"]= songs[i].c;
    _DATASET_[i]["x"]= songs[i].x;
    _DATASET_[i]["y"]= songs[i].y;
    _DATASET_[i]["Genre"]= songs[i].Genre;
    }
  });


}



/*Per ogn attributo e rispettiva categoria, aggiunge il valore
raggruppato per genere musicale*/
function attr_population() {

  var all = "All";
  var attr;
  d3.csv("csv/def.csv",function(songs){
    for (i=0 ; i<songs.length;i++){
      for (j=0 ; j<11;j++){
        attr = Object.keys(songs[i])[j];
        for(k=0 ; k<_WORKDATASET_[songs[i].Genre][attr].length ; k++){
          if (_WORKDATASET_[songs[i].Genre][attr][k][0] == songs[i][attr]){
            _WORKDATASET_[songs[i].Genre][attr][k][1]++;
          }
        }
      }
    }
  });
}

/*Riempie la categoria ALL che sarà quella di default delle
nostre visualizzazioni*/
function all_population() {
  var all = "All";
  var attr;
  d3.csv("csv/def.csv",function(songs){
    for (i=0 ; i<songs.length ; i++) {
      for (j=0 ; j<11;j++){
        attr = attr = Object.keys(songs[i])[j];
        for (k=0 ; k<_WORKDATASET_[all][attr].length;k++) {
          if(_WORKDATASET_[all][attr][k][0] == songs[i][attr]){
            _WORKDATASET_[all][attr][k][1]++;
          }
        }
      }
    }
  });
}



//Aggiungiamo le voci al form dei generi
function add_option(){
  var genre_select = d3.select("#genre")
              .on("change",changeGenre)
              .selectAll("option")
              .data(_GENRES10_)
              .enter()
              .append("option")
              .attr("name",function(d) {return d; })
              .attr("value",function(d) {return d; })
              .text(function (d) { return d; });
  }



/********************************************
Creazione Dataset per visualizzazioni
*********************************************/


function occorrenze_genre (genre){

  var count = 0 ;
  //si sceglie un attributo a caso , tanto il conto sarà sempre uguale per tutti gli attributi
  var attr = "acousticness";  

    for(i=0 ; i<5 ; i++){
      count = count+_WORKDATASET_[genre]["acousticness"][i][1];
    }
    return count;
}



function  barchart_dataset (){

  var data = [];
  var row =0 ;

  Object.keys(_WORKDATASET_).forEach(function (genres){
    
    if (genres != "All"){
    data[row] = {};
    data[row]["Genre"] = genres;
    data[row]["Songs"] = occorrenze_genre(genres) ;
    row++;
  }
  });
  return data;
}


function chart_dataset(genre,attr) {

  var data = [];
  var row = 0 ;

  (_WORKDATASET_[genre][attr]).forEach(function (category){
    data[row] = {};
    data[row][attr] = category[0];
    data[row]["Songs"] = category[1];
    data[row]["Percentage"] = category[1]/occorrenze_genre(genre);
    row++;
  }); 
  
  //console.log(_WORKDATASET_);
  //console.log(data);
  return data ;

}


function piedonut_dataset(genre) {

  var data = [];
  var row = 0 ;

  if (genre == "All"){
    for (var i=0 ; i<_DATASET_.length ; i++) {
      data[row] = {};
      data[row]["Tempo"] = _DATASET_[i].Tempo;
      data[row]["Time_Signature"] = _DATASET_[i].Time_Signature;
      data[row]["Danceability"] = _DATASET_[i].Danceability;
      data[row]["Songs"] = _DATASET_[i].Songs;
      if (i==0 || i==1 || i==2){
      data[row]["x"] = 1;
      data[row]["y"] = 1;
    }
    else {
      data[row]["x"] = 0;
      data[row]["y"] = 0;
    }

      row++;
   }
  }

  else{
  for (var i=0 ; i<_DATASET_.length ; i++) {

    if (_DATASET_[i].Genre == genre){
      data[row] = {};
      data[row]["Tempo"] = _DATASET_[i].Tempo;
      data[row]["Time_Signature"] = _DATASET_[i].Time_Signature;
      data[row]["Danceability"] = _DATASET_[i].Danceability;
      data[row]["Songs"] = _DATASET_[i].Songs;
      data[row]["x"] = _DATASET_[i].x;
      data[row]["y"] = _DATASET_[i].y;

      row++;
    }
  }
}
  return data;
}



function bubble_dataset(genre,attr) {

  var data = [];
  var row = 0 ;

  (_WORKDATASET_[genre][attr]).forEach(function (category){
    data[row] = {};
    data[row]["level"] = category[0];
    data[row]["songs"] = category[1];
    row++;
  }); 
  
  //console.log(_WORKDATASET_);
  //console.log(data);
  return data ;

}



function energyvalence_dataset(genre) {

  var data = [];
  var row = 0 ;

  (_WORKDATASET_[genre]["energy"]).forEach(function (category){
    data[row] = {};
    data[row]["Category"] = category[0];
    data[row]["Energy"] = category[1];
    row++;
  });

  row = 0 ;

  (_WORKDATASET_[genre]["valence"]).forEach(function (category){
    
    data[row]["Category"] = category[0];
    data[row]["Valence"] = category[1];
    row++;
  });  
  
  //console.log(_WORKDATASET_);
  //console.log(data);
  return data ;

}


function statisticalchart_dataset() {

  var data = [];
  var row=0;
  const _TRIO_ = ["acousticness","instrumentalness","speechiness"];
  const _NAMETRIO_ = ["Acousticness","Instrumentalness","Speechiness"];


  Object.keys(_WORKDATASET_).forEach(function (genres){

    if (genres != "All") {
      data[row] = {};
      data[row]["genre"] = genres;
      data[row]["attributes"] = [];

      for (var i=0 ; i<_TRIO_.length ; i++) {

        data[row]["attributes"][i] = [];

        data[row]["attributes"][i][0] = _NAMETRIO_[i];

        data[row]["attributes"][i][1] = _WORKDATASET_[genres][_TRIO_[i]][0][1];

        data[row]["attributes"][i][2] = _WORKDATASET_[genres][_TRIO_[i]][1][1];

        data[row]["attributes"][i][3] = _WORKDATASET_[genres][_TRIO_[i]][2][1];

        data[row]["attributes"][i][4] = _WORKDATASET_[genres][_TRIO_[i]][3][1];

        data[row]["attributes"][i][5] = _WORKDATASET_[genres][_TRIO_[i]][4][1];

      }

      row++;
    }
  });

  //console.log(data);

  return data;
}






function create_scale(dim) {

var myscale = d3.scale.linear()
                .domain([1,5598])
                .range([50,150]);
  
  //console.log(myscale(dim));
  
  return myscale(dim)

}


function scale_bubble(dim){
var myscale_bubble = d3.scale.linear()
                .domain([0,727])
                .range([5,13]);
    return myscale_bubble(dim);
  }




