/**
 * A color palette
 * @param {Palette.Color[]} colors The colors on this palette
 * @constructor
 */
const Palette = function(colors) {
    this.colors = colors;
};

/**
 * A palette sample
 * @param {Number} x The X coordinate of this sample
 * @param {Number} y The Y coordinate of this sample
 * @constructor
 */
Palette.Sample = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Deserialize a sample
 * @param {BinBuffer} buffer The buffer to deserialize from
 */
Palette.Sample.deserialize = function(buffer) {
    return new Palette.Sample(buffer.readUint8(), buffer.readUint8());
};

/**
 * Serialize this sample
 * @param {BinBuffer} buffer The buffer to serialize to
 */
Palette.Sample.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.x);
    buffer.writeUint8(this.y);
};

/**
 * A color on a palette
 * @param {Palette.Sample} sample A sample location for this color
 * @param {Color} color The color
 * @constructor
 */
Palette.Color = function(sample, color) {
    this.sample = sample;
    this.color = color;
};