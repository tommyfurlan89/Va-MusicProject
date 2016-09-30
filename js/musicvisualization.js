/**************************************************************
VISUALIZATION
**************************************************************/

function visualization () {

    barchart();
	radarchart("All");
	bubblechart("All");
    piedonutchart("All");
    groupedbarchart("All");
    statisticalchart();
}

/***************************/

function barchart() {
  

    var mydata = barchart_dataset();

    //console.log(mydata);
    //console.log(mydata[0].Genre); //Nome genere
    //console.log(mydata[0].Songs); //Valore genere
    //console.log(mydata.length);


	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
		return "<span style='color:black;font-family: Verdana,sans-serif;'>Genre: <span id='1' style='font-family: Verdana,sans-serif;'>" + d.Genre + "<br>" +"</span>"+"Frequency: <span id='2' style='font-family: Verdana,sans-serif;'>" + (d.Songs)+" ("+(d3.format(".2%")(d.Songs/10000))+")" + "</span></span>";
		 });

    var div = d3.select("#bar_cont").append("div").attr("class", "toolTip_bar");

    var axisMargin = 20,
            margin = 40,
            valueMargin = 4,
            width = parseInt(d3.select('#bar_cont').style('width'), 10),
            height = parseInt(d3.select('#bar_cont').style('height'), 10),
            barHeight = (height-axisMargin-margin*2)* 0.8/mydata.length,
            barPadding = (height-axisMargin-margin*2)*0.2/mydata.length,
            mydata, bar, svg, scale, xAxis, labelWidth = 0;
    max = d3.max(mydata, function(d) { return d.Songs; });

    svg = d3.select('#bar_cont')
            .append("svg")
            .attr("width", width)
            .attr("height", height);


    bar = svg.selectAll("g")
            .data(mydata)
            .enter()
            .append("g")
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);
						
	svg.call(tip);

    bar.attr("class", "bar")
            .attr("cx",0)
            .attr("transform", function(d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

    bar.append("text")
            .attr("class", "label_bar")
            .attr("y", barHeight / 2)
            .attr("dy", ".35em") //vertical align middle
            .text(function(d){
                return d.Genre;
            })
            .style("fill","black")
            .style("font-weight","bold")
            .each(function() {
        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
    });

    scale = d3.scale.linear()
            .domain([0, max])
            .range([0, width - margin*2 - labelWidth]);

    xAxis = d3.svg.axis()
            .scale(scale)
            .tickSize(-height + 2*margin + axisMargin)
            .orient("bottom");

    bar.append("rect")
            .attr("transform", "translate("+labelWidth+", 0)")
            .attr("height", barHeight)
            .attr("width", function(d){
                return scale(d.Songs);
            });

    bar.append("text")
            .attr("class", "value")
            .attr("y", barHeight / 2)
            .attr("dx", - valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .attr("x", function(d){
                var width = this.getBBox().width;
                return Math.max(width + valueMargin, scale(d.Songs));
            });


    svg.insert("g",":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
            .call(xAxis);
	
	var colorTip = $(".bar").css( "fill" );
	$( ".d3-tip" ).css( "background" ,"#dd6865");
	$( ".d3-tip" ).css( "border-color" ,"#dd3935");	 
}

/***************************/

function radarchart(genre){

  var RadarChart = {
  draw: function(id, d, options){
  var cfg = {
     radius: 5,
    // w: 600,
     // h: 600,
     factor: 1,
     factorLegend: .85,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0.5,
     ToRight: 5,
     TranslateX: 80,
     TranslateY: 30,
     ExtraWidthX: 100,
     ExtraWidthY: 100,
     color: (function(j, i){ return Fill_chart[series];})
    };
    
    if('undefined' !== typeof options){
      for(var i in options){
        if('undefined' !== typeof options[i]){
          cfg[i] = options[i];
        }
      }
    }
    cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
    var allAxis = (d[0].map(function(i, j){return i.axis}));
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format_tooltip = d3.format('.2%');
    var Format = d3.format("%");
    d3.select(id).select("svg").remove();
    
    var g = d3.select(id)
            .append("svg")
            .attr("width", cfg.w+cfg.ExtraWidthX)
            .attr("height", cfg.h+cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
            ;

    //var tooltip;

    var div = d3.select("#radarchart").append("div").attr("class", "toolTip_radar");
    
    //Il segmento circolare
    for(var j=0; j<cfg.levels-1; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    // Il testo che indica a quale livello si è
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data([1]) //dummy data
       .enter()
       .append("svg:text")
       .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
       .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
       .attr("class", "legend")
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
       .attr("fill", "#737373")
       .text(Format((j+1)*cfg.maxValue/cfg.levels));
    }
    
    series = 0;

    var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

    axis.append("line")
        .attr("x1", cfg.w/2)
        .attr("y1", cfg.h/2)
        .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
        .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

    axis.append("text")
        .attr("class", "legend")
        .text(function(d){return d})
        .style("font-family", "sans-serif")
        .style("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", function(d, i){return "translate(0, -10)"})
        .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
        .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

 
    d.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes")
        .data(y, function(j, i){
          dataValues.push([
            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
          ]);
        });
      dataValues.push(dataValues[0]);
      g.selectAll(".area")
                     .data([dataValues])
                     .enter()
                     .append("polygon")
                     .attr("class", "radar-chart-serie"+series)
                     .style("stroke-width", "2px")
                     .style("stroke", cfg.color(series))
                     .attr("points",function(d) {
                         var str="";
                         for(var pti=0;pti<d.length;pti++){
                             str=str+d[pti][0]+","+d[pti][1]+" ";
                         }
                         return str;
                      })
                     .style("fill", function(j, i){return cfg.color(series)})
                     .style("fill-opacity", cfg.opacityArea)
                     .on('mouseover', function (d){
                                        z = "polygon."+d3.select(this).attr("class");
                                        g.selectAll("polygon")
                                         .transition(200)
                                         .style("fill-opacity", 0.1); 
                                        g.selectAll(z)
                                         .transition(200)
                                         .style("fill-opacity", .7);
                                      })
                     .on('mouseout', function(){
                                        g.selectAll("polygon")
                                         .transition(200)
                                         .style("fill-opacity", cfg.opacityArea);
                     });
      series++;
    });
    series=0;

    d.forEach(function(y, x){
      g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie"+series)
        .attr('r', cfg.radius)
        .attr("alt", function(j){return Math.max(j.value, 0)})
        .attr("cx", function(j, i){
          dataValues.push([
            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
        return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
        })
        .attr("cy", function(j, i){
          return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("data-id", function(j){return j.axis})
        .style("fill", cfg.color(series)).style("fill-opacity", .9)
        .on("mousemove", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY-25+"px");
                div.style("display", "inline-block");
				div.style( "background" ,"rgb(218, 218, 235)");
				div.style( "border-color" ,"rgb(158, 154, 200)");
				div.style("padding", "2px");
				div.style("text-align", "left");
				div.style("border-radius","5px");
				div.style("border-style","solid");
				div.style("border-width","1px");
				div.style("margin-left", "200px"); //non mi piace molto adottare questo tipo di soluzioni perchè sono difficili da gestire su schermi di diverse dimensioni
                div.html("<span style='color:black;font-family: Verdana,sans-serif;font-size:9px'>Songs:  "+d.songs+" <br> Percentage: "+Format_tooltip(d.value)+"</span>");
            })
        .on("mouseout", function(d){
                div.style("display", "none");
            })
        //.append("svg:title")
        //.text(function(j){return Math.max(j.value, 0)})
        ;

      series++;
    });

    //Tooltip
    tooltip = g.append('text')
               .style('opacity', 0)
               .style('font-family', 'Verdana,sans-serif')
               .style('font-size', '9px');
  }
};

var w = 300,
	h = 300;

//i colori della legenda
var Fill_chart = ["#D21F1B " , "steelblue"];

//Introduciamo  dati con la relativa nota e la percentuale sul totale
var dataset = chart_dataset(genre,"key");
//console.log(dataset);

//ci appoggiamo ad una più semplice struttura per gestire velocemente i dati
var d = [
		  [
			{axis:"DO", songs:dataset[0].Songs, value:dataset[0].Percentage},
			{axis:"RE",songs:dataset[2].Songs,value:dataset[2].Percentage},
			{axis:"MI",songs:dataset[4].Songs,value:dataset[4].Percentage},
			{axis:"FA",songs:dataset[6].Songs,value:dataset[6].Percentage},
			{axis:"SOL",songs:dataset[8].Songs,value:dataset[8].Percentage},
			{axis:"LA",songs:dataset[10].Songs,value:dataset[10].Percentage},
			{axis:"SI",songs:dataset[12].Songs,value:dataset[12].Percentage}
		  ],[
			{axis:"DO",songs:dataset[1].Songs,value:dataset[1].Percentage},
			{axis:"RE",songs:dataset[3].Songs,value:dataset[3].Percentage},
			{axis:"MI",songs:dataset[5].Songs,value:dataset[5].Percentage},
			{axis:"FA",songs:dataset[7].Songs,value:dataset[7].Percentage},
			{axis:"SOL",songs:dataset[9].Songs,value:dataset[9].Percentage},
			{axis:"LA",songs:dataset[11].Songs,value:dataset[11].Percentage},
			{axis:"SI",songs:dataset[13].Songs,value:dataset[13].Percentage}
		  ]
		];


    //console.log(d);

	//Le impostazioni per il radar chart
	var mycfg = {
	  w: w,
	  h: h,
	  maxValue: 0.15,
	  levels: 10,
	  ExtraWidthX: 300
	}

	//Si richiama la funzione per disegnare il grafico (funzione presente nel file RadarChart.js)
	//Si aspetta i dati in formato %
	RadarChart.draw("#radar", d, mycfg);
	}


/***************************/

	
function bubblechart(genre){

    var dataset_duration = bubble_dataset(genre,"duration_m"); //ho rimesso il vecchio dataset per con percentage non formattava bene le percentuali e poi cambiavano i colori
    //console.log(dataset_duration);
    var dataset_loudness = bubble_dataset(genre,"loudness");
    //console.log(dataset_loudness);
    
var Format_perc = d3.format('.2%');

var margin_platelets = {top:40,left:40,right:40,bottom:40};
width_platelets = 300;
height_platelets = 300;
radius_platelets = Math.min(width_platelets-100,height_platelets-100)/2;
var color_platelets = d3.scale.category20();
var arc_platelets = d3.svg.arc()  
         .outerRadius(radius_platelets -230)
         .innerRadius(radius_platelets - 50)
		 .cornerRadius(20);
/*var arcOver_platelets = d3.svg.arc()  
.outerRadius(radius_platelets +50)
.innerRadius(0);
*/

var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
		return "<span style='color:black;font-family: Verdana,sans-serif;font-size:9px'>Category: "+d.data.level+"</br>"+"Songs: "+d.data.songs+"</br>"+"Percentage: "+Format_perc((d.data.songs)/(occorrenze_genre(genre)))+"</span>";
		 });

var a_platelets=width_platelets/2 - 20;
var b_platelets=height_platelets/2 - 90;
var svg = d3.select("#bubble_chart").append("svg")
          .attr("viewBox", "0 0 " + width_platelets + " " + height_platelets/2)
    .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")
          .attr("transform","translate("+a_platelets+","+b_platelets+")");

		  div = d3.select("bubble_chart")
.append("div") 
.attr("class", "tooltip");
var pie = d3.layout.pie()
          .sort(null)
          .value(function(d){
            return d.songs;})
		  .padAngle(.02);
var g = svg.selectAll(".arc")
        .data(pie(dataset_duration))
        .enter()
        .append("g")
        .attr("class","arc")
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
						
	svg.call(tip);
	
	
	/*
         .on("mousemove",function(d){
        	var mouseVal = d3.mouse(this);
        	div.style("display","none");
        	div
        	.html("Category: "+d.data.duration_m+"</br>"+"Songs: "+d.data.Songs+"</br>"+"Percentage: "+d.data.Percentage)
            .style("left", (d3.event.pageX+12) + "px")
            .style("top", (d3.event.pageY-10) + "px")
            .style("opacity", 1)
            .style("display","block");
        })
        .on("mouseout",function(){div.html(" ").style("display","none");});
        */
        
        
		g.append("path")
		.attr("d",arc_platelets)
		.style("fill",function(d){ return color_platelets(d.data.level);})
		 .attr("d", arc_platelets);

$(".d_v").click(function(){
	$("#bubble_chart").empty();
	if($(this).val()=='duration'){
		var svg = d3.select("#bubble_chart").append("svg")
          .attr("viewBox", "0 0 " + width_platelets + " " + height_platelets/2)
    .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")
          .attr("transform","translate("+a_platelets+","+b_platelets+")");

		  div = d3.select("#bubble_chart")
			.append("div") 
			.attr("class", "tooltip");
			
			var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {
			return "<span style='color:black;font-family: Verdana,sans-serif;font-size:9px'>Category: "+d.data.level+"</br>"+"Songs: "+d.data.songs+"</br>"+"Percentage: "+Format_perc((d.data.songs)/(occorrenze_genre(genre)))+"</span>";
			 });
			var pie = d3.layout.pie()
					  .sort(null)
					  .value(function(d){return d.songs;})
					  .padAngle(.02);
			var g = svg.selectAll(".arc")
					.data(pie(dataset_duration))
					.enter()
					.append("g")
					.attr("class","arc")
					 .on('mouseover', tip.show)
					.on('mouseout', tip.hide);
						
			svg.call(tip);
					
					
					
					g.append("path")
					.attr("d",arc_platelets)
					.style("fill",function(d){return color_platelets(d.data.level);})
					 .attr("d", arc_platelets);
	}else{
		//console.log($(this).val());
		var svg = d3.select("#bubble_chart").append("svg")
          .attr("viewBox", "0 0 " + width_platelets + " " + height_platelets/2)
    .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")
          .attr("transform","translate("+a_platelets+","+b_platelets+")");

		  div = d3.select("#bubble_chart")
			.append("div") 
			.attr("class", "tooltip");
			var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {
			return "<span style='color:black;font-family: Verdana,sans-serif;font-size:9px'>Category: "+d.data.level+"</br>"+"Songs: "+d.data.songs+"</br>"+"Percentage: "+Format_perc((d.data.songs)/(occorrenze_genre(genre)))+"</span>";
			 });

      //console.log(occorrenze_genre(genre));
			var pie = d3.layout.pie()
					  .sort(null)
					  .value(function(d){return d.songs;})
					  .padAngle(.02);
			var g = svg.selectAll(".arc")
					.data(pie(dataset_loudness))
					.enter()
					.append("g")
					.attr("class","arc")
					.on('mouseover', tip.show)
					.on('mouseout', tip.hide);
						
			svg.call(tip);
					
					
					
					g.append("path")
					.attr("d",arc_platelets)
					.style("fill",function(d){return color_platelets(d.data.level);})
					 .attr("d", arc_platelets);
	}
});

}



