import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';

const API_BASE = 'http://localhost:5050';

function HomePage() {
  const [data, setData] = useState(null);

  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const d3ContainerRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_BASE}/budget`)
      .then(res => setData(res.data.myBudget))
      .catch(err => console.error('Error fetching budget data:', err));
  }, []);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const ctx = canvasRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(item => item.title),
        datasets: [{
          data: data.map(item => item.budget),
          backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19', '#4bc0c0', '#9966ff', '#c9cbcf']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed;
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total ? ((val / total) * 100).toFixed(1) : 0;
                return `${ctx.label}: ${val} (${pct}%)`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data]);

  useEffect(() => {
    if (!data || !d3ContainerRef.current) return;

    const w = 360;
    const h = 360;
    const r = Math.min(w, h) / 2;

    d3.select(d3ContainerRef.current).selectAll('*').remove();

    const svg = d3.select(d3ContainerRef.current)
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', `translate(${w / 2}, ${h / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.title))
      .range(['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19', '#4bc0c0', '#9966ff', '#c9cbcf']);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.budget);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(r - 10);

    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.title));

    svg.selectAll('text.label')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(d => `${d.data.title} (${d.data.budget})`);

    const legend = svg.append('g')
      .attr('transform', `translate(${-(w / 2) + 10 - w / 2 + r}, ${-r})`);

    const legendItems = legend.selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(-${w / 2 - 20}, ${i * 18})`);

    legendItems.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => color(d.title));

    legendItems.append('text')
      .attr('x', 18)
      .attr('y', 10)
      .style('font-size', '12px')
      .text(d => d.title);

  }, [data]);

  return (
    <main className="center" id="main">
      <div className="page-area">
        <article>
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to track it down,
            you would get surprised! Proper budget management depends on real data... and this
            app will help you with that!
          </p>
        </article>

        <article>
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
          </p>
        </article>

        <article>
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get out of debt faster!
            Also, they live happier lives since they spend without guilt or fear—because they know it’s all accounted for.
          </p>
        </article>

        <article>
          <h1>Free</h1>
          <p>
            This app is free—and you are the only one holding your data!
          </p>
        </article>

        <div className="charts-row">
          <article>
            <h1>Chart (Chart.js)</h1>
            <canvas id="myChart" width="400" height="400" ref={canvasRef}></canvas>
          </article>

          <article>
            <h1>Chart (D3)</h1>
            <div ref={d3ContainerRef} />
          </article>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
