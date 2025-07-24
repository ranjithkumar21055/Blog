import React from 'react'

function Logo({width = '100px'}) {
  return (
    <div>
      <img src='/generated-image.png' width={width}/>
    </div>
  )
}

export default Logo