/***************************/

function pieringchart_high(genre){

	var svg = dimple.newSvg("#piedonuthigh", 400, 440);

    var data = piedonut_dataset(genre);
    //console.log(data);

    var myChart_donut = new dimple.chart(svg, data.filter(function(d){
            if(d.Danceability=="High"){
               //console.log(d);
                return d;
            }
        })
      );

      //console.log(myChart_donut);
      //(margin left , margin top)
      myChart_donut.setBounds(60, 30, 200, 400);
      
      // Define all the axes
      var xAxis_donut = myChart_donut.addMeasureAxis("x", "x");
      var yAxis_donut = myChart_donut.addMeasureAxis("y", "y");
      var segments_donuts = myChart_donut.addMeasureAxis("p", "Songs");
      var size_donut = myChart_donut.addMeasureAxis("z", "Songs");
      var ring_donut = myChart_donut.addSeries(["Danceability", "Time_Signature"], dimple.plot.pie);
      var pie = myChart_donut.addSeries(["Danceability", "Tempo"], dimple.plot.pie);

      // Zoom in the axis bounds
      xAxis_donut.overrideMin = 0;
      xAxis_donut.overrideMax = 2;
      yAxis_donut.overrideMax = 2;


      var danceability = chart_dataset(genre,"danceability")[2].Songs;
      var dim_high = create_scale(danceability);
      //console.log(dammelo);

      ring_donut.radius = dim_high;
      pie.radius = dim_high;

      ring_donut.innerRadius = "-20px";
      pie.outerRadius = "-15px";
      
      myChart_donut.draw();


      d3.select("#danceability_h").append("div").text("["+danceability+"]");
}
/***************************/


