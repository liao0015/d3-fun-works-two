import * as d3 from 'd3';


export function drawSVGGrid(){
    let data = new gridData();
    console.log(data);

    let grid = d3.select('#section-2')
        .append('svg')
        .attr('width', '510px')
        .attr('height', '510px');

    let row = grid.selectAll(".row")
        .data(data)
        .enter().append("g")
        .attr("class", "row");

    let column = row.selectAll(".square")
        .data(function(d){
            // console.log(d);
            return d;
        })
        .enter().append('rect')
        .attr("x", function(d){return d.x; })
        .attr("y", function(d){return d.y; })
        .attr("width", function(d){return d.width; })
        .attr("height", function(d){return d.height; })
        .style("fill", "#fff")
        .style("stroke", "#222")
        .on("click", function(d){
            d.click ++;
            if((d.click)%4 == 0) {
                d3.select(this).style("fill", "#fff");
            }
            if((d.click)%4 == 1) {
                d3.select(this).style("fill", "#2C93E8");
            }
            if((d.click)%4 == 2) {
                d3.select(this).style("fill", "#F56C4E");
            }
            if((d.click)%4 == 3) {
                d3.select(this).style("fill", "#838690");
            }
            // console.log(d.click);
        });
}


function gridData(){
    let data = new Array();
    let xpos = 1;
    let ypos = 1;
    let width = 50;
    let height = 50;

    // click
    let click = 0;

    for (let row = 0; row < 10; row++){
        data.push(new Array());

        for(let column = 0; column < 10; column++) {
            data[row].push({
                x: xpos,
                y: ypos,
                width: width,
                height: height,
                // click
                click: click
            })

            xpos += width;
        }

        //reset x position after a row is complete
        xpos = 1;
        // increase y position
        ypos += height;
    }

    // console.log(data);
    return data;
}


