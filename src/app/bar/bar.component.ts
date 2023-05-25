import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})

export class BarComponent implements OnInit {

  @ViewChild('host', { static: true })
  el!: ElementRef;
  @Input() dataUrl = '';
  @Input() titleText = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    d3.csv(this.dataUrl).then((data) => {
      this.createChart(data);
    });
  }

  createChart(data: any[]) {

    var svg = d3.select("svg"),
      margin = 50,
      width = parseInt(svg.attr("width")) - margin,
      height = parseInt(svg.attr("height")) - margin;


    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
      yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
      .attr("transform", "translate(" + 100 + "," + 100 + ")");


      xScale.domain(data.map(d => d.label));
      yScale.domain([0, d3.max(data, d => d.value)]);
  

    g.append('g') //X
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale).ticks(10));

    g.append('g') //Y
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(yScale).ticks(5));

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('xScale', d => xScale(d.label))
      .attr('yScale', d => yScale(+d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(+d.value));


      
  }

}