function pieringchart_medium(genre){

    var svg = dimple.newSvg("#piedonutmedium", 400, 440);
    
    var data = piedonut_dataset(genre);
    //console.log(data);

    var myChart_donut = new dimple.chart(svg, data.filter(function(d){
            if(d.Danceability=="Medium"){
               //console.log(d);
                return d;
            }
        })
      );

      //console.log(myChart_donut);
      //(margin left , margin top)
      myChart_donut.setBounds(60, 30, 200, 400);
      
      // Define all the axes
      var xAxis_donut = myChart_donut.addMeasureAxis("x", "x");
      var yAxis_donut = myChart_donut.addMeasureAxis("y", "y");
      var segments_donuts = myChart_donut.addMeasureAxis("p", "Songs");
      var size_donut = myChart_donut.addMeasureAxis("z", "Songs");
      var ring_donut = myChart_donut.addSeries(["Danceability", "Time_Signature"], dimple.plot.pie);
      var pie = myChart_donut.addSeries(["Danceability", "Tempo"], dimple.plot.pie);

      // Zoom in the axis bounds
      xAxis_donut.overrideMin = 0;
      xAxis_donut.overrideMax = 2;
      yAxis_donut.overrideMax = 2;


      var danceability = chart_dataset(genre,"danceability")[1].Songs;
      var dim_medium = create_scale(danceability);
      //console.log(dammelo);

      ring_donut.radius = dim_medium;
      pie.radius = dim_medium;

      ring_donut.innerRadius = "-20px";
      pie.outerRadius = "-15px";
      
      myChart_donut.draw();


      d3.select("#danceability_m").append("div").text("["+danceability+"]");
}
/***************************/


