Project done in TNM084 to study procedurally generated textures and shapes. This is a landscape generator that uses WebGl and Three.js.

To create these shapes, the application uses Simplex Noise \cite{simplex}. The code for the noise was downloaded from the [Ashima Github](https://github.com/ashima/webgl-noise)
All the hills, shores, mountains and sea in the application are calculated and executed in the shaders. 

The code iterates ten times and increases or decreases the height depending on the noise. The actual noise is calculated in the snoise function. This function uses code made by Ashima Arts (and maintained by Stefan Gustavson). The vector noise1 is calculated earlier and just contains a seed for the snoise function. The snoise function is rather smart and it also returns a gradient (temp in this code) which is also multiplied by the same values as the noise function (done in grad1). This variable is then used to calculate the new normal of the vetex. All this is done in the landvertex.js and seavertex.js.


The new normal is used in the fragment shader for light. The fragment shader defines the color of each vertex. All the colors and lightning are done in seafragment.js and landfragment.js.
