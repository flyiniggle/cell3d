import { BufferAttribute, Vector3 } from '/external/three/build/three.module.js'


function setVertexZPositions(zMap, positions) {
  const newPositions = []

  for (let i = 0; i < positions.length; i += 3) {
      const v = new Vector3(positions[i], positions[i + 1], zMap[(i/3)])

      newPositions.push(v.x);
      newPositions.push(v.y);
      newPositions.push(v.z / 15);
  }

  return new BufferAttribute( new Float32Array(newPositions), 3 )
}


export default setVertexZPositions