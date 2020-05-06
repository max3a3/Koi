/**
 * A pond from which fish cannot escape
 * @param {Object} constraint The constraint defining this pond
 * @constructor
 */
const Pond = function(constraint) {
    this.constraint = constraint;
    this.capacity = constraint.getCapacity();
    this.fishes = [];
};

Pond.prototype.SPAWN_OVERHEAD = 2;

/**
 * Check if a fish can be spawned in this pond
 * @returns {Boolean} A boolean indicating whether a fish may be spawned
 */
Pond.prototype.canSpawn = function() {
    return this.fishes.length < this.capacity - this.SPAWN_OVERHEAD;
};

/**
 * Check if a fish can be dropped in this pond
 * @returns {Boolean} A boolean indicating whether a fish may be dropped
 */
Pond.prototype.canDrop = function() {
    return this.fishes.length < this.capacity;
};

/**
 * Add a fish to this pond
 * @param {Fish} fish A fish
 */
Pond.prototype.addFish = function(fish) {
    this.fishes.push(fish);
};

// TODO: Add function to assign a new constraint to this pond, maintain fishes

/**
 * Update this pond and its contents
 * @param {Atlas} atlas The texture atlas
 * @param {Random} random A randomizer
 */
Pond.prototype.update = function(atlas, random) {
    for (let fish = this.fishes.length; fish-- > 0;) {
        for (let other = fish; other-- > 0;)
            this.fishes[fish].interact(this.fishes[other], random);

        if (this.fishes[fish].update(this.constraint, random)) {
            this.fishes[fish].free(atlas);
            this.fishes.splice(fish, 1);
        }
    }
};

/**
 * Render this pond and its contents
 * @param {Renderer} renderer The renderer
 * @param {Number} time The interpolation factor
 */
Pond.prototype.render = function(renderer, time) {
    this.constraint.render(renderer);

    for (const fish of this.fishes)
        fish.render(renderer, time);
};