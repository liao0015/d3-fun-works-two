import * as d3 from 'd3';
import './dropDownList.css';

const colorOptions = [
    'RdBu',
    'BrBG',
    'PuOr',
    'BuGn',
    'Rainbow',
    'Magma',
    'Spectral'
];

export function dropdownList(){
    
    let dropdown_container = document.createElement('div');
    d3.select(dropdown_container).attr('class', 'dropdown');
    
    let dropdown_btn = d3.select(dropdown_container).append('button')
        .attr('class', 'dropbtn')
        .text('Options');

    let dropdown_content = d3.select(dropdown_container).append('div')
        .attr('class', 'dropdown-content')
        .selectAll('div').data(colorOptions)
        .enter().append('div')
            .attr('class', 'dropdown-item')
            .attr('data-item', function(d){return d;})
            .attr('data-foo', 'foo')
            .text(function(d){return d; });

    return dropdown_container;
}