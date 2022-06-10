precision mediump float;
varying vec3 vColor;
varying vec2 v_texcoord;
varying vec3 v_normal;

uniform sampler2D u_texture;

struct DirectionalLight {
    vec3 direction;
    vec3 color;
};

uniform vec3 ambientLightIntensity;
uniform DirectionalLight sun;

// test con otras luces

void main(void) {
    // gl_FragColor = vec4(vColor, 1.);
   
    // vec3 ambientLightIntensity = vec3 (0.2, 0.2, 0.3); 
    // vec3 sunlightIntenisty = vec3 (0.9, 0.9, 0.9);
    // vec3 sunlightDirection = normalize(vec3 (1.0, 4.0, -2.0));
    vec3 surfaceNormal = normalize(v_normal);
    vec3 normSunDir = normalize(sun.direction);
    vec4 texel = texture2D(u_texture, v_texcoord);

    // vec3 lightIntensity = ambientLightIntensity + sunlightIntenisty * max(dot(v_normal, sunlightDirection), 0.0);
    vec3 lightIntensity = ambientLightIntensity + sun.color * max(dot(surfaceNormal, normSunDir), 0.0);

    gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
    // gl_FragColor = texture2D(u_texture, v_texcoord); // para que se muestre la textura
    // gl_FragColor = vec4(v_normal, 1.0);

    // test con otras luces
}