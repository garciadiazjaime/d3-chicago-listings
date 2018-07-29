const baseMost = {
  display: 'inline-block',
  width: 15,
  height: 15,
  margin: 5
}

export const toolTipStyle = {
  background: '#222',
  border: '0px',
  color: '#FFF',
  font: '14px sans-serif',
  fontWeight: 'bold',
  padding: '5px',
  pointerEvents: 'non',
  position: 'absolute',
  'text-align': 'center'
}

export const containerStyle = {
  width: '1080px',
  margin: '0 auto',
  background: '#FFF',
  padding: '12px'
}

export const priceRange = {
  display: 'flex',
  alignItems: 'center',
  margin: '0 0 15px 0'
}

export const mostAffordable = {
  ...baseMost,
  background: '#8bace5'
}

export const mostExpensive = {
  ...baseMost,
  background: '#f44646'
}
