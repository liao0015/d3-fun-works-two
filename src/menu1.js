import * as d3 from 'd3';

export function renderMenu1(){
    d3.select('#menu-1').append('input').attr('type', 'color');
}
