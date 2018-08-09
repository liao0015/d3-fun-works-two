import * as d3 from 'd3';

//global variables
let width, height, margin;
let svg, color;

export function renderBubble1(data, container){
    //console.log(data.data);
    container.selectAll('*').remove();
    generateCirclePack(data.data, container);
}

function generateCirclePack(data, container){
    data.forEach(function(d){
        d.value = +d.value;
    });

    width = 960, height = 960;
    margin = 110; //needed if zoomable

    color = d3.scaleSequential(d3.interpolateRdBu);

    svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "white");

    //initialize pack() configuration and calculate root
    let pack = d3.pack().size([width-margin, height-margin]).padding(2);
    let stratify = d3.stratify()
        .parentId(function(d){
            //console.log(d);//loop through all objs
            //console.log(d.id.substring(0, d.id.lastIndexOf("@"))); // returns everything before the last node as parentId
            return d.id.substring(0, d.id.lastIndexOf('@'));
        });
    let root = stratify(data)
        .sum(function(d){return d.value;})//console.log(d); //loop through each obj and sum up all values
        .sort(function(a,b){return b.value - a.value; });

    //console.log(root);    //root depth and height now accessible
    //color.domain([0,7]);
    //update color domain
    color.domain([root.depth, root.height]);

    // now everything will be packed to a single root with children, x, y, r, and value are becoome available
    // You must call root.sum before passing the hierarchy to the pack layout. 
    // You probably also want to call root.sort to order the hierarchy before computing the layout.
    // pack(root); this function will calculate node.x, node.y and node.r
    // console.log(root.descendants());

    //initialize nodes ("g" element) with data binding
    let ng = svg.append('g')
        .attr('transform', `translate(${(width-margin)/2},${(height-margin)/2})`);
    let node = ng.selectAll('g')
        .data(pack(root).descendants())
        .enter().append('g')
            .attr('class', function(d){return "node" + (!d.children ? " node--leaf" : d.depth ? "" : " node--root");})
            .each(function(d){
                //d.node will be available upon drawing the chart, which is the HTML node ele, this selection enable mouse events on each node
                //console.log(d);
                d.node = this;
            })
            .on('mouseover', hovered(true))
            .on('mouseout', hovered(false));

    //append circle to each node
    let circle = node.append('circle')
        .attr('id', function(d, i){return `node-circle-${i}`})
        .attr('r', function(d){return d.r; })
        .attr('fill', function(d){
            //console.log(color);
            return color(d.height); 
        });

    // append path that is based on circle parameters to each node
    // append text and textPath to each node based on path
    let textCurve = node.append('path')
        .attr('d', function(d){
            //console.log(d);
            //return d.depth<=2 ? getCurveTextPathData(0, 0, d.r) : "";  //draw half circle arc
            //return d.depth<=2 ? describeArc(0, 0, d.r, 60, 300, 1, 0) : ""; //based on depth
            return d.r>45 ? describeArc(0, 0, d.r, 60, 300, 1, 0) : null; //based on radius
        })
        .attr('id', function(d,i){return `curve-text-path-${i}`; });

    let textLabel = node.append('text')
        .attr('class', 'curve-text-labels')
        .append('textPath')
        .attr('xlink:href', function(d, i){
            return `#curve-text-path-${i}`;
        })
        .style('text-anchor', 'start')
        .style('color', 'red')
        .attr('startOffset', '30%')
        .text(function(d){
            //return d.depth<=2 ? d.id.substring(d.id.lastIndexOf("@") + 1) : "";  //based on depth
            return d.r>45 ? d.id.substring(d.id.lastIndexOf("@") + 1) : null; //based on radius
        });
    
    //append legend to svg
    generateCirclePackLegend(svg,  width, margin, root.depth, root.height, color)

    //zooming
    let focus = root;
    let view; 
    let nodes = ng.selectAll(".node");

    svg.on("click", function(){zoom(root); });

    circle.on("click", function(d){
        // console.log(d);
        // console.log(focus);
        //check if selection is current root
        if (focus !== d) zoom(d), d3.event.stopPropagation();
    });

    //called upon the first rendering
    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d){
        //console.log(d);
        let focus0 = focus;
        focus = d;

        let transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function(){
                // console.log(focus.x);
                // console.log(view[0]);
                //transition.tween(name[, value])
                //For each selected element, assigns the tween with the specified name with the specified value function
                var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                return function(t){zoomTo(i(t)); };
            });
    }

    
    function zoomTo(v){
        //console.log(v);
        var k = width /v[2];
        //var k = 1; 
        //console.log(k);
        view = v; //update view which is a global variable
        //node.
        nodes.attr("transform", function(d){
            //console.log(d);
            return "translate(" + (d.x - v[0])*k + "," + (d.y - v[1])*k + ")"; 
        });

        //only need to update radius values
        circle.attr("r", function(d){return d.r * k; });
        textCurve.attr("d", function(d){ 
            return d.r>45 ? describeArc(0, 0, d.r * k, 60, 300, 1, 0) : null;
        });
    }
}

