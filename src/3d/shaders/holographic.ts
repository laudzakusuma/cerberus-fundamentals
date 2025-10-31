import * as THREE from 'three';

/**
 * Custom holographic shader dengan scan lines dan glitch effects
 */
export const holographicVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  uniform float time;
  uniform float distortionAmount;
  
  // Simplex noise function
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 pos = position;
    
    // Apply noise distortion
    float noise = snoise(pos * 2.0 + time * 0.5) * distortionAmount;
    pos += normal * noise;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const holographicFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float scanlineIntensity;
  uniform float glitchAmount;
  uniform float fresnelPower;
  
  // Hash function for randomness
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }
  
  // Scanline effect
  float scanline(vec2 uv, float lines) {
    return sin(uv.y * lines + time * 2.0) * 0.5 + 0.5;
  }
  
  // Glitch effect
  vec2 glitch(vec2 uv, float amount) {
    float glitchLine = step(0.98, hash(floor(time * 10.0)));
    float shift = (hash(floor(time * 20.0)) - 0.5) * amount;
    
    if (glitchLine > 0.5) {
      uv.x += shift;
    }
    
    return uv;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Apply glitch
    uv = glitch(uv, glitchAmount);
    
    // Fresnel effect
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), fresnelPower);
    
    // Color gradient
    vec3 baseColor = mix(color1, color2, vUv.y);
    
    // Scanlines
    float scan = scanline(uv, 100.0) * scanlineIntensity;
    
    // Combine effects
    vec3 finalColor = baseColor * (0.8 + scan * 0.2);
    finalColor += vec3(fresnel) * 0.5;
    
    // Add edge glow
    float edge = 1.0 - abs(dot(viewDirection, vNormal));
    finalColor += color2 * edge * 0.3;
    
    // Opacity based on fresnel
    float opacity = 0.6 + fresnel * 0.4;
    
    gl_FragColor = vec4(finalColor, opacity);
  }
`;

/**
 * Create holographic material
 */
export function createHolographicMaterial(options: {
  color1?: THREE.Color;
  color2?: THREE.Color;
  distortionAmount?: number;
  scanlineIntensity?: number;
  glitchAmount?: number;
  fresnelPower?: number;
} = {}) {
  const {
    color1 = new THREE.Color(0x00d1ff),
    color2 = new THREE.Color(0x9b59ff),
    distortionAmount = 0.1,
    scanlineIntensity = 0.3,
    glitchAmount = 0.02,
    fresnelPower = 3.0,
  } = options;

  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color1: { value: color1 },
      color2: { value: color2 },
      distortionAmount: { value: distortionAmount },
      scanlineIntensity: { value: scanlineIntensity },
      glitchAmount: { value: glitchAmount },
      fresnelPower: { value: fresnelPower },
    },
    vertexShader: holographicVertexShader,
    fragmentShader: holographicFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}