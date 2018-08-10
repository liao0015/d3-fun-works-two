import * as d3 from 'd3';
import './toggleSwitch.css';

export function rectToggleSwitch(){
    let container = document.createElement('label');
    d3.select(container).attr('class', 'switch')
        .append('input')
        .attr('type', 'checkbox');
    d3.select(container).append('span')
        .attr('class', 'slider');
    return container;
}

export function roundedToggleSwitch(){
    let container = document.createElement('label');
    d3.select(container).attr('class', 'switch')
        .append('input')
        .attr('type', 'checkbox');
    d3.select(container).append('span')
        .attr('class', 'slider round');
    return container;
}