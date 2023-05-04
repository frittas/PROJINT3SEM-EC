import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as Papa from 'papaparse';

@Component({
  selector: 'line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})

export class LineComponent implements OnInit {

  @ViewChild('host')
  el!: ElementRef;
  @Input() dataUrl = '';
  @Input() titleText = '';

  ngAfterViewInit() {

    var svg = d3.select("svg"),
      margin = 200,
      width = parseInt(svg.attr("width")),
      height = parseInt(svg.attr("height"));

    var xScale = d3.scaleLinear().domain([0, 100]).range([0, width]),
      yScale = d3.scaleLinear().domain([0, 200]).range([height, 0]);

      svg.append('text')
      .attr('x', width/2 + 100)
      .attr('y', 100)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Helvetica')
      .style('font-size', 20)
      .text('Line Chart');
      
      // X label
      svg.append('text')
      .attr('x', width/2 + 100)
      .attr('y', height - 15 + 150)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Helvetica')
      .style('font-size', 12)
      .text('Independant');
      
      // Y label
      svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(60,' + height + ')rotate(-90)')
      .style('font-family', 'Helvetica')
      .style('font-size', 12)
      .text('Dependant');

      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));
     
     svg.append("g")
      .call(d3.axisLeft(yScale));

    d3.csv(this.dataUrl).then((data) => {

      svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return xScale(d['xAxis']); } )
      .attr("cy", function (d) { return yScale(d['yAxis']); } )
      .attr("r", 2)
      .attr("transform", "translate(" + 100 + "," + 100 + ")")
      .style("fill", "#CC0000");

      

    });

  }

 
 
 
 
 
 
  ngOnInit(): void {

  }

}