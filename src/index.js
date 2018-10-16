import * as d3 from 'd3';
import './style.css';
import data from '../data/cla.json';
import {renderBubble1} from './bubble1';
import {menuContainer} from './components/menuContainer';
import {dropdownList} from './components/dropDownList';
import {roundedToggleSwitch} from './components/toggleSwitch';
// section 2
import {drawSVGGrid} from './svgGrid';


document.addEventListener('DOMContentLoaded', function(evt){
    console.log('DOM Loaded');
    // section 1
    renderBubble1(data, d3.select('#bubble'), 'RdBu');
    let menu_container = d3.select('#menu-1').append(menuContainer);
    menu_container.append(dropdownList);
    menu_container.append(roundedToggleSwitch);
    
    d3.selectAll('.dropdown-item').on('click', function(){
        // console.log(d3.event.target.dataset);
        // console.log(d3.select(d3.event.target).data());
        let colorset = d3.event.target.dataset.item;
        renderBubble1(data, d3.select('#bubble'), colorset);
    });

    // section 2
    drawSVGGrid();
},false);