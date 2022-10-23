function getPixelRGBAData(pixels) {
  const rgbas = []

  for(let i=0; i<=pixels.data.length; i+=4) {
    rgbas.push(pixels.data[i])
  }

  return rgbas
}


export default getPixelRGBAData