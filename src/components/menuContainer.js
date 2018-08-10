import './menuContainer.css';
import * as d3 from 'd3';

export function menuContainer(){
    let menu_container = document.createElement('div');
    d3.select(menu_container).attr('class', 'menu-container');
    return menu_container;
}