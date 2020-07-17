/**
 * A fish body shape which will be superimposed over a pattern
 * @param {Number} centerPower A power value that shifts the center of the fish thickness
 * @param {Number} radiusPower A power value to apply to the body radius
 * @constructor
 */
const PatternShapeBody = function(centerPower, radiusPower) {
    this.centerPower = centerPower;
    this.radiusPower = radiusPower;
};

PatternShapeBody.prototype.SHADE_POWER = 1.8;
PatternShapeBody.prototype.LIGHT_POWER = 0.5;
PatternShapeBody.prototype.AMBIENT = 0.5;

PatternShapeBody.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

PatternShapeBody.prototype.SHADER_FRAGMENT = `#version 100
uniform mediump float centerPower;
uniform mediump float shadePower;
uniform mediump float lightPower;
uniform mediump float radiusPower;
uniform mediump float ambient;

varying mediump vec2 iUv;

void main() {
  mediump float radius = 2.0 * abs(iUv.y - 0.5);
  mediump float edge = pow(cos(3.141592 * (pow(iUv.x, centerPower) - 0.5)), radiusPower);
  
  if (radius > edge)
    gl_FragColor = vec4(0.0);
  else {
    mediump float shade = pow(max(0.0, 1.0 - pow(radius / edge, shadePower)), lightPower);
    
    gl_FragColor = vec4(vec3(shade) * (1.0 - ambient) + ambient, 1.0);
  }
}
`;

/**
 * Deserialize this pattern
 * @param {BinBuffer} buffer A buffer to deserialize from
 */
PatternShapeBody.deserialize = function(buffer) {
    return new PatternShapeBody(
        buffer.readFloat(),
        buffer.readFloat());
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer The buffer to serialize to
 */
PatternShapeBody.prototype.serialize = function(buffer) {
    buffer.writeFloat(this.centerPower);
    buffer.writeFloat(this.radiusPower);
};

/**
 * Sample the shapeBody thickness ratio
 * @param {Number} x The X position to sample at in the range [0, 1]
 * @returns {Number} The thickness in the range [0, 1]
 */
PatternShapeBody.prototype.sample = function(x) {
    return Math.pow(Math.cos(Math.PI * (Math.pow(x, this.centerPower) - .5)), this.radiusPower);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 */
PatternShapeBody.prototype.configure = function(gl, program) {
    gl.uniform1f(program["uCenterPower"], this.centerPower);
    gl.uniform1f(program["uShadePower"], this.SHADE_POWER);
    gl.uniform1f(program["uLightPower"], this.LIGHT_POWER);
    gl.uniform1f(program["uRadiusPower"], this.radiusPower);
    gl.uniform1f(program["uAmbient"], this.AMBIENT);
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
PatternShapeBody.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["centerPower", "shadePower", "lightPower", "radiusPower", "ambient"],
        ["position", "uv"]);
};