import * as d3 from 'd3';
import './style.css';
import data from '../data/cla.json';
import {renderBubble1} from './bubble1';
import {renderMenu1} from './menu1';

document.addEventListener('DOMContentLoaded', function(evt){
    console.log('DOM Loaded');
    renderBubble1(data, d3.select('#bubble'));
    renderMenu1();
},false);