// custom functions to calculate path parameters to draw arcs, which are used to place text

//my custom function that draws text path based on circle parameters
//however, this method can only draw half circle/180arc, works pretty well
function getCurveTextPathData(cx, cy, r){
    //r = r*1.02; //to give a little space between text and the circle edge
    return 'M' + (cx-r) + "," + cy + "a" + r + "," + r + ' 0 1,1 ' + (2*r) + ',0';
}

//@para: bound, can be inner bound (1) or outer boud (0)
//@para: largeArcFlag, can be inner bound (1) or outer boud (0)
//the difference will have to 90 degrees for circle
function describeArc(x, y, radius, startAngle, endAngle, largeArc, sweepArc){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    // var largeArcFlag = endAngle - startAngle <= 180 ? "1" : "0";
    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArc, sweepArc, end.x, end.y
    ].join(" ");

    return d;
}

//angleInRadians
function polarToCartesian(centerX, centerY, radius, angleInDegrees){
    var angleInRadians = (angleInDegrees-90)*Math.PI/180.0;
    return{
        x: centerX + (radius*Math.cos(angleInRadians)),
        y: centerY + (radius*Math.sin(angleInRadians))
    };
}

//angleIndegrees, works but behave differently
// function polarToCartesian(cx, cy, r, angle){
//     return{
//         x: cx + (r*Math.cos(angle)),
//         y: cy + (r*Math.sin(angle))
//     };
// }

//custom functions for hovering highlight on each node
function hovered(hover) {
    return function(d) {
        d3.selectAll(d.ancestors().map(function(d) { return d.node; })).classed("node--hover", hover);
    };
}

//append legend that shows color references to depth information
function generateCirclePackLegend(svg,  width, margin, node_depth, node_height, color){
    let legendRectSize = 28;                                
    let legendSpacing = 6;
    let data = d3.range(node_depth, node_height+1, 1);
    //add legend using color.domain()
    let lg = svg.append("g")
        .attr("transform", "translate(" + (width-margin) + "," + 20 + ")");
    //data joining legend
    let legend = lg.selectAll(".legend")
        .data(data)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i){
            // console.log(d);
            let height = legendRectSize + legendSpacing;
            let offset = -20;
            let horz = legendRectSize;
            let vert = i * height - offset;
            return 'translate(' + horz + "," + vert + ")";
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", color)
        .style("stroke", color);
    
    legend.append("text")
        .attr("class", "legend-text-labels")
        .attr('x', 2*legendRectSize)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d, i){
            //console.log(d);
            return "level " + i; 
        });
}

// very efficient, fast for removing arr duplicates
function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}


// very stupid, doesn't work as intended
function sortRGB(color_arr){
    //r value
    color_arr = color_arr.sort(function(a,b){
        return b.slice(4,7) - a.slice(4,7); 
    });
    //g value
    color_arr = color_arr.sort(function(a,b){
        //console.log(parseInt(a.split(',')[1]));
        return parseInt(b.split(',')[1]) - parseInt(a.split(',')[1]);
    });
    //b value
    color_arr = color_arr.sort(function(a,b){
        //console.log(parseInt(a.split(',')[2].slice(0, -1)));
        return parseInt(a.split(',')[2].slice(0, -1)) - parseInt(b.split(',')[2].slice(0, -1));
    });
    return color_arr;
}