function pieringchart_low(genre){

    var svg = dimple.newSvg("#piedonutlow", 400, 440);
    
    var data = piedonut_dataset(genre);
    //console.log(data);

    var myChart_donut = new dimple.chart(svg, data.filter(function(d){
            if(d.Danceability=="Low"){
               //console.log(d);
                return d;
            }
        })
      );

      //console.log(myChart_donut);
      //(margin left , margin top)
      myChart_donut.setBounds(60, 30, 200, 400);
      
      // Define all the axes
      var xAxis_donut = myChart_donut.addMeasureAxis("x", "x");
      var yAxis_donut = myChart_donut.addMeasureAxis("y", "y");
      var segments_donuts = myChart_donut.addMeasureAxis("p", "Songs");
      var size_donut = myChart_donut.addMeasureAxis("z", "Songs");
      var ring_donut = myChart_donut.addSeries(["Danceability", "Time_Signature"], dimple.plot.pie);
      var pie = myChart_donut.addSeries(["Danceability", "Tempo"], dimple.plot.pie);

      // Zoom in the axis bounds
      xAxis_donut.overrideMin = 0;
      xAxis_donut.overrideMax = 2;
      yAxis_donut.overrideMax = 2;


      var danceability = chart_dataset(genre,"danceability")[0].Songs;
      var dim_low = create_scale(danceability);
      //console.log(dammelo);

      ring_donut.radius = dim_low;
      pie.radius = dim_low;

      ring_donut.innerRadius = "-20px";
      pie.outerRadius = "-15px";
      
      myChart_donut.draw();


      d3.select("#danceability_l").append("div").text("["+danceability+"]");
}
/***************************/


