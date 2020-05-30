/**
 * An air plane to render wind on
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @constructor
 */
const Air = function(gl, width, height) {
    this.front = 0;
    this.width = Math.ceil(width * this.SCALE);
    this.height = Math.ceil(height * this.SCALE);
    this.targets = [
        new RenderTarget(gl, this.width, this.height, gl.RGB, false),
        new RenderTarget(gl, this.width, this.height, gl.RGB, false)];

    gl.clearColor(.5, .5, 0, 0);

    for (const target of this.targets)
        target.target();

    gl.clear(gl.COLOR_BUFFER_BIT);
};

Air.prototype.SCALE = 2;

/**
 * Flip the buffers after propagating
 */
Air.prototype.flip = function() {
    this.front = 1 - this.front;
};

/**
 * Return the render target currently used as the front buffer
 * @returns {RenderTarget} The current front buffer
 */
Air.prototype.getFront = function() {
    return this.targets[this.front];
};

/**
 * Return the render target currently used as the back buffer
 * @returns {RenderTarget} The current back buffer
 */
Air.prototype.getBack = function() {
    return this.targets[1 - this.front];
};

/**
 * Free all resources maintained by this air buffer
 */
Air.prototype.free = function() {
    for (const target of this.targets)
        target.free();
};