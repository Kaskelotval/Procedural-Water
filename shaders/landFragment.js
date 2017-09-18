var landFragment = `



//ASHIMA NOISE3D
//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }

//NOT ASHIMA NOISE
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec3 u_light1Pos;
        uniform vec3 u_light1Col;
        uniform vec3 u_light2Col;
        uniform vec3 u_light2Pos;
        uniform vec3 u_ambLight;
        uniform float u_height;
        uniform vec3 u_camPos;        

        varying vec3 vUv;
        varying vec3 vecNormal;
        varying vec4 curvePos;
        varying vec3 NewNormal;
        varying vec3 grad;
        varying vec3 gradP;


        void main(void) {

           vec3 SpecularColor = vec3(1.0, 1.0, 1.0);
           float SpecularIntensity = 0.07;
            vec3 viewDir = normalize(u_camPos-vec3(curvePos.x,curvePos.y,curvePos.z)); //view direction to vertex
            //noise input vectors
            vec3 noise1 = vec3(vUv.x*0.5, vUv.y*0.5, 1.0); 
            vec3 noise2  = vec3(vUv.y*3.0, vUv.x*3.0, 1.0);
            vec3 noise3 = vec3(vUv.x*0.05, vUv.y*0.05, 1.0);
            //noise
            float noise = 0.05 * snoise(noise1);
            float secnoise = 0.4*snoise(noise3);
            noise += 0.025 * snoise(noise2);
            //colors
            vec4 darkSand  = vec4(0.02, 0.02, 0.01, 1.0);
            vec4 sand      = vec4(0.7, 0.6, 0.5, 1.0);
            vec4 grass     = vec4(0.2, 0.5, 0.2, 1.0);
            vec4 grass2     = vec4(0.2, 0.4, 0.2, 1.0);
            vec4 mountain  = vec4(0.3,0.3,0.5,1.0)+0.1*(1.0-noise*2.0);
            vec4 mountaintop  = vec4(0.8, 0.8, 1.0, 1.0)*noise;

            //mix colors
            vec4 MixColor = mix(darkSand, sand, smoothstep(-500.0, 2.0,curvePos.z));
            MixColor = mix(MixColor, grass, smoothstep(20.0, 40.0, curvePos.z*(1.0-2.0*noise)));
            MixColor = mix(MixColor, grass2, smoothstep(0.2, 1.0, secnoise));
            MixColor = mix(MixColor, mountain, smoothstep(200.0,200.0+30.0*u_height,curvePos.z));
            if(curvePos.z > 0.0) //mix this one depending on slope (and positive height) , all others are depending on height
              MixColor = mix(MixColor,mountaintop,smoothstep(secnoise,500.0,abs(curvePos.z*NewNormal.x*(1.0-2.0*noise))));            
            
            MixColor  = mix(MixColor, mountaintop, smoothstep(300.0+30.0*u_height, 1000.0+30.0*u_height, curvePos.z*(1.0-2.0*noise)));
            vec4 FinalMix  = mix(MixColor, mountaintop, smoothstep(100.0+30.0*u_height, 2000.0+30.0*u_height, curvePos.z));
            
          //set FragColor to mixed colors*the ambient light (amb light is defined in index.hmtl)
            gl_FragColor = FinalMix;

          //diffuse light same as seafragment.js kinda
            vec3 addedLights = u_ambLight;            
            float diff = max(0.0,dot(vec3(NewNormal.x,-NewNormal.y,NewNormal.z),-normalize(u_light1Pos)));
            addedLights += diff*u_light1Col;
            diff = max(0.0,dot(vec3(NewNormal.x,-NewNormal.y,NewNormal.z),-normalize(u_light2Pos)));
            addedLights += diff*u_light2Col;

            //specular light same as seafragment.js kinda
            vec3 R = normalize(reflect(normalize(u_light1Pos-curvePos.xyz),normalize(NewNormal)) );
            float specF = max(0.0, dot(R, vec3(viewDir.x, viewDir.y, -viewDir.z)));
            addedLights += specF*SpecularColor*SpecularIntensity;
            R = normalize(reflect(normalize(u_light2Pos-curvePos.xyz),-normalize(NewNormal)) );
            specF = max(0.0, dot(R, vec3(viewDir.x, viewDir.y, -viewDir.z)));
            addedLights += specF*SpecularColor*SpecularIntensity;
            gl_FragColor = vec4(addedLights,1.0)*gl_FragColor;

        }
`;   