function groupedbarchart(genre){
	var data = energyvalence_dataset(genre);


	var margin_ev = {top: 20, right: 20, bottom: 30, left: 40},
    width_ev = 770 - margin_ev.left - margin_ev.right,
    height_ev = 500 - margin_ev.top - margin_ev.bottom;

var x0_ev = d3.scale.ordinal()
    .rangeRoundBands([0, width_ev], .1);

var x1_ev = d3.scale.ordinal();

var y_ev = d3.scale.linear()
    .range([height_ev, 0]);

var color_ev = d3.scale.ordinal()
    .range(["rgb(31, 119, 180)","rgb(230, 85, 13)"]);

var xAxis_ev = d3.svg.axis()
    .scale(x0_ev)
    .orient("bottom");

var yAxis_ev = d3.svg.axis()
    .scale(y_ev)
    .orient("left")
    .tickFormat(d3.format(".2s"));
	
var tip_ev = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
        //console.log(d.name);
        //console.log(d.value);
	return "<span style='color:black;font-family: Verdana,sans-serif;'><b>"+d.name+"</b><br>Songs: <span style='color:black;font-family: Verdana,sans-serif;'>" + d.value + "</span></span>";
	 });

var svg = d3.select("#groupedbar").append("svg")
    .attr("width", width_ev + margin_ev.left + margin_ev.right)
    .attr("height", height_ev + margin_ev.top + margin_ev.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_ev.left + "," + margin_ev.top + ")");

  var categoryNames = d3.keys(data[0]).filter(function(key) { return key !== "Category"; });

  data.forEach(function(d) {
    d.cat = categoryNames.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0_ev.domain(data.map(function(d) { return d.Category; }));
  x1_ev.domain(categoryNames).rangeRoundBands([0, x0_ev.rangeBand()]);
  y_ev.domain([0, d3.max(data, function(d) { return d3.max(d.cat, function(d) { return d.value; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_ev + ")")
      .call(xAxis_ev);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis_ev)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Songs");

  var state = svg.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "state")
      .attr("transform", function(d) { return "translate(" + x0_ev(d.Category) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.cat; })
    .enter().append("rect")
      .attr("width", x1_ev.rangeBand())
      .attr("x", function(d) { return x1_ev(d.name); })
      .attr("y", function(d) { return y_ev(d.value); })
      .attr("height", function(d) { return height_ev - y_ev(d.value); })
      .style("fill", function(d) { return color_ev(d.name); })
	  .on('mouseover', tip_ev.show)
	  .on('mouseout', tip_ev.hide);
						
	svg.call(tip_ev);
	$( ".d3-tip" ).css( "background" ,"rgb(199, 233, 192)");
	$( ".d3-tip" ).css( "border-color" ,"rgb(116, 196, 118)");
}


/******************/

function statisticalchart() {

    var data = statisticalchart_dataset() ;

    //troncare i generi se sono troppo lunghi
    function truncate(str, maxLength, suffix) {
                if(str.length > maxLength) {
                    str = str.substring(0, maxLength + 1); 
                    str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
                    str = str + suffix;
                }
                return str;
            }

            var margin_bubbles = {top: 20, right: 200, bottom: 0, left: 30},
                width = 600,
                height = 650;
            
            var c_bubbles = d3.scale.category20c();
                
            var ds_bubbles = ["Acousticness","Instrumentalness","Speechiness"];
                
            var x_bubbles = d3.scale.ordinal()
                .domain(ds_bubbles)
                .rangePoints([0, width]); //label
                
                
                
            var xAxis_bubbles = d3.svg.axis()
                .scale(x_bubbles)
                .orient("top")
                .ticks(2);
                //.tickFormat(d3.format(".0s"));
            //
            //var formatYears = d3.format(function(d){ return d;});
            xAxis_bubbles.tickFormat(function(d){ return d;});
            
            //var xasse = ["acousticness","speechiness","instrumentalness"];

            var svg = d3.select("#statchart").append("svg")
                .attr("width", width + margin_bubbles.left + margin_bubbles.right)
                .attr("height", height + margin_bubbles.top + margin_bubbles.bottom)
                .style("margin-left", margin_bubbles.left + "px")
                .append("g")
                .attr("transform", "translate(" + margin_bubbles.left + "," + margin_bubbles.top + ")");


            
                
                var xScale_bubbles = d3.scale.ordinal()
                    .domain(ds_bubbles) //valori
                    .rangePoints([0, width]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + 0 + ")")
                    .call(xAxis_bubbles);

                for (var j = 0; j < data.length; j++) {
                    var g_bubbles = svg.append("g").attr("class","journal");

                    var circles_bubbles = g_bubbles.selectAll("circle")
                        .data(data[j]['attributes'])
                        .enter()
                        .append("circle");

                    var text_bubbles = g_bubbles.selectAll("text")
                        .data(data[j]['attributes'])
                        .enter()
                        .append("text");

                    var rScale_bubbles = d3.scale.linear()
                        .domain([0, d3.max(data[j]['attributes'], function(d) { return d[1]; })])
                        .range([5, 10]);
                        
                    var tip_bubbles = d3.tip()
                      .attr('class', 'd3-tip')
                      .offset([-10, 0])
                      .html(function(d) {
                        return "<span style='color:black;font-family: Verdana,sans-serif;'>High: <span style='color:black;font-family: Verdana,sans-serif;'>" + d[5] + "</span><br>Medium-High: <span style='color:black;font-family: Verdana,sans-serif;'>" + d[4] + "</span><br>Medium: <span style='color:black;font-family: Verdana,sans-serif;'>" + d[3] + "</span><br>Medium-Low: <span style='color:black;font-family: Verdana,sans-serif;'>" + d[2] + "</span><br>Low: <span style='color:black;font-family: Verdana,sans-serif;'>" + d[1] + "</span></span>";
                      });
                    
                    
                    circles_bubbles
                        .attr("cx", function(d, i) { 
                        //console.log(xScale_bubbles(d[0]));
                        return xScale_bubbles(d[0]); })
                        .attr("cy", j*30+20)
                        .attr("r", function(d) {
                            return scale_bubble(d[5]); 
                            }) //
                        .style("fill", function(d) { return c_bubbles(j); })
                        .on('mouseover', tip_bubbles.show)
                        .on('mouseout', tip_bubbles.hide);
                        
                    svg.call(tip_bubbles);
					$( ".d3-tip" ).css( "background" ,"rgb(218, 218, 235)");
					$( ".d3-tip" ).css( "border-color" ,"rgb(158, 154, 200)");

                    text_bubbles
                        .attr("y", j*30+25)
                        .attr("x",function(d, i) { return xScale_bubbles(d[0])-5; })
                        .attr("class","value")
                        .text(function(d){ return d[1]; })
                        .style("fill", function(d) { return c_bubbles(j); })
                        .style("display","none");

                    g_bubbles.append("text")
                        .attr("y", j*30+25)
                        .attr("x",width+20)
                        .attr("class","label")
                        .text(truncate(data[j]['genre'],30,"..."))
                        .style("fill", function(d) { return c_bubbles(j); });
                        //.on("mouseover", mouseover)
                        //.on("mouseout", mouseout)
                };

                function mouseover(p) {
                    var g_bubbles = d3.select(this).node().parentNode;
                    d3.select(g_bubbles).selectAll("circle").style("display","none");
                    d3.select(g_bubbles).selectAll("text.value").style("display","block");
                }

                function mouseout(p) {
                    var g_bubbles = d3.select(this).node().parentNode;
                    d3.select(g_bubbles).selectAll("circle").style("display","block");
                    d3.select(g_bubbles).selectAll("text.value").style("display","none");
                }
            
}



function piedonutchart(genre) {

  pieringchart_high(genre);
  pieringchart_medium(genre);
  pieringchart_low(genre);
}



/****************************************
UPDATE Visualization
****************************************/

function delete_visualization() {
  
  d3.selectAll("#radar svg").remove();
  d3.selectAll("#radar div").remove();

  d3.selectAll("#bubble_chart svg").remove();
  d3.selectAll("#bubble_chart div").remove();

  d3.selectAll("#piedonutlow svg").remove();
  d3.selectAll("#piedonutlow div").remove();
  d3.selectAll("#danceability_l div").remove();

  d3.selectAll("#piedonutmedium svg").remove();
  d3.selectAll("#piedonutmedium div").remove();
  d3.selectAll("#danceability_m div").remove();

  d3.selectAll("#piedonuthigh svg").remove();
  d3.selectAll("#piedonuthigh div").remove();
  d3.selectAll("#danceability_h div").remove();

  d3.selectAll("#groupedbar svg").remove();
  d3.selectAll("#groupedbar div").remove();

}


function delete_All() {

    delete_visualization();

    d3.selectAll("#bar_cont svg").remove();
    d3.selectAll("#bar_cont div").remove();

    d3.selectAll("#statchart svg").remove();
    d3.selectAll("#statchart div").remove();

}


function changeGenre(){
  //statsValue --> la voce del menù scelta
  value = d3.select("#genre").property("value");

    delete_visualization();

    radarchart(value);
    bubblechart(value);
    piedonutchart(value);
    groupedbarchart(value);

  /*
  barchart & statisticalchart non hanno bisogno dell'aggiornamento
  */
}


function restart() {

    value = d3.select("#genre").property("value");

    delete_All();

    barchart();
    radarchart(value);
    bubblechart(value);
    piedonutchart(value);
    groupedbarchart(value);
    statisticalchart();

}


/****************************
OTHER
******************************/



function play() {
    d3.select("#selector").classed("hide", false);
    delete_All();
    d3.select("#container_vis").classed("hide", false);
    restart();
}


function stop() {

    d3.select("#selector").classed("hide", true);
    d3.select("#container_vis").classed("hide", true);

}
