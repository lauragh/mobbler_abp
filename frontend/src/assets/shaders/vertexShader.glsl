
uniform mat4 Pmatrix;
uniform mat4 Vmatrix;
uniform mat4 Mmatrix;
// uniform vec3 translation;
attribute vec3 position;
attribute vec3 color;//the color of the point
attribute vec2 a_texcoord;
attribute vec3 a_normal;

varying vec3 v_normal;
varying vec3 vColor;
varying vec2 v_texcoord;

// test con otras luces



void main(void) {//pre-built function
    vColor = color;
    v_texcoord = a_texcoord;
    v_normal = (Mmatrix * vec4(a_normal, 0.0)).xyz;
    // v_normal = (Mmatrix * vec4(a_normal, 0.0)).xyz * vec3(-1.0, 1.0, 1.0);
    gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);
}