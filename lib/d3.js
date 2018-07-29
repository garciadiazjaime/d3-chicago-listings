const toolTipStyle = {
  background: '#222',
  border: '0px',
  color: '#FFF',
  font: '14px sans-serif',
  fontWeight: 'bold',
  padding: '5px',
  pointerEvents: 'non',
  position: 'absolute',
  'text-align': 'center',
  'min-width': '80px'
}

function setYAxis(svg, maxValue, height) {
  const scale = d3.scale
    .linear()
    .domain([0, maxValue])
    .range([height, 0])
  const axis = d3.svg.axis()
    .orient('left')
    .scale(scale)
  const axisGroup = svg.append('g')
  .attr('transform', 'translate(70, 20)')
  const axisNodes = axisGroup.call(axis)
  const domain = axisNodes.selectAll('.domain')
  domain.attr({
      fill: 'none',
      'stroke-width': 1,
      stroke: 'black'
  })
  const ticks = axisNodes.selectAll('.tick line')
  ticks.attr({
      fill: 'none',
      'stroke-width': 1,
      stroke: 'black'
  })
}

function setXAxis(svg, dates, width, height) {
  const scale = d3.scale
    .linear()
    .range([0, width])

  const axis = d3.svg.axis()
    .orient('bottom')
    .scale(scale)
    .tickSize(-height)

  const axisGroup = svg.append('g')
  .attr('transform', `translate(70, ${height + 20})`)
  const axisNodes = axisGroup.call(axis)
  const domain = axisNodes.selectAll('.domain')
  domain.attr({
      fill: 'none',
      'stroke-width': 1,
      stroke: 'black'
  })
  const ticks = axisNodes.selectAll('.tick line')
  ticks.attr({
      fill: 'none',
      'stroke-width': 1,
      stroke: 'black'
  })
}

function getPriceRange(data) {
  const prices = data.map(item => parseInt(item[1]))
  return [Math.min(...prices), Math.max(...prices)]
}

function onTooltipHover(d) {
  const div = d3.select('#tooltip')
      .style('opacity', 0)
      .style(toolTipStyle)
  const zipCode = d[0]
  const price = parseInt(d[1]).toLocaleString()

  div.transition()
    .duration(200)
    .style('opacity', .8);
  div.html(`${zipCode} ${`<br /> $${price}`}`)
    .style('left', (d3.event.pageX) + 'px')
    .style('top', (d3.event.pageY - 28) + 'px');
}

function onTooltipOut() {
  d3.select('#tooltip')
    .transition()
    .duration(100)
    .style('opacity', 0);
}

export function renderHistoricalPrice(data) {
  const svg = d3.select('svg')
  const margin = { top: 20, right: 20, bottom: 30, left: 40 }
  const height = +svg.attr('height') - margin.top - margin.bottom
  const width = +svg.attr("width") - margin.left - margin.right
  const y = d3.scale.linear().rangeRound([height, 0])
  y.domain([0, d3.max(data, d => d[1])])

  const maxValue = d3.max(data.map(item => item[1]))
  setYAxis(svg, maxValue, height)
  setXAxis(svg, data.map(item => item[0]), width, height)

  const priceRange = getPriceRange(data)
  const colors = getColorRange(priceRange)

  svg.append('g')
    .selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('transform', 'translate(80, 20)')
    .attr('class', 'bar')
    .attr('x', (d,i) => i * 6)
    .attr('y', d => y(d[1]))
    .attr('width', 5)
    .attr('height', d => height - y(d[1]))
    .attr('fill', d => colors(d[1]))
    .on('mouseover', d => onTooltipHover(d, data))
}

export function getColorRange(pricesByDate) {
  return d3.scale.linear()
    .domain(pricesByDate)
    .interpolate(d3.interpolateHcl)
    .range([d3.rgb('#8bace5'), d3.rgb('#f44646')])
}
