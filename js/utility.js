/*creiamo delle costanti con i dati che dati che ci serviranno per creare i filtri delle visualizzazioni o che comunque ricorreranno spesso! */
const _GENRES10_ = ["All","Latin","International","Reggae", "Electronic","R&B","Country","Jazz","Rap","Blues","Pop/Rock"];

const _GENRES5_ = ["All","Country","Jazz","Rap","Blues","Pop/Rock"];

const _ATTR_ = {
		"energy" :["Low","Medium-Low","Medium","Medium-High","High"] ,
 		"tempo" : ["Lento","Andante","Moderato","Vivace","Presto"] ,
 		"speechiness" : ["Low","Medium-Low","Medium","Medium-High","High"],
  		"acousticness" : ["Low","Medium-Low","Medium","Medium-High","High"], 
  		"instrumentalness" : ["Low","Medium-Low","Medium","Medium-High","High"],
  		"time_signature" : [1,3,4,5],
   		"danceability" : ["Low","Medium","High"], 
   		"key" : ["DO Major","DO Minor","RE Major", "RE Minor" , "MI Major","MI Minor","FA Major","FA Minor","SOL Major","SOL Minor","LA Major","LA Minor","SI Major", "SI Minor"], 
   		"duration_m" : ["<1","[1 - 2.99]" , "[3 - 4.99]","[5 - 9.99]",">10"], 
   		"loudness" : ["<0","[0 - 19.99]" , "[20 - 39.99]" , "[40 - 60]"] , 
   		"valence" : ["Low","Medium-Low","Medium","Medium-High","High"]
   	};



/*utilizziamo delle variabili per semplificare le già pesanti operazioni di caricamento dati*/

var _WORKDATASET_ = {};

var _DATASET_ = [] ;
