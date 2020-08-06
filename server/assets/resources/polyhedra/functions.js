var StepFunctions = (function (exports) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    // =============================================================================
    // Core.ts | Utility Functions
    // (c) Mathigon
    // =============================================================================
    /** Creates a random UID string of a given length. */
    function uid(n = 10) {
        return Math.random().toString(36).substr(2, n);
    }
    /** Checks if x is strictly equal to any one of the following arguments. */
    function isOneOf(x, ...values) {
        return values.includes(x);
    }
    /** Applies default keys to an object. */
    function applyDefaults(obj, defaults) {
        for (let key of Object.keys(defaults)) {
            if (!obj.hasOwnProperty(key))
                obj[key] = defaults[key];
        }
        return obj;
    }
    const defaultMerge = ((a, b) => a.concat(b));
    /** Deep extends obj1 with obj2, using a custom array merge function. */
    function deepExtend(obj1, obj2, arrayMergeFn = defaultMerge) {
        for (const i of Object.keys(obj2)) {
            if (i in obj1 && Array.isArray(obj1[i]) && Array.isArray(obj2[i])) {
                obj1[i] = arrayMergeFn(obj1[i], obj2[i]);
            }
            else if (i in obj1 && obj1[i] instanceof Object &&
                obj2[i] instanceof Object) {
                deepExtend(obj1[i], obj2[i]);
            }
            else {
                obj1[i] = obj2[i];
            }
        }
    }
    /** Replacement for setTimeout() that is synchronous for time 0. */
    function delay(fn, t = 0) {
        if (t) {
            return +setTimeout(fn, t);
        }
        else {
            fn();
            return 0;
        }
    }
    /** Creates a new promise together with functions to resolve or reject. */
    function defer() {
        let resolve = (arg) => { };
        let reject = (arg) => { };
        const promise = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });
        // This prevents exceptions when promises without .catch are rejected:
        promise.catch((error) => error);
        return { promise, resolve, reject };
    }
    /**
     * Function wrapper that prevents a function from being executed more than once
     * every t ms. This is particularly useful for optimising callbacks for
     * continues events like scroll, resize or slider move. Setting `forceDelay`
     * to `true` means that even the first function call is after the minimum
     * timout, rather than instantly.
     */
    function throttle(fn, t = 0, forceDelay = false) {
        let delay = false;
        let repeat = false;
        return (...args) => {
            if (delay) {
                repeat = true;
            }
            else {
                if (forceDelay) {
                    repeat = true;
                }
                else {
                    fn(...args);
                }
                delay = true;
                setTimeout(() => {
                    if (repeat)
                        fn(...args);
                    delay = repeat = false;
                }, t);
            }
        };
    }
    /** Safe wrapper for JSON.parse. */
    function safeToJSON(str, fallback = {}) {
        if (!str)
            return fallback;
        try {
            return JSON.parse(str) || fallback;
        }
        catch (e) {
            return fallback;
        }
    }

    // =============================================================================
    // Core.ts | Array Functions
    // (c) Mathigon
    // =============================================================================
    /** Creates an array of size `n`, containing `value` at every entry. */
    function repeat(value, n) {
        return new Array(n).fill(value);
    }
    /** Creates a matrix of size `x` by `y`, containing `value` at every entry. */
    function repeat2D(value, x, y) {
        const result = [];
        for (let i = 0; i < x; ++i) {
            result.push(repeat(value, y));
        }
        return result;
    }
    /** Creates an array of size `n`, with the result of `fn(i)` at position i. */
    function tabulate(fn, n) {
        const result = [];
        for (let i = 0; i < n; ++i) {
            result.push(fn(i));
        }
        return result;
    }
    /**
     * Creates a matrix of size `x` by `y`, with the result of `fn(i, j)` at
     * position (i, j.
     */
    function tabulate2D(fn, x, y) {
        const result = [];
        for (let i = 0; i < x; ++i) {
            const row = [];
            for (let j = 0; j < y; ++j) {
                row.push(fn(i, j));
            }
            result.push(row);
        }
        return result;
    }
    /** Creates an array of numbers from 0 to a, or from a to b. */
    function list(a, b, step = 1) {
        const arr = [];
        if (b === undefined && a >= 0) {
            for (let i = 0; i < a; i += step)
                arr.push(i);
        }
        else if (b === undefined) {
            for (let i = 0; i > a; i -= step)
                arr.push(i);
        }
        else if (a <= b) {
            for (let i = a; i <= b; i += step)
                arr.push(i);
        }
        else {
            for (let i = a; i >= b; i -= step)
                arr.push(i);
        }
        return arr;
    }
    /** Returns the last item in an array, or the ith item from the end. */
    function last(array, i = 0) {
        return array[array.length - 1 - i];
    }
    /** Finds the sum of all elements in an numeric array. */
    function total(array) {
        return array.reduce((t, v) => t + v, 0);
    }
    /** Filters all duplicate elements from an array. */
    function unique(array) {
        return array.filter((a, i) => array.indexOf(a) === i);
    }
    /** Flattens a nested array into a single list. */
    function flatten(array) {
        return array.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
    }
    /** Breaks an array into chunks of size at most n. */
    function chunk(array, n) {
        const chunks = [];
        for (let i = 0; i < array.length; i += n) {
            chunks.push(array.slice(i, i + n));
        }
        return chunks;
    }
    /** Converts an array to a linked list data structure. */
    function toLinkedList(array) {
        const result = array.map(a => ({ val: a, next: undefined }));
        const n = result.length;
        for (let i = 0; i < n - 1; ++i) {
            result[i].next = result[i + 1];
        }
        result[n - 1].next = result[0];
        return result;
    }

    // =============================================================================
    /** Splits a string into space separated words. */
    function words(str, divider = /\s+/) {
        if (!str)
            return [];
        return str.trim().split(divider);
    }
    /** Converts a string to camel case. */
    function toCamelCase(str) {
        return str.toLowerCase().replace(/^-/, '')
            .replace(/-(.)/g, (_, g) => g.toUpperCase());
    }

    // =============================================================================
    /** Base class for event management. */
    class EventTarget {
        constructor() {
            this.events = new Map();
        }
        /** Adds an event listener for one or more events. */
        on(events, fn) {
            for (let e of words(events)) {
                if (!this.events.has(e))
                    this.events.set(e, []);
                this.events.get(e).push(fn);
            }
        }
        /** Adds a one-time event listener to one or more events. */
        one(events, fn) {
            const callback = (e) => {
                this.off(events, callback);
                fn(e);
            };
            this.on(events, callback);
        }
        /** Removes an event listener from one or more events. */
        off(events, fn) {
            for (let e of words(events)) {
                if (this.events.has(e)) {
                    this.events.set(e, this.events.get(e).filter(x => x !== fn));
                }
            }
        }
        /** Triggers one or more events, and executes all bound event listeners. */
        trigger(events, arg) {
            for (let e of words(events)) {
                if (this.events.has(e)) {
                    for (const callback of this.events.get(e)) {
                        callback(arg);
                    }
                }
            }
        }
    }

    // ============================================================================
    // Fermat.js | Utility Functions
    // (c) Mathigon
    // ============================================================================
    const PRECISION = 0.000001;
    // -----------------------------------------------------------------------------
    // Checks and Comparisons
    /** Checks if two numbers are nearly equals. */
    function nearlyEquals(x, y, t = PRECISION) {
        if (isNaN(x) || isNaN(y))
            return false;
        return Math.abs(x - y) < t;
    }
    /** Checks if a number x is between two numbers a and b. */
    function isBetween(x, a, b, t = PRECISION) {
        if (a > b)
            [a, b] = [b, a];
        return x > a + t && x < b - t;
    }
    // TODO Translate this function into other languages.
    const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
        'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
        'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty',
        'seventy', 'eighty', 'ninety'];
    const MULTIPLIERS = ['', ' thousand', ' million', ' billion', ' trillion',
        ' quadrillion', ' quintillion', ' sextillion'];
    function toWordSingle(number) {
        let [h, t, o] = number.split('');
        const hundreds = (h === '0') ? '' : ' ' + ONES[+h] + ' hundred';
        if (t + o === '00')
            return hundreds;
        if (+t < 2)
            return hundreds + ' ' + ONES[+(t + o)];
        if (o === '0')
            return hundreds + ' ' + TENS[+t];
        return hundreds + ' ' + TENS[+t] + '-' + ONES[+o];
    }
    /** Spells a number as an English word. */
    function toWord(n) {
        if (n === 0)
            return 'zero';
        const str = Math.round(Math.abs(n)).toString();
        const chunks = Math.ceil(str.length / 3);
        const padded = str.padStart(3 * chunks, '0');
        let result = '';
        for (let i = 0; i < chunks; i += 1) {
            const chunk = padded.substr(i * 3, 3);
            if (chunk === '000')
                continue;
            result += toWordSingle(chunk) + MULTIPLIERS[chunks - 1 - i];
        }
        return result.trim();
    }
    /** Round a number `n` to the nearest multiple of `increment`. */
    function roundTo(n, increment = 1) {
        return Math.round(n / increment) * increment;
    }
    // -----------------------------------------------------------------------------
    // Simple Operations
    /** Bounds a number between a lower and an upper limit. */
    function clamp(x, min = -Infinity, max = Infinity) {
        return Math.min(max, Math.max(min, x));
    }
    /** Linear interpolation */
    function lerp(a, b, t = 0.5) {
        return a + (b - a) * t;
    }
    /** Squares a number. */
    function square(x) {
        return x * x;
    }
    /**
     * Returns an array of all possible subsets of an input array (of given length).
     */
    function subsets(array, length = 0) {
        const copy = array.slice(0);
        const results = subsetsHelper(copy);
        return length ? results.filter(x => x.length === length) : results;
    }
    function subsetsHelper(array) {
        if (array.length === 1)
            return [[], array];
        const last = array.pop();
        const subsets = subsetsHelper(array);
        const result = [];
        for (const s of subsets) {
            result.push(s, [...s, last]);
        }
        return result;
    }

    // =============================================================================
    // -----------------------------------------------------------------------------
    // Points
    /** A single point class defined by two coordinates x and y. */
    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
            this.type = 'point';
        }
        get unitVector() {
            if (nearlyEquals(this.length, 0))
                return new Point(1, 0);
            return this.scale(1 / this.length);
        }
        get length() {
            return Math.sqrt(this.x ** 2 + this.y ** 2);
        }
        get inverse() {
            return new Point(-this.x, -this.y);
        }
        get flip() {
            return new Point(this.y, this.x);
        }
        get perpendicular() {
            return new Point(-this.y, this.x);
        }
        get array() {
            return [this.x, this.y];
        }
        /** Finds the perpendicular distance between this point and a line. */
        distanceFromLine(l) {
            return Point.distance(this, l.project(this));
        }
        /** Clamps this point to specific bounds. */
        clamp(bounds, padding = 0) {
            const x = clamp(this.x, bounds.xMin + padding, bounds.xMax - padding);
            const y = clamp(this.y, bounds.yMin + padding, bounds.yMax - padding);
            return new Point(x, y);
        }
        /** Transforms this point using a 2x3 matrix m. */
        transform(m) {
            const x = m[0][0] * this.x + m[0][1] * this.y + m[0][2];
            const y = m[1][0] * this.x + m[1][1] * this.y + m[1][2];
            return new Point(x, y);
        }
        /** Rotates this point by a given angle (in radians) around c. */
        rotate(angle, c = ORIGIN) {
            const x0 = this.x - c.x;
            const y0 = this.y - c.y;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const x = x0 * cos - y0 * sin + c.x;
            const y = x0 * sin + y0 * cos + c.y;
            return new Point(x, y);
        }
        /** Reflects this point across a line l. */
        reflect(l) {
            let v = l.p2.x - l.p1.x;
            let w = l.p2.y - l.p1.y;
            let x0 = this.x - l.p1.x;
            let y0 = this.y - l.p1.y;
            let mu = (v * y0 - w * x0) / (v * v + w * w);
            let x = this.x + 2 * mu * w;
            let y = this.y - 2 * mu * v;
            return new Point(x, y);
        }
        scale(sx, sy = sx) {
            return new Point(this.x * sx, this.y * sy);
        }
        shift(x, y = x) {
            return new Point(this.x + x, this.y + y);
        }
        translate(p) {
            return this.shift(p.x, p.y); // Alias for .add()
        }
        changeCoordinates(originCoords, targetCoords) {
            const x = targetCoords.xMin + (this.x - originCoords.xMin) /
                (originCoords.dx) * (targetCoords.dx);
            const y = targetCoords.yMin + (this.y - originCoords.yMin) /
                (originCoords.dy) * (targetCoords.dy);
            return new Point(x, y);
        }
        add(p) {
            return Point.sum(this, p);
        }
        subtract(p) {
            return Point.difference(this, p);
        }
        equals(other) {
            return nearlyEquals(this.x, other.x) && nearlyEquals(this.y, other.y);
        }
        round(inc = 1) {
            return new Point(roundTo(this.x, inc), roundTo(this.y, inc));
        }
        floor() {
            return new Point(Math.floor(this.x), Math.floor(this.y));
        }
        mod(x, y = x) {
            return new Point(this.x % x, this.y % y);
        }
        angle(c = ORIGIN) {
            return rad(this, c);
        }
        /** Calculates the average of multiple points. */
        static average(...points) {
            let x = total(points.map(p => p.x)) / points.length;
            let y = total(points.map(p => p.y)) / points.length;
            return new Point(x, y);
        }
        /** Calculates the dot product of two points p1 and p2. */
        static dot(p1, p2) {
            return p1.x * p2.x + p1.y * p2.y;
        }
        static sum(p1, p2) {
            return new Point(p1.x + p2.x, p1.y + p2.y);
        }
        static difference(p1, p2) {
            return new Point(p1.x - p2.x, p1.y - p2.y);
        }
        /** Returns the Euclidean distance between two points p1 and p2. */
        static distance(p1, p2) {
            return Math.sqrt(square(p1.x - p2.x) + square(p1.y - p2.y));
        }
        /** Returns the Manhattan distance between two points p1 and p2. */
        static manhattan(p1, p2) {
            return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
        }
        /** Interpolates two points p1 and p2 by a factor of t. */
        static interpolate(p1, p2, t = 0.5) {
            return new Point(lerp(p1.x, p2.x, t), lerp(p1.y, p2.y, t));
        }
        /** Interpolates a list of multiple points. */
        static interpolateList(points, t = 0.5) {
            const n = points.length - 1;
            const a = Math.floor(clamp(t, 0, 1) * n);
            return Point.interpolate(points[a], points[a + 1], n * t - a);
        }
        /** Creates a point from polar coordinates. */
        static fromPolar(angle, r = 1) {
            return new Point(r * Math.cos(angle), r * Math.sin(angle));
        }
    }
    const ORIGIN = new Point(0, 0);
    // -----------------------------------------------------------------------------
    // Angles
    const TWO_PI = 2 * Math.PI;
    /** A 2-dimensional angle class, defined by three points. */
    class Angle {
        constructor(a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.type = 'angle';
        }
        transform(m) {
            return new Angle(this.a.transform(m), this.b.transform(m), this.c.transform(m));
        }
        /** The size, in radians, of this angle. */
        get rad() {
            let phiA = Math.atan2(this.a.y - this.b.y, this.a.x - this.b.x);
            let phiC = Math.atan2(this.c.y - this.b.y, this.c.x - this.b.x);
            let phi = phiC - phiA;
            if (phi < 0)
                phi += TWO_PI;
            return phi;
        }
        /** The size, in degrees, of this angle. */
        get deg() {
            return this.rad * 180 / Math.PI;
        }
        /** Checks if this angle is right-angled. */
        get isRight() {
            // Within 1 deg of 90 deg.
            return nearlyEquals(this.rad, Math.PI / 2, Math.PI / 360);
        }
        /** The bisector of this angle. */
        get bisector() {
            if (this.b.equals(this.a))
                return undefined;
            if (this.b.equals(this.c))
                return undefined;
            let phiA = Math.atan2(this.a.y - this.b.y, this.a.x - this.b.x);
            let phiC = Math.atan2(this.c.y - this.b.y, this.c.x - this.b.x);
            let phi = (phiA + phiC) / 2;
            if (phiA > phiC)
                phi += Math.PI;
            let x = Math.cos(phi) + this.b.x;
            let y = Math.sin(phi) + this.b.y;
            return new Line(this.b, new Point(x, y));
        }
        /** Returns the smaller one of this and its supplementary angle. */
        get sup() {
            return (this.rad < Math.PI) ? this : new Angle(this.c, this.b, this.a);
        }
        /** Returns the Arc element corresponding to this angle. */
        get arc() {
            return new Arc(this.b, this.a, this.rad);
        }
        equals(a) {
            return false; // TODO
        }
        // Only required to have a common API with Line, Polygon, etc.
        project() { return this.b; }
        at() { return this.b; }
    }
    function rad(p, c = ORIGIN) {
        const a = Math.atan2(p.y - c.y, p.x - c.x);
        return (a + TWO_PI) % TWO_PI;
    }
    // -----------------------------------------------------------------------------
    // Lines, Rays and Line Segments
    /** An infinite straight line that goes through two points. */
    class Line {
        constructor(p1, p2) {
            this.p1 = p1;
            this.p2 = p2;
            this.type = 'line';
        }
        make(p1, p2) {
            return new Line(p1, p2);
        }
        /* The distance between the two points defining this line. */
        get length() {
            return Point.distance(this.p1, this.p2);
        }
        /** The midpoint of this line. */
        get midpoint() {
            return Point.average(this.p1, this.p2);
        }
        /** The slope of this line. */
        get slope() {
            return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
        }
        /** The y-axis intercept of this line. */
        get intercept() {
            return this.p1.y + this.slope * this.p1.x;
        }
        /** The angle formed between this line and the x-axis. */
        get angle() {
            return rad(this.p2, this.p1);
        }
        /** The point representing a unit vector along this line. */
        get unitVector() {
            return this.p2.subtract(this.p1).unitVector;
        }
        /** The point representing the perpendicular vector of this line. */
        get perpendicularVector() {
            return new Point(this.p2.y - this.p1.y, this.p1.x - this.p2.x).unitVector;
        }
        /** Finds the line parallel to this one, going though point p. */
        parallel(p) {
            const q = Point.sum(p, Point.difference(this.p2, this.p1));
            return new Line(p, q);
        }
        /** Finds the line perpendicular to this one, going though point p. */
        perpendicular(p) {
            return new Line(p, Point.sum(p, this.perpendicularVector));
        }
        /** The perpendicular bisector of this line. */
        get perpendicularBisector() {
            return this.perpendicular(this.midpoint);
        }
        /** Projects this point onto the line `l`. */
        project(p) {
            const a = Point.difference(this.p2, this.p1);
            const b = Point.difference(p, this.p1);
            const proj = a.scale(Point.dot(a, b) / this.length ** 2);
            return Point.sum(this.p1, proj);
        }
        /** Checks if a point p lies on this line. */
        contains(p) {
            // det([[p.x, p.y, 1],[p1.x, p1.y, 1],[p2.x, ,p2.y 1]])
            const det = p.x * (this.p1.y - this.p2.y) + this.p1.x * (this.p2.y - p.y)
                + this.p2.x * (p.y - this.p1.y);
            return nearlyEquals(det, 0);
        }
        at(t) {
            return Point.interpolate(this.p1, this.p2, t);
        }
        transform(m) {
            return new this.constructor(this.p1.transform(m), this.p2.transform(m));
        }
        rotate(a, c = ORIGIN) {
            return new this.constructor(this.p1.rotate(a, c), this.p2.rotate(a, c));
        }
        reflect(l) {
            return new this.constructor(this.p1.reflect(l), this.p2.reflect(l));
        }
        scale(sx, sy = sx) {
            return this.make(this.p1.scale(sx, sy), this.p2.scale(sx, sy));
        }
        shift(x, y = x) {
            return this.make(this.p1.shift(x, y), this.p2.shift(x, y));
        }
        translate(p) {
            return this.shift(p.x, p.y);
        }
        equals(other) {
            return this.contains(other.p1) && this.contains(other.p2);
        }
    }
    /** A finite line segment defined by its two endpoints. */
    class Segment extends Line {
        constructor() {
            super(...arguments);
            this.type = 'segment';
        }
        contains(p) {
            if (!Line.prototype.contains.call(this, p))
                return false;
            if (nearlyEquals(this.p1.x, this.p2.x)) {
                return isBetween(p.y, this.p1.y, this.p2.y);
            }
            else {
                return isBetween(p.x, this.p1.x, this.p2.x);
            }
        }
        make(p1, p2) {
            return new Segment(p1, p2);
        }
        project(p) {
            const a = Point.difference(this.p2, this.p1);
            const b = Point.difference(p, this.p1);
            const q = clamp(Point.dot(a, b) / square(this.length), 0, 1);
            return Point.sum(this.p1, a.scale(q));
        }
        /** Contracts (or expands) a line by a specific ratio. */
        contract(x) {
            return new Segment(this.at(x), this.at(1 - x));
        }
        equals(other, oriented = false) {
            if (other.type !== 'segment')
                return false;
            return (this.p1.equals(other.p1) && this.p2.equals(other.p2)) ||
                (!oriented && this.p1.equals(other.p2) && this.p2.equals(other.p1));
        }
        /** Finds the intersection of two line segments l1 and l2 (or undefined). */
        static intersect(s1, s2) {
            return simpleIntersection(s1, s2)[0] || undefined;
        }
    }
    /** An arc segment of a circle, with given center, start point and angle. */
    class Arc {
        constructor(c, start, angle) {
            this.c = c;
            this.start = start;
            this.angle = angle;
            this.type = 'arc';
        }
        get radius() {
            return Point.distance(this.c, this.start);
        }
        get end() {
            return this.start.rotate(this.angle, this.c);
        }
        transform(m) {
            return new this.constructor(this.c.transform(m), this.start.transform(m), this.angle);
        }
        rotate(a, c = ORIGIN) {
            return new this.constructor(this.c.rotate(a, c), this.start.rotate(a, c), this.angle);
        }
        reflect(l) {
            return new this.constructor(this.c.reflect(l), this.start.reflect(l), this.angle);
        }
        scale(sx, sy = sx) {
            return new this.constructor(this.c.scale(sx, sy), this.start.scale(sx, sy), this.angle);
        }
        shift(x, y = x) {
            return new this.constructor(this.c.shift(x, y), this.start.shift(x, y), this.angle);
        }
        translate(p) {
            return this.shift(p.x, p.y);
        }
        get startAngle() {
            return rad(this.start, this.c);
        }
        project(p) {
            let start = this.startAngle;
            let end = start + this.angle;
            let angle = rad(p, this.c);
            if (end > TWO_PI && angle < end - TWO_PI)
                angle += TWO_PI;
            angle = clamp(angle, start, end);
            return this.c.shift(this.radius, 0).rotate(angle, this.c);
        }
        at(t) {
            return this.start.rotate(this.angle * t, this.c);
        }
        contract(p) {
            return new this.constructor(this.c, this.at(p / 2), this.angle * (1 - p));
        }
        get minor() {
            if (this.angle <= Math.PI)
                return this;
            return new this.constructor(this.c, this.end, 2 * Math.PI - this.angle);
        }
        get major() {
            if (this.angle >= Math.PI)
                return this;
            return new this.constructor(this.c, this.end, 2 * Math.PI - this.angle);
        }
        get center() {
            return this.at(0.5);
        }
        equals() {
            // TODO Implement
            return false;
        }
    }
    // -----------------------------------------------------------------------------
    // Polygons
    /** A polygon defined by its vertex points. */
    class Polygon {
        constructor(...points) {
            this.type = 'polygon';
            this.points = points;
        }
        get circumference() {
            let C = 0;
            for (let i = 1; i < this.points.length; ++i) {
                C += Point.distance(this.points[i - 1], this.points[i]);
            }
            return C;
        }
        /**
         * The (signed) area of this polygon. The result is positive if the vertices
         * are ordered clockwise, and negative otherwise.
         */
        get signedArea() {
            let p = this.points;
            let n = p.length;
            let A = p[n - 1].x * p[0].y - p[0].x * p[n - 1].y;
            for (let i = 1; i < n; ++i) {
                A += p[i - 1].x * p[i].y - p[i].x * p[i - 1].y;
            }
            return A / 2;
        }
        get area() {
            return Math.abs(this.signedArea);
        }
        get centroid() {
            let p = this.points;
            let n = p.length;
            let Cx = 0;
            for (let i = 0; i < n; ++i)
                Cx += p[i].x;
            let Cy = 0;
            for (let i = 0; i < n; ++i)
                Cy += p[i].y;
            return new Point(Cx / n, Cy / n);
        }
        get edges() {
            let p = this.points;
            let n = p.length;
            let edges = [];
            for (let i = 0; i < n; ++i)
                edges.push(new Segment(p[i], p[(i + 1) % n]));
            return edges;
        }
        get radius() {
            const c = this.centroid;
            const radii = this.points.map(p => Point.distance(p, c));
            return Math.max(...radii);
        }
        transform(m) {
            return new this.constructor(...this.points.map(p => p.transform(m)));
        }
        rotate(a, center = ORIGIN) {
            const points = this.points.map(p => p.rotate(a, center));
            return new this.constructor(...points);
        }
        reflect(line) {
            const points = this.points.map(p => p.reflect(line));
            return new this.constructor(...points);
        }
        scale(sx, sy = sx) {
            const points = this.points.map(p => p.scale(sx, sy));
            return new this.constructor(...points);
        }
        shift(x, y = x) {
            const points = this.points.map(p => p.shift(x, y));
            return new this.constructor(...points);
        }
        translate(p) {
            return this.shift(p.x, p.y);
        }
        /**
         * Checks if a point p lies inside this polygon, by using a ray-casting
         * algorithm and calculating the number of intersections.
         */
        contains(p) {
            let inside = false;
            for (const e of this.edges) {
                // Exclude points lying *on* the edge.
                if (e.p1.equals(p) || e.contains(p))
                    return false;
                if ((e.p1.y > p.y) === (e.p2.y > p.y))
                    continue;
                const det = (e.p2.x - e.p1.x) / (e.p2.y - e.p1.y);
                if (p.x < det * (p.y - e.p1.y) + e.p1.x)
                    inside = !inside;
            }
            return inside;
        }
        equals(other) {
            // TODO Implement
            return false;
        }
        project(p) {
            let q = undefined;
            let d = Infinity;
            for (const e of this.edges) {
                const q1 = e.project(p);
                const d1 = Point.distance(p, q1);
                if (d1 < d) {
                    q = q1;
                    d = d1;
                }
            }
            return q || this.points[0];
        }
        at(t) {
            return Point.interpolateList([...this.points, this.points[0]], t);
        }
        /** The oriented version of this polygon (vertices in clockwise order). */
        get oriented() {
            if (this.signedArea >= 0)
                return this;
            const points = [...this.points].reverse();
            return new this.constructor(...points);
        }
        /**
         * The intersection of this and another polygon, calculated using the
         * Weiler–Atherton clipping algorithm
         */
        intersect(polygon) {
            // TODO Support intersections with multiple disjoint overlapping areas.
            // TODO Support segments intersecting at their endpoints
            const points = [toLinkedList(this.oriented.points),
                toLinkedList(polygon.oriented.points)];
            const max = this.points.length + polygon.points.length;
            const result = [];
            let which = 0;
            let active = points[which].find(p => polygon.contains(p.val));
            if (!active)
                return undefined; // No intersection
            while (active.val !== result[0] && result.length < max) {
                result.push(active.val);
                const nextEdge = new Segment(active.val, active.next.val);
                active = active.next;
                for (let p of points[1 - which]) {
                    const testEdge = new Segment(p.val, p.next.val);
                    const intersect = intersections(nextEdge, testEdge)[0];
                    if (intersect) {
                        which = 1 - which; // Switch active polygon
                        active = { val: intersect, next: p.next };
                        break;
                    }
                }
            }
            return new Polygon(...result);
        }
        /** Checks if two polygons p1 and p2 collide. */
        static collision(p1, p2) {
            // Check if any of the edges overlap.
            for (let e1 of p1.edges) {
                for (let e2 of p2.edges) {
                    if (Segment.intersect(e1, e2))
                        return true;
                }
            }
            // Check if one of the vertices is in one of the polygons.
            return p2.contains(p1.points[0]) || p1.contains(p2.points[0]);
        }
        /** Creates a regular polygon. */
        static regular(n, radius = 1) {
            const da = 2 * Math.PI / n;
            const a0 = Math.PI / 2 - da / 2;
            const points = tabulate((i) => Point.fromPolar(a0 + da * i, radius), n);
            return new Polygon(...points);
        }
        /** Interpolates the points of two polygons */
        static interpolate(p1, p2, t = 0.5) {
            // TODO support interpolating polygons with different numbers of points
            const points = p1.points.map((p, i) => Point.interpolate(p, p2.points[i], t));
            return new Polygon(...points);
        }
    }
    function isPolygonLike(shape) {
        return isOneOf(shape.type, 'polygon', 'polyline', 'rectangle');
    }
    function isLineLike(shape) {
        return isOneOf(shape.type, 'line', 'ray', 'segment');
    }
    function isCircle(shape) {
        return shape.type === 'circle';
    }
    // -----------------------------------------------------------------------------
    // Intersections
    function liesOnSegment(s, p) {
        if (nearlyEquals(s.p1.x, s.p2.x))
            return isBetween(p.y, s.p1.y, s.p2.y);
        return isBetween(p.x, s.p1.x, s.p2.x);
    }
    function liesOnRay(r, p) {
        if (nearlyEquals(r.p1.x, r.p2.x))
            return (p.y - r.p1.y) / (r.p2.y - r.p1.y) >
                0;
        return (p.x - r.p1.x) / (r.p2.x - r.p1.x) > 0;
    }
    function lineLineIntersection(l1, l2) {
        const d1x = l1.p1.x - l1.p2.x;
        const d1y = l1.p1.y - l1.p2.y;
        const d2x = l2.p1.x - l2.p2.x;
        const d2y = l2.p1.y - l2.p2.y;
        const d = d1x * d2y - d1y * d2x;
        if (nearlyEquals(d, 0))
            return []; // Colinear lines never intersect
        const q1 = l1.p1.x * l1.p2.y - l1.p1.y * l1.p2.x;
        const q2 = l2.p1.x * l2.p2.y - l2.p1.y * l2.p2.x;
        const x = q1 * d2x - d1x * q2;
        const y = q1 * d2y - d1y * q2;
        return [new Point(x / d, y / d)];
    }
    function circleCircleIntersection(c1, c2) {
        const d = Point.distance(c1.c, c2.c);
        // Circles are separate:
        if (d > c1.r + c2.r)
            return [];
        // One circles contains the other:
        if (d < Math.abs(c1.r - c2.r))
            return [];
        // Circles are the same:
        if (nearlyEquals(d, 0) && nearlyEquals(c1.r, c2.r))
            return [];
        // Circles touch:
        if (nearlyEquals(d, c1.r + c2.r))
            return [new Line(c1.c, c2.c).midpoint];
        const a = (square(c1.r) - square(c2.r) + square(d)) / (2 * d);
        const b = Math.sqrt(square(c1.r) - square(a));
        const px = (c2.c.x - c1.c.x) * a / d + (c2.c.y - c1.c.y) * b / d + c1.c.x;
        const py = (c2.c.y - c1.c.y) * a / d - (c2.c.x - c1.c.x) * b / d + c1.c.y;
        const qx = (c2.c.x - c1.c.x) * a / d - (c2.c.y - c1.c.y) * b / d + c1.c.x;
        const qy = (c2.c.y - c1.c.y) * a / d + (c2.c.x - c1.c.x) * b / d + c1.c.y;
        return [new Point(px, py), new Point(qx, qy)];
    }
    // From http://mathworld.wolfram.com/Circle-LineIntersection.html
    function lineCircleIntersection(l, c) {
        const dx = l.p2.x - l.p1.x;
        const dy = l.p2.y - l.p1.y;
        const dr2 = square(dx) + square(dy);
        const cx = c.c.x;
        const cy = c.c.y;
        const D = (l.p1.x - cx) * (l.p2.y - cy) - (l.p2.x - cx) * (l.p1.y - cy);
        const disc = square(c.r) * dr2 - square(D);
        if (disc < 0)
            return []; // No solution
        const xa = D * dy / dr2;
        const ya = -D * dx / dr2;
        if (nearlyEquals(disc, 0))
            return [c.c.shift(xa, ya)]; // One solution
        const xb = dx * (dy < 0 ? -1 : 1) * Math.sqrt(disc) / dr2;
        const yb = Math.abs(dy) * Math.sqrt(disc) / dr2;
        return [c.c.shift(xa + xb, ya + yb), c.c.shift(xa - xb, ya - yb)];
    }
    /** Returns the intersection of two or more geometry objects. */
    function intersections(...elements) {
        if (elements.length < 2)
            return [];
        if (elements.length > 2)
            return flatten(subsets(elements, 2).map(e => intersections(...e)));
        let [a, b] = elements;
        if (isPolygonLike(b))
            [a, b] = [b, a];
        if (isPolygonLike(a)) {
            // This hack is necessary to capture intersections between a line and a
            // vertex of a polygon. There are more edge cases to consider!
            const vertices = isLineLike(b) ?
                a.points.filter(p => b.contains(p)) : [];
            return [...vertices, ...intersections(b, ...a.edges)];
        }
        // TODO Handle arcs, sectors and angles!
        return simpleIntersection(a, b);
    }
    /** Finds the intersection of two lines or circles. */
    function simpleIntersection(a, b) {
        let results = [];
        // TODO Handle Arcs and Rays
        if (isLineLike(a) && isLineLike(b)) {
            results = lineLineIntersection(a, b);
        }
        else if (isLineLike(a) && isCircle(b)) {
            results = lineCircleIntersection(a, b);
        }
        else if (isCircle(a) && isLineLike(b)) {
            results = lineCircleIntersection(b, a);
        }
        else if (isCircle(a) && isCircle(b)) {
            results = circleCircleIntersection(a, b);
        }
        for (const x of [a, b]) {
            if (x.type === 'segment')
                results =
                    results.filter(i => liesOnSegment(x, i));
            if (x.type === 'ray')
                results = results.filter(i => liesOnRay(x, i));
        }
        return results;
    }

    // =============================================================================
    var Matrix;
    (function (Matrix) {
        // ---------------------------------------------------------------------------
        // Constructors
        /** Fills a matrix of size x, y with a given value. */
        function fill(value, x, y) {
            return repeat2D(value, x, y);
        }
        Matrix.fill = fill;
        /** Returns the identity matrix of size n. */
        function identity(n = 2) {
            const x = fill(0, n, n);
            for (let i = 0; i < n; ++i)
                x[i][i] = 1;
            return x;
        }
        Matrix.identity = identity;
        function rotation(angle) {
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            return [[cos, -sin], [sin, cos]];
        }
        Matrix.rotation = rotation;
        function shear(lambda) {
            return [[1, lambda], [0, 1]];
        }
        Matrix.shear = shear;
        function reflection(angle) {
            const sin = Math.sin(2 * angle);
            const cos = Math.cos(2 * angle);
            return [[cos, sin], [sin, -cos]];
        }
        Matrix.reflection = reflection;
        // ---------------------------------------------------------------------------
        // Matrix Operations
        /** Calculates the sum of two or more matrices. */
        function sum(...matrices) {
            const [M1, ...rest] = matrices;
            const M2 = rest.length > 1 ? sum(...rest) : rest[0];
            if (M1.length !== M2.length || M1[0].length !== M2[0].length)
                throw new Error('Matrix sizes don’t match');
            const S = [];
            for (let i = 0; i < M1.length; ++i) {
                const row = [];
                for (let j = 0; j < M1[i].length; ++j) {
                    row.push(M1[i][j] + M2[i][j]);
                }
                S.push(row);
            }
            return S;
        }
        Matrix.sum = sum;
        /** Multiplies a matrix M by a scalar v. */
        function scalarProduct(M, v) {
            return M.map(row => row.map((x, i) => x * v));
        }
        Matrix.scalarProduct = scalarProduct;
        /** Calculates the matrix product of multiple matrices. */
        function product(...matrices) {
            let [M1, ...rest] = matrices;
            let M2 = rest.length > 1 ? product(...rest) : rest[0];
            if (M1[0].length !== M2.length)
                throw new Error('Matrix sizes don’t match.');
            let P = [];
            for (let i = 0; i < M1.length; ++i) {
                let row = [];
                for (let j = 0; j < M2[0].length; ++j) {
                    let value = 0;
                    for (let k = 0; k < M2.length; ++k) {
                        value += M1[i][k] * M2[k][j];
                    }
                    row.push(value);
                }
                P.push(row);
            }
            return P;
        }
        Matrix.product = product;
        // ---------------------------------------------------------------------------
        // Matrix Properties
        /** Calculates the transpose of a matrix M. */
        function transpose(M) {
            let T = [];
            for (let j = 0; j < M[0].length; ++j) {
                let row = [];
                for (let i = 0; i < M.length; ++i) {
                    row.push(M[i][j]);
                }
                T.push(row);
            }
            return T;
        }
        Matrix.transpose = transpose;
        /** Calculates the determinant of a matrix M. */
        function determinant(M) {
            if (M.length !== M[0].length)
                throw new Error('Not a square matrix.');
            let n = M.length;
            // Shortcuts for small n
            if (n === 1)
                return M[0][0];
            if (n === 2)
                return M[0][0] * M[1][1] - M[0][1] * M[1][0];
            let det = 0;
            for (let j = 0; j < n; ++j) {
                let diagLeft = M[0][j];
                let diagRight = M[0][j];
                for (let i = 1; i < n; ++i) {
                    diagRight *= M[i][j + i % n];
                    diagLeft *= M[i][j - i % n];
                }
                det += diagRight - diagLeft;
            }
            return det;
        }
        Matrix.determinant = determinant;
        /** Calculates the inverse of a matrix M. */
        function inverse(M) {
            // Perform Gaussian elimination:
            // (1) Apply the same operations to both I and C.
            // (2) Turn C into the identity, thereby turning I into the inverse of C.
            let n = M.length;
            if (n !== M[0].length)
                throw new Error('Not a square matrix.');
            let I = identity(n);
            let C = tabulate2D((x, y) => M[x][y], n, n); // Copy of original matrix
            for (let i = 0; i < n; ++i) {
                // Loop over the elements e in along the diagonal of C.
                let e = C[i][i];
                // If e is 0, we need to swap this row with a lower row.
                if (!e) {
                    for (let ii = i + 1; ii < n; ++ii) {
                        if (C[ii][i] !== 0) {
                            for (let j = 0; j < n; ++j) {
                                [C[ii][j], C[i][j]] = [C[i][j], C[ii][j]];
                                [I[ii][j], I[i][j]] = [I[i][j], I[ii][j]];
                            }
                            break;
                        }
                    }
                    e = C[i][i];
                    if (!e)
                        throw new Error('Matrix not invertible.');
                }
                // Scale row by e, so that we have a 1 on the diagonal.
                for (let j = 0; j < n; ++j) {
                    C[i][j] = C[i][j] / e;
                    I[i][j] = I[i][j] / e;
                }
                // Subtract a multiple of this row from all other rows,
                // so that they end up having 0s in this column.
                for (let ii = 0; ii < n; ++ii) {
                    if (ii === i)
                        continue;
                    let f = C[ii][i];
                    for (let j = 0; j < n; ++j) {
                        C[ii][j] -= f * C[i][j];
                        I[ii][j] -= f * I[i][j];
                    }
                }
            }
            return I;
        }
        Matrix.inverse = inverse;
    })(Matrix || (Matrix = {}));

    // ============================================================================
    var Random;
    (function (Random) {
        /** Randomly shuffles the elements in an array a. */
        function shuffle(a) {
            a = a.slice(0); // create copy
            for (let i = a.length - 1; i > 0; --i) {
                let j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
        Random.shuffle = shuffle;
        /** Generates a random integer between 0 and a, or between a and b. */
        function integer(a, b) {
            let start = (b === undefined ? 0 : a);
            let length = (b === undefined ? a : b - a + 1);
            return start + Math.floor(length * Math.random());
        }
        Random.integer = integer;
        /** Chooses a random index value from weights [2, 5, 3] */
        function weighted(weights) {
            const x = Math.random() * total(weights);
            let cum = 0;
            return weights.findIndex((w) => (cum += w) >= x);
        }
        Random.weighted = weighted;
        // ---------------------------------------------------------------------------
        // Smart Random Number Generators
        const SMART_RANDOM_CACHE = new Map();
        /**
         * Returns a random number between 0 and n, but avoids returning the same
         * number multiple times in a row.
         */
        function smart(n, id) {
            if (!id)
                id = uid();
            if (!SMART_RANDOM_CACHE.has(id))
                SMART_RANDOM_CACHE.set(id, repeat(1, n));
            const cache = SMART_RANDOM_CACHE.get(id);
            const x = weighted(cache.map(x => x * x));
            cache[x] -= 1;
            if (cache[x] <= 0)
                SMART_RANDOM_CACHE.set(id, cache.map(x => x + 1));
            return x;
        }
        Random.smart = smart;
        // ---------------------------------------------------------------------------
        // Probability Distribution
        /** Generates a Bernoulli random variable. */
        function bernoulli(p = 0.5) {
            return (Math.random() < p ? 1 : 0);
        }
        Random.bernoulli = bernoulli;
        /** Generates a Binomial random variable. */
        function binomial(n = 1, p = 0.5) {
            let t = 0;
            for (let i = 0; i < n; ++i)
                t += bernoulli(p);
            return t;
        }
        Random.binomial = binomial;
        /** Generates a Poisson random variable. */
        function poisson(l = 1) {
            if (l <= 0)
                return 0;
            const L = Math.exp(-l);
            let p = 1;
            let k = 0;
            for (; p > L; ++k)
                p *= Math.random();
            return k - 1;
        }
        Random.poisson = poisson;
        /** Generates a uniform random variable. */
        function uniform(a = 0, b = 1) {
            return a + (b - a) * Math.random();
        }
        Random.uniform = uniform;
        /** Generates a normal random variable with mean m and variance v. */
        function normal(m = 0, v = 1) {
            const u1 = Math.random();
            const u2 = Math.random();
            const rand = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            return rand * Math.sqrt(v) + m;
        }
        Random.normal = normal;
        /** Generates an exponential random variable. */
        function exponential(l = 1) {
            return l <= 0 ? 0 : -Math.log(Math.random()) / l;
        }
        Random.exponential = exponential;
        /** Generates a geometric random variable. */
        function geometric(p = 0.5) {
            if (p <= 0 || p > 1)
                return undefined;
            return Math.floor(Math.log(Math.random()) / Math.log(1 - p));
        }
        Random.geometric = geometric;
        /** Generates an Cauchy random variable. */
        function cauchy() {
            let rr, v1, v2;
            do {
                v1 = 2 * Math.random() - 1;
                v2 = 2 * Math.random() - 1;
                rr = v1 * v1 + v2 * v2;
            } while (rr >= 1);
            return v1 / v2;
        }
        Random.cauchy = cauchy;
        // ---------------------------------------------------------------------------
        // PDFs and CDFs
        /** Generates pdf(x) for the normal distribution with mean m and variance v. */
        function normalPDF(x, m = 1, v = 0) {
            return Math.exp(-((x - m) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
        }
        Random.normalPDF = normalPDF;
        const G = 7;
        const P = [
            0.99999999999980993,
            676.5203681218851,
            -1259.1392167224028,
            771.32342877765313,
            -176.61502916214059,
            12.507343278686905,
            -0.13857109526572012,
            9.9843695780195716e-6,
            1.5056327351493116e-7
        ];
        function gamma(z) {
            if (z < 0.5)
                return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
            z -= 1;
            let x = P[0];
            for (let i = 1; i < G + 2; i++)
                x += P[i] / (z + i);
            let t = z + G + 0.5;
            return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
        }
        /** Riemann-integrates fn(x) from xMin to xMax with an interval size dx. */
        function integrate(fn, xMin, xMax, dx = 1) {
            let result = 0;
            for (let x = xMin; x < xMax; x += dx) {
                result += (fn(x) * dx || 0);
            }
            return result;
        }
        Random.integrate = integrate;
        /** The chi CDF function. */
        function chiCDF(chi, deg) {
            let int = integrate(t => Math.pow(t, (deg - 2) / 2) * Math.exp(-t / 2), 0, chi);
            return 1 - int / Math.pow(2, deg / 2) / gamma(deg / 2);
        }
        Random.chiCDF = chiCDF;
    })(Random || (Random = {}));

    // =============================================================================
    function evaluatePolynomial(regression, x) {
        let xs = 1;
        let t = regression[0];
        for (let i = 1; i < regression.length; ++i) {
            xs *= x;
            t += xs * regression[i];
        }
        return t;
    }
    var Regression;
    (function (Regression) {
        /**
         * Finds a linear regression that best approximates a set of data. The result
         * will be an array [c, m], where y = m * x + c.
         */
        function linear(data, throughOrigin = false) {
            let sX = 0, sY = 0, sXX = 0, sXY = 0;
            const len = data.length;
            for (let n = 0; n < len; n++) {
                sX += data[n][0];
                sY += data[n][1];
                sXX += data[n][0] * data[n][0];
                sXY += data[n][0] * data[n][1];
            }
            if (throughOrigin) {
                const gradient = sXY / sXX;
                return [0, gradient];
            }
            const gradient = (len * sXY - sX * sY) / (len * sXX - sX * sX);
            const intercept = (sY / len) - (gradient * sX) / len;
            return [intercept, gradient];
        }
        Regression.linear = linear;
        /**
         * Finds an exponential regression that best approximates a set of data. The
         * result will be an array [a, b], where y = a * e^(bx).
         */
        function exponential(data) {
            const sum = [0, 0, 0, 0, 0, 0];
            for (const d of data) {
                sum[0] += d[0];
                sum[1] += d[1];
                sum[2] += d[0] * d[0] * d[1];
                sum[3] += d[1] * Math.log(d[1]);
                sum[4] += d[0] * d[1] * Math.log(d[1]);
                sum[5] += d[0] * d[1];
            }
            const denominator = (sum[1] * sum[2] - sum[5] * sum[5]);
            const a = Math.exp((sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
            const b = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;
            return [a, b];
        }
        Regression.exponential = exponential;
        /**
         * Finds a logarithmic regression that best approximates a set of data. The
         * result will be an array [a, b], where y = a + b * log(x).
         */
        function logarithmic(data) {
            const sum = [0, 0, 0, 0];
            const len = data.length;
            for (const d of data) {
                sum[0] += Math.log(d[0]);
                sum[1] += d[1] * Math.log(d[0]);
                sum[2] += d[1];
                sum[3] += Math.pow(Math.log(d[0]), 2);
            }
            const b = (len * sum[1] - sum[2] * sum[0]) /
                (len * sum[3] - sum[0] * sum[0]);
            const a = (sum[2] - b * sum[0]) / len;
            return [a, b];
        }
        Regression.logarithmic = logarithmic;
        /**
         * Finds a power regression that best approximates a set of data. The result
         * will be an array [a, b], where y = a * x^b.
         */
        function power(data) {
            const sum = [0, 0, 0, 0];
            const len = data.length;
            for (const d of data) {
                sum[0] += Math.log(d[0]);
                sum[1] += Math.log(d[1]) * Math.log(d[0]);
                sum[2] += Math.log(d[1]);
                sum[3] += Math.pow(Math.log(d[0]), 2);
            }
            const b = (len * sum[1] - sum[2] * sum[0]) /
                (len * sum[3] - sum[0] * sum[0]);
            const a = Math.exp((sum[2] - b * sum[0]) / len);
            return [a, b];
        }
        Regression.power = power;
        /**
         * Finds a polynomial regression of given `order` that best approximates a set
         * of data. The result will be an array giving the coefficients of the
         * resulting polynomial.
         */
        function polynomial(data, order = 2) {
            // X = [[1, x1, x1^2], [1, x2, x2^2], [1, x3, x3^2]
            // y = [y1, y2, y3]
            let X = data.map(d => list(order + 1).map(p => Math.pow(d[0], p)));
            let XT = Matrix.transpose(X);
            let y = data.map(d => [d[1]]);
            let XTX = Matrix.product(XT, X); // XT*X
            let inv = Matrix.inverse(XTX); // (XT*X)^(-1)
            let r = Matrix.product(inv, XT, y); // (XT*X)^(-1) * XT * y
            return r.map(x => x[0]); // Flatten matrix
        }
        Regression.polynomial = polynomial;
        // ---------------------------------------------------------------------------
        // Regression Coefficient
        /**
         * Finds the regression coefficient of a given data set and regression
         * function.
         */
        function coefficient(data, fn) {
            let total = data.reduce((sum, d) => sum + d[1], 0);
            let mean = total / data.length;
            // Sum of squares of differences from the mean in the dependent variable
            let ssyy = data.reduce((sum, d) => sum + (d[1] - mean) ** 2, 0);
            // Sum of squares of residuals
            let sse = data.reduce((sum, d) => sum + (d[1] - fn(d[0])) ** 2, 0);
            return 1 - (sse / ssyy);
        }
        Regression.coefficient = coefficient;
        // ---------------------------------------------------------------------------
        // Multi-Regression
        /** Finds the most suitable polynomial regression for a given dataset. */
        function bestPolynomial(data, threshold = 0.85, maxOrder = 8) {
            if (data.length <= 1)
                return undefined;
            for (let i = 1; i < maxOrder; ++i) {
                const reg = polynomial(data, i);
                const fn = (x) => evaluatePolynomial(reg, x);
                const coeff = coefficient(data, fn);
                if (coeff >= threshold)
                    return { order: i, coefficients: reg, fn };
            }
            return undefined;
        }
        Regression.bestPolynomial = bestPolynomial;
    })(Regression || (Regression = {}));

    // =============================================================================
    /** Converts a JSON object to an HTML query string. */
    function toQueryString(data) {
        const pairs = [];
        for (let key of Object.keys(data)) {
            let value = data[key];
            key = encodeURIComponent(key);
            if (value == undefined) {
                pairs.push(key);
                continue;
            }
            value = Array.isArray(value) ? value.join(',') : '' + value;
            value = value.replace(/(\r)?\n/g, '\r\n');
            value = encodeURIComponent(value);
            value = value.replace(/%20/g, '+');
            pairs.push(key + '=' + value);
        }
        return pairs.join('&');
    }
    // -----------------------------------------------------------------------------
    // Request Utilities
    /**
     * Asynchronously loads a resource using a POST request. This utility function
     * automatically form-encodes JSON data and adds a CSRF header.
     */
    function post(url, data) {
        const options = {
            method: 'POST',
            body: !data ? undefined :
                (typeof data === 'string') ? data : toQueryString(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-Token': window.csrfToken || ''
            }
        };
        const ext = url.includes('?') ? '&xhr=1' : '?xhr=1';
        return fetch(url + ext, options).then((r) => r.text());
    }
    /** Asynchronously loads and executes a JS script. */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const el = document.createElement('script');
            el.src = src;
            el.onerror = reject;
            el.onload = resolve;
            document.head.appendChild(el); // TODO Needs document!
        });
    }
    /** Asynchronously loads an Image. */
    function loadImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = url;
        });
    }
    // -----------------------------------------------------------------------------
    // Deferred Post
    const POST_DATA = new Map();
    function savePostData(url, data) {
        if (POST_DATA.has(url)) {
            deepExtend(POST_DATA.get(url), data, (a, b) => unique(a.concat(b)));
        }
        else {
            POST_DATA.set(url, data);
        }
    }
    function sendPostData() {
        if (!window.navigator.onLine)
            return;
        for (const [url, data] of POST_DATA) {
            // Remove the POST data immediately, but add it back if the request fails.
            // This means that deferredPost() can be called while an AJAX request is
            // in progress, and the data is not lost.
            POST_DATA.delete(url);
            post(url, { data: JSON.stringify(data) })
                .catch((error) => {
                console.error('Failed to send POST request:', error);
                savePostData(url, data);
            });
        }
    }
    const doDeferredPost = throttle(sendPostData, 5000);
    window.addEventListener('online', doDeferredPost);
    window.onbeforeunload = sendPostData;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter$1(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    // =============================================================================
    // Boost.js | Expression Parsing
    // Based on http://jsep.from.so
    // (c) Mathigon
    // =============================================================================
    // -----------------------------------------------------------------------------
    // Interfaces
    var NODE_TYPE;
    (function (NODE_TYPE) {
        NODE_TYPE[NODE_TYPE["Array"] = 0] = "Array";
        NODE_TYPE[NODE_TYPE["BinaryOp"] = 1] = "BinaryOp";
        NODE_TYPE[NODE_TYPE["Call"] = 2] = "Call";
        NODE_TYPE[NODE_TYPE["Conditional"] = 3] = "Conditional";
        NODE_TYPE[NODE_TYPE["Identifier"] = 4] = "Identifier";
        NODE_TYPE[NODE_TYPE["Literal"] = 5] = "Literal";
        NODE_TYPE[NODE_TYPE["Member"] = 6] = "Member";
        NODE_TYPE[NODE_TYPE["UnaryOp"] = 7] = "UnaryOp";
    })(NODE_TYPE || (NODE_TYPE = {}));
    // -----------------------------------------------------------------------------
    // Constants
    const BINARY_OPS = {
        // TODO Operator overloading (e.g. add vectors or complex numbers)
        '===': (a, b) => a === b,
        '!==': (a, b) => a !== b,
        '||': (a, b) => a || b,
        '&&': (a, b) => a && b,
        '==': (a, b) => a == b,
        '!=': (a, b) => a != b,
        '<=': (a, b) => a <= b,
        '>=': (a, b) => a >= b,
        '**': (a, b) => Math.pow(a, b),
        '<': (a, b) => a < b,
        '>': (a, b) => a > b,
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '%': (a, b) => a % b
    };
    const UNARY_OPS = {
        '-': (a) => -a,
        '+': (a) => +a,
        '!': (a) => !a
    };
    // Binary operations with their precedence
    const BINARY_PRECEDENCE = {
        '||': 1, '&&': 2,
        '==': 3, '!=': 3, '===': 3, '!==': 3,
        '<': 4, '>': 4, '<=': 4, '>=': 4,
        '+': 5, '-': 5,
        '*': 6, '/': 6, '%': 6,
        '**': 7 // TODO Exponentiation should be right-to-left.
    };
    const LITERALS = {
        'true': true,
        'false': false,
        'undefined': undefined
    };
    const SPACE = /\s/;
    const DIGIT = /[0-9]/;
    const IDENTIFIER_START = /[a-zA-Zα-ωΑ-Ω$_]/; // Variables cannot start with a number.
    const IDENTIFIER_PART = /[0-9a-zA-Zα-ωΑ-Ω$_]/;
    // -----------------------------------------------------------------------------
    // Expression Parser
    function parseSyntaxTree(expr) {
        const length = expr.length;
        let index = 0; // Current cursor position
        function throwError(message) {
            throw new Error(`${message} at character ${index} of "${expr}"`);
        }
        function gobbleSpaces() {
            while (SPACE.test(expr[index]))
                index += 1;
        }
        // Gobble a simple numeric literals (e.g. `12`, `3.4`, `.5`).
        function gobbleNumericLiteral() {
            let number = '';
            while (DIGIT.test(expr[index]))
                number += expr[index++];
            if (expr[index] === '.') {
                number += expr[index++];
                while (DIGIT.test(expr[index]))
                    number += expr[index++];
            }
            const char = expr[index];
            if (char && IDENTIFIER_START.test(char)) {
                const name = number + expr[index];
                throwError(`Variable names cannot start with a number (${name})`);
            }
            else if (char === '.') {
                throwError('Unexpected period');
            }
            return { type: NODE_TYPE.Literal, value: parseFloat(number) };
        }
        // Gobble a string literal, staring with single or double quotes.
        function gobbleStringLiteral() {
            const quote = expr[index];
            index += 1;
            let closed = false;
            let string = '';
            while (index < length) {
                let char = expr[index++];
                if (char === quote) {
                    closed = true;
                    break;
                }
                string += char;
            }
            if (!closed)
                throwError(`Unclosed quote after "${string}"`);
            return { type: NODE_TYPE.Literal, value: string };
        }
        // Gobbles identifiers and literals (e.g. `foo`, `_value`, `$x1`, `true`).
        function gobbleIdentifier() {
            let name = expr[index];
            if (!IDENTIFIER_START.test(expr[index]))
                throwError('Unexpected ' + name);
            index += 1;
            while (index < length) {
                if (IDENTIFIER_PART.test(expr[index])) {
                    name += expr[index++];
                }
                else {
                    break;
                }
            }
            if (name in LITERALS) {
                return { type: NODE_TYPE.Literal, value: LITERALS[name] };
            }
            else {
                return { type: NODE_TYPE.Identifier, name };
            }
        }
        // Gobbles a list of arguments within a function call or array literal. It
        // assumes that the opening character has already been gobbled (e.g.
        // `foo(bar, baz)`, `my_func()`, or `[bar, baz]`).
        function gobbleArguments(termination) {
            const args = [];
            let closed = false;
            let lastArg = undefined;
            while (index < length) {
                if (expr[index] === termination) {
                    if (lastArg)
                        args.push(lastArg);
                    closed = true;
                    index += 1;
                    break;
                }
                else if (expr[index] === ',') {
                    args.push(lastArg || { type: NODE_TYPE.Literal, value: undefined });
                    index += 1;
                }
                else {
                    lastArg = gobbleExpression();
                }
            }
            if (!closed)
                throwError('Expected ' + termination);
            return args;
        }
        // Parse a non-literal variable name. It name may include properties (`foo`,
        // `bar.baz`, `foo['bar'].baz`) or function calls (`Math.acos(obj.angle)`).
        function gobbleVariable() {
            let node;
            if (expr[index] === '(') {
                index += 1;
                node = gobbleExpression();
                gobbleSpaces();
                if (expr[index] === ')') {
                    index += 1;
                    return node;
                }
                else {
                    throwError('Unclosed (');
                }
            }
            else {
                node = gobbleIdentifier();
            }
            gobbleSpaces();
            while ('.[('.includes(expr[index])) {
                if (expr[index] === '.') {
                    // Object property accessors.
                    index++;
                    gobbleSpaces();
                    node = {
                        type: NODE_TYPE.Member,
                        object: node,
                        computed: false,
                        property: gobbleIdentifier()
                    };
                }
                else if (expr[index] === '[') {
                    // Array index accessors.
                    index++;
                    node = {
                        type: NODE_TYPE.Member,
                        object: node,
                        computed: true,
                        property: gobbleExpression()
                    };
                    gobbleSpaces();
                    if (expr[index] !== ']')
                        throwError('Unclosed [');
                    index++;
                }
                else if (expr[index] === '(') {
                    // A function call is being made; gobble all the arguments
                    index++;
                    node = {
                        type: NODE_TYPE.Call,
                        args: gobbleArguments(')'),
                        callee: node
                    };
                }
                gobbleSpaces();
            }
            return node;
        }
        // Search for the operation portion of the string (e.g. `+`, `===`)
        function gobbleBinaryOp() {
            gobbleSpaces();
            for (const length of [3, 2, 1]) { // Different possible operator lengths
                const substr = expr.substr(index, length);
                if (substr in BINARY_OPS) {
                    index += length;
                    return substr;
                }
            }
        }
        // Parse an individual part of a binary expression (e.g. `foo.bar(baz)`, `1`,
        // `"abc"` or `(a % 2)` because it is in parenthesis).
        // TODO Support expressions like `[a, b][c]` or `([a, b])[c]`.
        function gobbleToken() {
            gobbleSpaces();
            let operator = expr[index];
            if (DIGIT.test(operator) || operator === '.') {
                return gobbleNumericLiteral();
            }
            else if (operator === '\'' || operator === '"') {
                // Single or double quotes
                return gobbleStringLiteral();
            }
            else if (operator === '[') {
                index += 1;
                return { type: NODE_TYPE.Array, elements: gobbleArguments(']') };
            }
            else if (operator in UNARY_OPS) {
                index += 1;
                return { type: NODE_TYPE.UnaryOp, operator, argument: gobbleToken() };
            }
            else if (IDENTIFIER_START.test(operator) || operator === '(') {
                // `foo`, `bar.baz`
                return gobbleVariable();
            }
            throwError('Expression parsing error');
        }
        // Parse individual expressions (e.g. `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`)
        function gobbleBinaryExpression() {
            let left = gobbleToken();
            let biop = gobbleBinaryOp();
            if (!biop)
                return left;
            let right = gobbleToken();
            if (!right)
                throwError('Expected expression after ' + biop);
            // If there are multiple binary operators, we have to stack them in the
            // correct order using recursive descent.
            let node;
            let stack = [left, biop, right];
            while ((biop = gobbleBinaryOp())) {
                let prec = BINARY_PRECEDENCE[biop];
                let cur_biop = biop;
                while (stack.length > 2 && prec <=
                    BINARY_PRECEDENCE[stack[stack.length - 2]]) {
                    right = stack.pop();
                    biop = stack.pop();
                    left = stack.pop();
                    node = { type: NODE_TYPE.BinaryOp, operator: biop, left, right };
                    stack.push(node);
                }
                node = gobbleToken();
                if (!node)
                    throwError('Expected expression after ' + cur_biop);
                stack.push(cur_biop, node);
            }
            let i = stack.length - 1;
            node = stack[i];
            while (i > 1) {
                node = {
                    type: NODE_TYPE.BinaryOp, operator: stack[i - 1],
                    left: stack[i - 2], right: node
                };
                i -= 2;
            }
            return node;
        }
        // Parse ternary expressions (e.g. `a ? b : c`).
        function gobbleExpression() {
            const test = gobbleBinaryExpression();
            gobbleSpaces();
            if (test && expr[index] === '?') {
                // Ternary expression: test ? consequent : alternate
                index += 1;
                const consequent = gobbleExpression();
                if (!consequent)
                    throwError('Expected expression');
                gobbleSpaces();
                if (expr[index] === ':') {
                    index++;
                    let alternate = gobbleExpression();
                    if (!alternate)
                        throwError('Expected expression');
                    return { type: NODE_TYPE.Conditional, test, consequent, alternate };
                }
                else {
                    throwError('Expected :');
                }
            }
            else {
                return test;
            }
        }
        const node = gobbleExpression();
        if (index < expr.length)
            throwError(`Unexpected "${expr[index]}"`);
        return node;
    }
    // -----------------------------------------------------------------------------
    // Evaluations
    const EMPTY = [undefined, undefined];
    /**
     * Returns [value, this]. We need to keep track of the `this` value so that
     * we can correctly set the context for object member method calls. Unlike
     * normal JavaScript,
     * (1) We evaluate all arguments or logical/ternary operators, so that we can
     *     correctly track dependencies in an Observable() context.
     * (2) All operations are "safe", i.e. when one of the arguments is undefined,
     *     we return undefined, rather than throwing an error.
     */
    function evaluate(node, context) {
        switch (node.type) {
            case NODE_TYPE.Array:
                const v1 = node.elements.map((n) => evaluate(n, context)[0]);
                if (v1.some(v => v === undefined))
                    return EMPTY;
                return [v1, undefined];
            case NODE_TYPE.BinaryOp:
                const left = evaluate(node.left, context)[0];
                const right = evaluate(node.right, context)[0];
                if ('+-**/%'.includes(node.operator) && (left === undefined || right === undefined))
                    return EMPTY;
                return [BINARY_OPS[node.operator](left, right), undefined];
            case NODE_TYPE.Call:
                // Note: we evaluate arguments even if fn is undefined.
                const [fn, self] = evaluate(node.callee, context);
                const args = node.args.map((n) => evaluate(n, context)[0]);
                if (args.some(v => v === undefined) || typeof fn !== 'function')
                    return EMPTY;
                return [fn.apply(self, args), undefined];
            case NODE_TYPE.Conditional:
                // Note: we evaluate all possible options of the unary operator.
                const consequent = evaluate(node.consequent, context);
                const alternate = evaluate(node.alternate, context);
                return evaluate(node.test, context)[0] ? consequent : alternate;
            case NODE_TYPE.Identifier:
                return [context[node.name], undefined];
            case NODE_TYPE.Literal:
                return [node.value, undefined];
            case NODE_TYPE.Member:
                const object = evaluate(node.object, context)[0];
                const property = node.computed ? evaluate(node.property, context)[0] :
                    node.property.name;
                return object ? [object[property], object] : [undefined, undefined];
            case NODE_TYPE.UnaryOp:
                const arg = evaluate(node.argument, context)[0];
                if (arg === undefined)
                    return EMPTY;
                return [UNARY_OPS[node.operator](arg), undefined];
        }
    }
    /**
     * Compiles a JS expression into a function that can be evaluated with context.
     */
    function compile(expr) {
        const node = parseSyntaxTree(expr);
        if (!node)
            return (context = {}) => undefined;
        return (context = {}) => evaluate(node, context)[0];
    }
    // -----------------------------------------------------------------------------
    // Template Strings
    const TEMPLATE = /\${([^}]+)}/g;
    /**
     * Converts an expression string into an executable JS function. It will replace
     * all `${x}` type expressions and evaluate them based on a context.
     */
    function compileString(expr) {
        expr = expr.replace(/×/g, '*');
        // This array contains the alternating static and variable parts of the expr.
        // For example, the input expression `Here ${is} some ${text}` would give
        // parts = ['Here ', 'is', ' some ', 'text', ''].
        const parts = expr.split(TEMPLATE);
        const fns = parts.map((p, i) => (i % 2) ? compile(p) : undefined);
        return (context) => {
            return parts.map((p, i) => {
                if (!(i % 2))
                    return p;
                const value = fns[i](context);
                // Special formatting for negative numbers.
                return (typeof value === 'number' && value < 0) ? '–' + (-value) : value;
            }).join('');
        };
    }

    // =============================================================================
    const touchSupport = ('ontouchstart' in window);
    const pointerSupport = ('onpointerdown' in window);
    /** Gets the pointer position from an event. */
    function pointerPosition(e) {
        if (e.touches) {
            const touches = e.targetTouches.length ? e.targetTouches : e.changedTouches;
            return new Point(touches[0].clientX, touches[0].clientY);
        }
        else {
            return new Point(e.clientX || 0, e.clientY || 0);
        }
    }
    function getTouches(e) {
        return e.touches || [];
    }
    /**
     * Gets the pointer position from an event triggered on an `<svg>` element, in
     * the coordinate system of the `<svg>` element.
     */
    function svgPointerPosn(event, $svg) {
        const posn = pointerPosition(event);
        return posn.transform($svg.inverseTransformMatrix);
    }
    /**
     * Gets the pointer position from an event triggered on an `<canvas>` element,
     * in the coordinate system of the `<canvas>` element.
     */
    function canvasPointerPosition(event, $canvas) {
        const posn = pointerPosition(event);
        const bounds = $canvas.bounds;
        const x = (posn.x - bounds.left) * $canvas.canvasWidth / bounds.width;
        const y = (posn.y - bounds.top) * $canvas.canvasHeight / bounds.height;
        return new Point(x, y);
    }
    /**
     * Get the target element for an event, including for touch/pointer events
     * that started on a different element.
     */
    function getEventTarget(event) {
        if (event instanceof PointerEvent && event.pointerType === 'mouse') {
            // Only pointer mouse events update the target for move events that started
            // on a different element.
            return $(event.target);
        }
        const posn = pointerPosition(event);
        return $(document.elementFromPoint(posn.x, posn.y) || undefined);
    }
    // -----------------------------------------------------------------------------
    // Click Events
    function makeTapEvent($el) {
        // TODO Support removing events.
        if ($el._data['tapEvent'])
            return;
        $el._data['tapEvent'] = true;
        let start = undefined;
        $el.on('pointerdown', (e) => start = pointerPosition(e));
        $el.on('pointerup', (e) => {
            if (!start)
                return;
            const end = pointerPosition(e);
            if (Point.distance(start, end) < 6)
                $el.trigger('tap', e);
            start = undefined;
        });
        $el.on('pointercancel', () => start = undefined);
    }
    function makeClickOutsideEvent($el) {
        // TODO Support removing events.
        if ($el._data['clickOutsideEvent'])
            return;
        $el._data['clickOutsideEvent'] = true;
        $body.on('pointerdown', (e) => {
            const $target = $(e.target);
            if ($target && ($target.equals($el) || $target.hasParent($el)))
                return;
            $el.trigger('clickOutside', e);
        });
    }
    function slide($el, fns) {
        const $box = fns.$box || $el;
        let posn = pointerPosition;
        if ($box.type === 'svg') {
            posn = (e) => svgPointerPosn(e, $box.$ownerSVG);
        }
        else if ($box.type === 'canvas') {
            posn = (e) => canvasPointerPosition(e, $box);
        }
        const $parent = fns.justInside ? $el : $body;
        let startPosn = undefined;
        let lastPosn = undefined;
        let hasMoved = false;
        let pointerId = 0;
        if ($el.css('touch-action') === 'auto')
            $el.css('touch-action', 'none');
        function start(e) {
            if (e.handled || getTouches(e).length > 1)
                return;
            e.preventDefault();
            hasMoved = false;
            pointerId = e.pointerId || 0;
            $parent.on('pointermove', move);
            $parent.on('pointerstop', end);
            startPosn = lastPosn = posn(e);
            if (fns.down)
                fns.down(startPosn);
        }
        function move(e) {
            if (pointerId && e.pointerId !== pointerId)
                return;
            e.preventDefault();
            const p = posn(e);
            if (Point.distance(p, lastPosn) < 0.5)
                return;
            if (!hasMoved && fns.start)
                fns.start(startPosn);
            if (fns.move)
                fns.move(p, startPosn, lastPosn);
            lastPosn = p;
            hasMoved = true;
        }
        function end(e) {
            if (pointerId && e.pointerId !== pointerId)
                return;
            e.preventDefault();
            $parent.off('pointermove', move);
            $parent.off('pointerstop', end);
            if (fns.up)
                fns.up(lastPosn, startPosn);
            if (hasMoved && fns.end)
                fns.end(lastPosn, startPosn);
            if (!hasMoved && fns.click)
                fns.click(startPosn);
        }
        $el.on('pointerdown', start);
        if (fns.justInside)
            $el.on('mouseleave', end);
        if (fns.accessible) {
            $el.setAttr('tabindex', '0');
            document.addEventListener('keydown', (e) => {
                if (![37, 38, 39, 40].includes(e.keyCode))
                    return;
                if ($el !== Browser.getActiveInput())
                    return;
                const center = $el.boxCenter;
                const start = posn({ clientX: center.x, clientY: center.y });
                const dx = (e.keyCode === 37) ? -25 : (e.keyCode === 39) ? 25 : 0;
                const dy = (e.keyCode === 38) ? -25 : (e.keyCode === 40) ? 25 : 0;
                const end = start.shift(dx, dy);
                if (fns.down)
                    fns.down(start);
                if (fns.start)
                    fns.start(start);
                if (fns.move)
                    fns.move(end, start, start);
                if (fns.end)
                    fns.end(end, start);
            });
        }
    }
    // -----------------------------------------------------------------------------
    // Scroll Events
    function makeScrollEvents($el) {
        // TODO Support removing events.
        if ($el._data['scrollEvents'])
            return;
        $el._data['scrollEvents'] = true;
        let ticking = false;
        let top = undefined;
        function tick() {
            const newTop = $el.scrollTop;
            if (newTop === top) {
                ticking = false;
                return;
            }
            top = newTop;
            $el.trigger('scroll', { top });
            // TODO Scroll should trigger mousemove events.
            window.requestAnimationFrame(tick);
        }
        function scroll() {
            if (!ticking)
                window.requestAnimationFrame(tick);
            ticking = true;
        }
        // Mouse Events
        const target = $el.type === 'window' ? window : $el._el;
        target.addEventListener('scroll', scroll);
        // Touch Events
        function touchStart() {
            window.addEventListener('touchmove', scroll);
            window.addEventListener('touchend', touchEnd);
        }
        function touchEnd() {
            window.removeEventListener('touchmove', scroll);
            window.removeEventListener('touchend', touchEnd);
        }
        $el._el.addEventListener('touchstart', function (e) {
            if (!e.handled)
                touchStart();
        });
    }
    // -----------------------------------------------------------------------------
    // Intersection Events
    let observer;
    function intersectionCallback(entries) {
        for (const e of entries) {
            const event = e.isIntersecting ? 'enterViewport' : 'exitViewport';
            setTimeout(() => $(e.target).trigger(event));
        }
    }
    function makeIntersectionEvents($el) {
        // TODO Support removing events.
        if ($el._data['intersectionEvents'])
            return;
        $el._data['intersectionEvents'] = true;
        // Polyfill for window.IntersectionObserver
        if (!window.IntersectionObserver) {
            let wasVisible = false;
            $body.on('scroll', () => {
                const isVisible = $el.isInViewport;
                if (wasVisible && !isVisible) {
                    $el.trigger('exitViewport');
                    wasVisible = false;
                }
                else if (isVisible && !wasVisible) {
                    $el.trigger('enterViewport');
                    wasVisible = true;
                }
            });
            return;
        }
        if (!observer)
            observer = new IntersectionObserver(intersectionCallback);
        observer.observe($el._el);
    }
    // -----------------------------------------------------------------------------
    // Resize Events
    function makeResizeEvents($el, remove = false) {
        if (remove) {
            if ($el._data['resizeObserver'])
                $el._data['resizeObserver'].disconnect();
            $el._data['resizeObserver'] = undefined;
        }
        if ($el._data['resizeObserver'])
            return;
        if (window.ResizeObserver) {
            const observer = new window.ResizeObserver(() => $el.trigger('resize'));
            observer.observe($el._el);
            $el._data['resizeObserver'] = observer;
        }
        else if (window.MutationObserver) {
            const observer = new MutationObserver(() => $el.trigger('resize'));
            observer.observe($el._el, { attributes: true, childList: true, characterData: true, subtree: true });
            $el._data['resizeObserver'] = observer;
        }
    }
    // -----------------------------------------------------------------------------
    // Pointer Events
    function makePointerPositionEvents($el) {
        // TODO Support removing events.
        if ($el._data['pointerPositionEvents'])
            return;
        $el._data['pointerPositionEvents'] = true;
        const parent = $el.parent;
        let isInside = undefined;
        parent.on('pointerend', () => isInside = undefined);
        parent.on('pointermove', (e) => {
            const wasInside = isInside;
            const target = getEventTarget(e);
            isInside = target.equals($el) || target.hasParent($el);
            if (wasInside != undefined && isInside && !wasInside)
                $el.trigger('pointerenter', e);
            if (!isInside && wasInside)
                $el.trigger('pointerleave', e);
        });
    }
    // -----------------------------------------------------------------------------
    // Mouse Events
    // On touch devices, mouse events are emulated. We don't want that!
    function makeMouseEvent(eventName, $el) {
        // TODO Support removing events.
        if ($el._data['_' + eventName])
            return;
        $el._data['_' + eventName] = true;
        if (pointerSupport) {
            $el.on(eventName.replace('mouse', 'pointer'), (e) => {
                if (e.pointerType === 'mouse')
                    $el.trigger(eventName, e);
            });
        }
        else if (!touchSupport) {
            $el._el.addEventListener(eventName, (e) => $el.trigger(eventName, e));
        }
    }
    // -----------------------------------------------------------------------------
    // Keyboard Events
    function makeKeyEvent($el) {
        // On Android, the keydown event always returns character 229, except for the
        // backspace button which works as expected. Instead, we have to listen to the
        // input event and get the last character of the typed text. Note that this
        // only works if the cursor is at the end, or if the input field gets cleared
        // after every key.
        // Note that e.keyCode is deprecated, but iOS doesn't support e.key yet.
        $el.on('keydown', (e) => {
            if (e.metaKey || e.ctrlKey)
                return;
            if (Browser.isAndroid && e.keyCode === 229)
                return;
            const key = (e.key || String.fromCharCode(e.which)).toLowerCase();
            $el.trigger('key', { code: e.keyCode, key });
        });
        if (Browser.isAndroid && $el.type === 'input') {
            $el.on('input', (e) => {
                const key = e.data[e.data.length - 1].toLowerCase();
                $el.trigger('key', { code: undefined, key });
                $el.value = '';
            });
        }
    }
    // -----------------------------------------------------------------------------
    // Event Creation
    const aliases = {
        scrollwheel: 'DOMMouseScroll mousewheel',
        pointerdown: pointerSupport ? 'pointerdown' :
            touchSupport ? 'touchstart' : 'mousedown',
        pointermove: pointerSupport ? 'pointermove' :
            touchSupport ? 'touchmove' : 'mousemove',
        pointerup: pointerSupport ? 'pointerup' :
            touchSupport ? 'touchend' : 'mouseup',
        pointercancel: pointerSupport ? 'pointercancel' : 'touchcancel',
        pointerstop: pointerSupport ? 'pointerup pointercancel' :
            touchSupport ? 'touchend touchcancel' : 'mouseup'
    };
    const customEvents = {
        scroll: makeScrollEvents,
        tap: makeTapEvent,
        clickOutside: makeClickOutsideEvent,
        key: makeKeyEvent,
        mousedown: makeMouseEvent.bind(undefined, 'mousedown'),
        mousemove: makeMouseEvent.bind(undefined, 'mousemove'),
        mouseup: makeMouseEvent.bind(undefined, 'mouseup'),
        pointerenter: makePointerPositionEvents,
        pointerleave: makePointerPositionEvents,
        enterViewport: makeIntersectionEvents,
        exitViewport: makeIntersectionEvents,
        resize: makeResizeEvents
    };
    function bindEvent($el, event, fn, options) {
        if (event in customEvents) {
            customEvents[event]($el, false);
        }
        else if (event in aliases) {
            const events = words(aliases[event]);
            // Note that the mouse event aliases don't pass through makeMouseEvent()!
            for (const e of events)
                $el._el.addEventListener(e, fn, options);
        }
        else {
            $el._el.addEventListener(event, fn, options);
        }
    }
    function unbindEvent($el, event, fn) {
        if (event in customEvents) {
            if (!$el._events[event] || !$el._events[event].length) {
                // Remove custom events only when there are no more listeners.
                customEvents[event]($el, true);
            }
        }
        else if (fn && event in aliases) {
            const events = words(aliases[event]);
            for (const e of events)
                $el._el.removeEventListener(e, fn);
        }
        else if (fn) {
            $el._el.removeEventListener(event, fn);
        }
    }

    // =============================================================================
    // -----------------------------------------------------------------------------
    // Utility Functions
    /** Draws an arc from a to c, with center b. */
    function drawArc(a, b, c) {
        const orient = b.x * (c.y - a.y) + a.x * (b.y - c.y) + c.x * (a.y - b.y);
        const sweep = (orient > 0) ? 1 : 0;
        const size = Point.distance(b, a);
        return [a.x, a.y + 'A' + size, size, 0, sweep, 1, c.x, c.y].join(',');
    }
    function angleSize(angle, options = {}) {
        if (angle.isRight && !options.round)
            return 20;
        return 24 + 20 * (1 - clamp(angle.rad, 0, Math.PI) / Math.PI);
    }
    function drawAngle(angle, options = {}) {
        let a = angle.a;
        const b = angle.b;
        let c = angle.c;
        const size = options.size || angleSize(angle, options);
        const ba = Point.difference(a, b).unitVector;
        const bc = Point.difference(c, b).unitVector;
        a = Point.sum(b, ba.scale(size));
        c = Point.sum(b, bc.scale(size));
        let p = options.fill ? `M${b.x},${b.y}L` : 'M';
        if (angle.isRight && !options.round) {
            const d = Point.sum(a, bc.scale(size));
            p += `${a.x},${a.y}L${d.x},${d.y}L${c.x},${c.y}`;
        }
        else {
            p += drawArc(a, b, c);
        }
        if (options.fill)
            p += 'Z';
        return p;
    }
    function drawPath(...points) {
        return 'M' + points.map(p => p.x + ',' + p.y).join('L');
    }
    // -----------------------------------------------------------------------------
    // Arrows and Line Marks
    function drawLineMark(x, type) {
        const p = x.perpendicularVector.scale(6);
        const n = x.unitVector.scale(3);
        const m = x.midpoint;
        switch (type) {
            case 'bar':
                return drawPath(m.add(p), m.add(p.inverse));
            case 'bar2':
                return drawPath(m.add(n).add(p), m.add(n).add(p.inverse)) +
                    drawPath(m.add(n.inverse).add(p), m.add(n.inverse).add(p.inverse));
            case 'arrow':
                return drawPath(m.add(n.inverse).add(p), m.add(n), m.add(n.inverse).add(p.inverse));
            case 'arrow2':
                return drawPath(m.add(n.scale(-2)).add(p), m, m.add(n.scale(-2)).add(p.inverse)) +
                    drawPath(m.add(p), m.add(n.scale(2)), m.add(p.inverse));
            default:
                return '';
        }
    }
    function arrowPath(start, normal) {
        if (!start || !normal)
            return '';
        const perp = normal.perpendicular;
        const a = start.add(normal.scale(9)).add(perp.scale(9));
        const b = start.add(normal.scale(9)).add(perp.scale(-9));
        return drawPath(a, start, b);
    }
    function drawLineArrows(x, type) {
        let path = '';
        if (isOneOf(type, 'start', 'both')) {
            path += arrowPath(x.p1, x.unitVector);
        }
        if (isOneOf(type, 'end', 'both')) {
            path += arrowPath(x.p2, x.unitVector.inverse);
        }
        return path;
    }
    function drawArcArrows(x, type) {
        let path = '';
        if (isOneOf(type, 'start', 'both')) {
            const normal = new Line(x.c, x.start).perpendicularVector.inverse;
            path += arrowPath(x.start, normal);
        }
        if (isOneOf(type, 'end', 'both')) {
            const normal = new Line(x.c, x.end).perpendicularVector;
            path += arrowPath(x.end, normal);
        }
        return path;
    }
    // -----------------------------------------------------------------------------
    // Draw Function
    function drawSVG(obj, options = {}) {
        if (obj.type === 'angle') {
            obj = obj;
            return drawAngle(obj, options);
        }
        if (obj.type === 'segment') {
            obj = obj;
            if (obj.p1.equals(obj.p2))
                return '';
            let line = drawPath(obj.p1, obj.p2);
            if (options.mark)
                line += drawLineMark(obj, options.mark);
            if (options.arrows)
                line += drawLineArrows(obj, options.arrows);
            return line;
        }
        if (obj.type === 'ray') {
            obj = obj;
            if (!options.box)
                return '';
            const end = intersections(obj, options.box)[0];
            return end ? drawPath(obj.p1, end) : '';
        }
        if (obj.type === 'line') {
            obj = obj;
            if (!options.box)
                return '';
            const points = intersections(obj, options.box);
            if (points.length < 2)
                return '';
            let line = drawPath(points[0], points[1]);
            if (options.mark)
                line += drawLineMark(obj, options.mark);
            return line;
        }
        if (obj.type === 'circle') {
            obj = obj;
            return `M ${obj.c.x - obj.r} ${obj.c.y} a ${obj.r},${obj.r} 0 1 0 ` +
                `${2 * obj.r} 0 a ${obj.r} ${obj.r} 0 1 0 ${-2 * obj.r} 0`;
        }
        if (obj.type === 'arc') {
            obj = obj;
            let path = 'M' + drawArc(obj.start, obj.c, obj.end);
            if (options.arrows)
                path += drawArcArrows(obj, options.arrows);
            return path;
        }
        if (obj.type === 'sector') {
            obj = obj;
            return `M ${obj.c.x} ${obj.c.y} L ${drawArc(obj.start, obj.c, obj.end)} Z`;
        }
        if (obj.type === 'polyline') {
            obj = obj;
            return drawPath(...obj.points);
        }
        if (obj.type === 'polygon' || obj.type === 'triangle') {
            obj = obj;
            return drawPath(...obj.points) + 'Z';
        }
        if (obj.type === 'rectangle') {
            obj = obj;
            return drawPath(...obj.polygon.points) + 'Z';
        }
        return '';
    }
    // -----------------------------------------------------------------------------
    // Parsing
    const ITEM_SIZE = { C: 6, S: 4, Q: 4, A: 7 };
    const SEGMENTS = /[MmLlCcSsQqTtAa][0-9,.\-\s]+/g;
    const NUMBERS = /-?([0-9]*\.)?[0-9]+/g;
    function parsePath(d) {
        if (!d)
            return [];
        const segments = d.match(SEGMENTS) || [];
        const points = [];
        for (const s of segments) {
            // Space before - sign is not required!
            const items = (s.slice(1).match(NUMBERS) || []).map(x => +x);
            const type = s[0].toUpperCase();
            const isRelative = (type !== s[0]);
            const itemLength = ITEM_SIZE[type] || 2;
            for (let i = 0; i < items.length; i += itemLength) {
                const x = items[i + itemLength - 2];
                const y = items[i + itemLength - 1];
                points.push(isRelative ? last(points).shift(x, y) : new Point(x, y));
            }
        }
        return points;
    }

    // =============================================================================
    // Boost.js | Canvas Drawing
    // (c) Mathigon
    // =============================================================================
    function drawCanvas(ctx, obj, options = {}) {
        if (options.fill)
            ctx.fillStyle = options.fill;
        if (options.opacity)
            ctx.globalAlpha = options.opacity;
        if (options.stroke) {
            ctx.strokeStyle = options.stroke;
            ctx.lineWidth = options.strokeWidth || 1;
            if (options.lineCap)
                ctx.lineCap = options.lineCap;
            if (options.lineJoin)
                ctx.lineJoin = options.lineJoin;
        }
        ctx.beginPath();
        if (obj.type === 'segment') {
            obj = obj;
            ctx.moveTo(obj.p1.x, obj.p1.y);
            ctx.lineTo(obj.p2.x, obj.p2.y);
        }
        else if (obj.type === 'circle') {
            obj = obj;
            ctx.arc(obj.c.x, obj.c.y, obj.r, 0, 2 * Math.PI);
        }
        else if (obj.type === 'polygon' || obj.type === 'triangle') {
            obj = obj;
            ctx.moveTo(obj.points[0].x, obj.points[0].y);
            for (const p of obj.points.slice(1))
                ctx.lineTo(p.x, p.y);
            ctx.closePath();
        }
        else if (obj.type === 'polyline') {
            obj = obj;
            ctx.moveTo(obj.points[0].x, obj.points[0].y);
            for (const p of obj.points.slice(1))
                ctx.lineTo(p.x, p.y);
        }
        // TODO Support for Line, Ray, Arc, Sector, Angle and Rectangle objects
        if (options.fill)
            ctx.fill();
        if (options.stroke)
            ctx.stroke();
    }

    // =============================================================================
    // -----------------------------------------------------------------------------
    // Base Element Class
    class BaseView {
        constructor(_el) {
            this._el = _el;
            this._data = {};
            this._events = {};
            this.type = 'default';
            // Store a reference to this element within the native browser DOM.
            _el._view = this;
        }
        get id() { return this._el.id; }
        get data() { return this._el.dataset; }
        get tagName() {
            return this._el.tagName.toUpperCase();
        }
        equals(el) {
            return this._el === el._el;
        }
        /** Adds one or more space-separated classes to this element. */
        addClass(className) {
            for (const c of words(className))
                this._el.classList.add(c);
        }
        removeClass(className) {
            for (const c of words(className))
                this._el.classList.remove(c);
        }
        hasClass(className) {
            return this._el.classList.contains(className);
        }
        toggleClass(className) {
            return this._el.classList.toggle(className);
        }
        /** Toggles multiple space-separated class names based on a condition. */
        setClass(className, condition) {
            if (condition) {
                this.addClass(className);
            }
            else {
                this.removeClass(className);
            }
        }
        attr(attr) { return this._el.getAttribute(attr) || ''; }
        hasAttr(attr) { return this._el.hasAttribute(attr); }
        setAttr(attr, value) {
            if (value === undefined) {
                this.removeAttr(attr);
            }
            else {
                this._el.setAttribute(attr, value.toString());
            }
        }
        removeAttr(attr) { this._el.removeAttribute(attr); }
        get attributes() {
            // Array.from() converts the NamedNodeMap into an array (for Safari).
            return Array.from(this._el.attributes || []);
        }
        get html() { return this._el.innerHTML || ''; }
        set html(h) { this._el.innerHTML = h; }
        get text() { return this._el.textContent || ''; }
        set text(t) { this._el.textContent = t; }
        // Required because TS doesn't allow getters and setters with different types.
        set textStr(t) { this._el.textContent = '' + t; }
        /** Blurs this DOM element. */
        blur() { this._el.blur(); }
        /** Focuses this DOM element. */
        focus() { this._el.focus(); }
        // -------------------------------------------------------------------------
        // Model Binding
        getParentModel() {
            const parent = this.parent;
            return parent ? (parent.model || parent.getParentModel()) : undefined;
        }
        bindModel(model, recursive = true) {
            var _a;
            if (this.model)
                return; // Prevent duplicate binding.
            this.model = model;
            for (const { name, value } of this.attributes) {
                if (name.startsWith('@')) {
                    const event = name.slice(1);
                    const expr = compile(value);
                    this.removeAttr(name);
                    this.on(event, () => expr(model));
                }
                else if (name === ':show') {
                    const expr = compile(value);
                    this.removeAttr(name);
                    model.watch(() => this.toggle(!!expr(model)));
                }
                else if (name === ':html') {
                    const expr = compile(value);
                    this.removeAttr(name);
                    model.watch(() => this.html = expr(model) || '');
                }
                else if (name === ':draw') {
                    const expr = compile(value);
                    model.watch(() => this.draw(expr(model)));
                }
                else if (name === ':bind') {
                    this.bindVariable(model, value);
                }
                else if (name.startsWith(':')) {
                    const expr = compile(value);
                    const attr = name.slice(1);
                    this.removeAttr(name);
                    model.watch(() => this.setAttr(attr, expr(model)));
                }
                else if (value.includes('${')) {
                    const expr = compileString(value);
                    model.watch(() => this.setAttr(name, expr(model) || ''));
                }
            }
            for (const $c of this.childNodes) {
                if ($c instanceof Text) {
                    if ((_a = $c.textContent) === null || _a === void 0 ? void 0 : _a.includes('${')) {
                        const expr = compileString($c.textContent);
                        model.watch(() => $c.textContent = expr(model) || '');
                    }
                }
                else if (recursive) {
                    $c.bindModel(model);
                }
            }
        }
        bindVariable(model, name) {
            // Can be implemented by child classes.
        }
        // -------------------------------------------------------------------------
        // Scrolling and Dimensions
        get bounds() { return this._el.getBoundingClientRect(); }
        /** Checks if this element is currently visible in the viewport. */
        get isInViewport() {
            if (this.height === 0)
                return false;
            const bounds = this.bounds;
            return isBetween(bounds.top, -bounds.height, Browser.height);
        }
        get topLeftPosition() {
            const bounds = this.bounds;
            return new Point(bounds.left, bounds.top);
        }
        get boxCenter() {
            const box = this.bounds;
            return new Point(box.left + box.width / 2, box.top + box.height / 2);
        }
        get scrollWidth() { return this._el.scrollWidth; }
        get scrollHeight() { return this._el.scrollHeight; }
        get scrollTop() { return this._el.scrollTop; }
        get scrollLeft() { return this._el.scrollLeft; }
        set scrollTop(y) {
            this._el.scrollTop = y;
            this.trigger('scroll', { top: y, left: this.scrollLeft });
        }
        set scrollLeft(x) {
            this._el.scrollLeft = x;
            this.trigger('scroll', { top: this.scrollTop, left: x });
        }
        /** Scrolls the element to a specific position. */
        scrollTo(pos, time = 1000, easing = 'cubic') {
            if (pos < 0)
                pos = 0;
            const startPosition = this.scrollTop;
            const distance = pos - startPosition;
            if (this._data['scrollAnimation'])
                this._data['scrollAnimation'].cancel();
            // TODO Also cancel animation after manual scroll events.
            this._data['scrollAnimation'] = animate(t => {
                const y = startPosition + distance * ease(easing, t);
                this.scrollTop = y;
                this.trigger('scroll', { top: y });
            }, time);
        }
        /** Scrolls the element by a given distance. */
        scrollBy(distance, time = 1000, easing = 'cubic') {
            if (!distance)
                return;
            this.scrollTo(this.scrollTop + distance, time, easing);
        }
        // -------------------------------------------------------------------------
        // Styles
        /**
         * Retrieves or sets CSS properties on this element. Examples:
         *   * $el.css('color');  // returns 'red'
         *   * $el.css('color', 'blue');
         *   * $el.css({color: 'blue'});
         */
        css(props, value) {
            if (value === undefined) {
                if (typeof props === 'string') {
                    return window.getComputedStyle(this._el).getPropertyValue(props);
                }
                else {
                    const keys = Object.keys(props);
                    for (const p of keys)
                        this._el.style.setProperty(p, '' + props[p]);
                }
            }
            else if (typeof props === 'string') {
                this._el.style.setProperty(props, '' + value);
            }
        }
        /** Shortcut for getting the CSS transform style of an element. */
        get transform() {
            return this.css('transform').replace('none', '');
        }
        get transformMatrix() {
            const transform = this.transform;
            if (!transform)
                return [[1, 0, 0], [0, 1, 0]];
            const coords = transform.match(/matrix\(([0-9,.\s\-]*)\)/);
            if (!coords || !coords[1])
                return [[1, 0, 0], [0, 1, 0]];
            const matrix = coords[1].split(',');
            return [[+matrix[0], +matrix[2], +matrix[4]],
                [+matrix[1], +matrix[3], +matrix[5]]];
        }
        /** Finds the x and y scale of this element. */
        get scale() {
            const matrix = this.transformMatrix;
            return [matrix[0][0], matrix[1][1]];
        }
        /** Sets the CSS transform on this element. */
        setTransform(posn, angle = 0, scale = 1) {
            let t = '';
            if (posn)
                t +=
                    `translate(${roundTo(posn.x, 0.1)}px,${roundTo(posn.y, 0.1)}px)`;
            if (angle)
                t += ` rotate(${angle}rad)`;
            if (scale)
                t += ` scale(${scale})`;
            this._el.style.transform = t;
        }
        /** Sets the CSS transform of this element to an x/y translation. */
        translate(x, y) {
            this.setTransform(new Point(x, y));
        }
        /**
         * Makes the element visible. Use the `data-display` attribute to determine
         * how this is done. Possible options are `visibility`, to use CSS visibility,
         * or CSS display values. The default is `display: block`.
         */
        show() {
            if (this.hasAttr('hidden'))
                this.removeAttr('hidden');
            if (this.data['display'] === 'visibility') {
                this._el.style.visibility = 'visible';
            }
            else {
                this._el.style.display = this.data.display || 'block';
            }
        }
        /**
         * Makes the element invisible, using CSS visibility (if
         * `data-display="visibility"`), or `display: none`.
         */
        hide() {
            if (this.data['display'] === 'visibility') {
                this._el.style.visibility = 'hidden';
            }
            else {
                this._el.style.display = 'none';
            }
        }
        /** Hides or shows the element based on a boolean value. */
        toggle(show) {
            if (show) {
                this.show();
            }
            else {
                this.hide();
            }
        }
        // -------------------------------------------------------------------------
        // DOM Manipulation
        /** Checks if an element matches a given CSS selector. */
        is(selector) {
            if (this._el.matches)
                return this._el.matches(selector);
            return Array.from(document.querySelectorAll(selector)).includes(this._el);
        }
        /** Finds the index of an elements, in the list of its siblings. */
        index() {
            let i = 0;
            let child = this._el;
            while ((child = (child.previousSibling || undefined)) !== undefined)
                ++i;
            return i;
        }
        /** Adds a new child element at the beginning of this one. */
        prepend(newChild) {
            const children = this._el.childNodes;
            if (children.length) {
                this._el.insertBefore(newChild._el, children[0]);
            }
            else {
                this._el.appendChild(newChild._el);
            }
        }
        /** Adds a new child element at the end of this one. */
        append(newChild) {
            this._el.appendChild(newChild instanceof Text ? newChild : newChild._el);
        }
        /** Adds a new element immediately before this one, as a sibling. */
        insertBefore(newChild) {
            this.parent._el.insertBefore(newChild._el, this._el);
        }
        /** Adds a new element immediately after this one, as a sibling. */
        insertAfter(newChild) {
            const next = this._el.nextSibling;
            if (next) {
                this.parent._el.insertBefore(newChild._el, next);
            }
            else {
                this.parent._el.appendChild(newChild._el);
            }
        }
        /** Returns this element's next sibling, or undefined. */
        get next() {
            return $(this._el.nextSibling);
        }
        /** Returns this element's previous sibling, or undefined. */
        get prev() {
            return $(this._el.previousSibling);
        }
        /** The first child element matching a given selector. */
        $(selector) { return $(selector, this); }
        /** All child elements matching a given selector. */
        $$(selector) { return $$(selector, this); }
        /** Returns this element's parent, or undefined. */
        get parent() {
            // Note: parentNode breaks on document.matches.
            return $(this._el.parentElement || undefined);
        }
        /** Finds all parent elements that match a specific selector. */
        parents(selector) {
            const result = [];
            let parent = this.parent;
            while (parent) {
                if (!selector || parent.is(selector))
                    result.push(parent);
                parent = parent.parent;
            }
            return result;
        }
        /** Checks if this element has one of the given elements as parent. */
        hasParent(...$p) {
            const tests = $p.map(p => p._el);
            let parent = this._el.parentNode;
            while (parent) {
                if (isOneOf(parent, ...tests))
                    return true;
                parent = parent.parentNode;
            }
            return false;
        }
        /** Returns an array of all children of this element. */
        get children() {
            return Array.from(this._el.children || [], n => $(n));
        }
        /** Returns an array of all child nodes, including text nodes. */
        get childNodes() {
            return Array.from(this._el.childNodes, (node) => {
                return node instanceof Text ? node : $(node);
            });
        }
        /** Removes this element. */
        remove() {
            if (this._el && this._el.parentNode) {
                this._el.parentNode.removeChild(this._el);
            }
            // TODO More cleanup: remove event listeners, clean children, etc.
            // this._el = this._data = this._events = undefined;
        }
        /** Removes all children of this element. */
        removeChildren() {
            while (this._el.firstChild)
                this._el.removeChild(this._el.firstChild);
        }
        // -------------------------------------------------------------------------
        // Events
        /** Binds one ore more space-separated event listeners on this element. */
        on(events, callback, options) {
            for (const e of words(events)) {
                if (e in this._events) {
                    if (!this._events[e].includes(callback))
                        this._events[e].push(callback);
                }
                else {
                    this._events[e] = [callback];
                }
                bindEvent(this, e, callback, options);
            }
        }
        /** Binds a one-time event listener on this element. */
        one(events, callback, options) {
            const callbackWrap = (e) => {
                this.off(events, callbackWrap);
                callback(e);
            };
            this.on(events, callbackWrap, options);
        }
        /**
         * Removes an event listener on this element. If callback is undefined, it
         * removes all event listeners for this event.
         */
        off(events, callback) {
            for (const e of words(events)) {
                if (e in this._events) {
                    this._events[e] = callback ? this._events[e].filter(fn => fn !== callback) : [];
                }
                unbindEvent(this, e, callback);
            }
        }
        /** Triggers a specific event on this element. */
        trigger(events, args = {}) {
            for (const e of words(events)) {
                if (!this._events[e])
                    return;
                for (const fn of this._events[e])
                    fn.call(this, args);
            }
        }
        /**
         * Binds an event listener for a specific key that is pressed while this
         * element is in focus.
         */
        onKeyDown(keys, callback) {
            const keylist = words(keys).map(k => KEY_CODES[k] || k);
            this._el.addEventListener('keydown', (e) => {
                if (keylist.indexOf(e.keyCode) >= 0)
                    callback(e);
            });
        }
        /** Returns a promise that is resolved when an event is triggered. */
        onPromise(event, resolveImmediately = false) {
            if (resolveImmediately)
                return Promise.resolve();
            return new Promise((resolve) => this.one('solve', () => resolve()));
        }
        // -------------------------------------------------------------------------
        // Animations
        /**
         * Animates multiple CSS properties of this element, with a given duration,
         * delay and ease function.
         */
        animate(rules, duration = 400, delay = 0, easing = 'ease-in-out') {
            return transition(this, rules, duration, delay, easing);
        }
        /**
         * Runs an enter animation on this element. Valid effect names are
         *   * 'fade', 'pop' and 'descend'
         *   * 'draw' and 'draw-reverse'
         *   * 'slide' and 'slide-down'
         *   * 'reveal', 'reveal-left' and 'reveal-right'
         */
        enter(effect = 'fade', duration = 500, delay = 0) {
            return enter(this, effect, duration, delay);
        }
        /**
         * Runs an exit animation on this element. See `.enter()` for options.
         */
        exit(effect = 'fade', duration = 500, delay = 0, remove = false) {
            return exit(this, effect, duration, delay, remove);
        }
        /**
         * Triggers a CSS animation in an element by adding a class and removing it
         * after the `animationEnd` event.
         */
        effect(className) {
            this.one('animationend', () => this.removeClass('effects-' + className));
            this.addClass('effects-' + className);
        }
        // -------------------------------------------------------------------------
        // Utilities
        /**
         * Creates a copy of this element.
         * @param {boolean=} recursive
         * @param {boolean=} withStyles Whether to inline all styles.
         * @returns {Element}
         */
        copy(recursive = true, withStyles = true) {
            const $copy = $(this._el.cloneNode(recursive));
            if (withStyles)
                $copy.copyInlineStyles(this, recursive);
            return $copy;
        }
        copyInlineStyles($source, recursive = true) {
            const style = window.getComputedStyle($source._el);
            for (const s of Array.from(style))
                this.css(s, style.getPropertyValue(s));
            if (recursive) {
                const children = this.children;
                const sourceChildren = $source.children;
                for (let i = 0; i < children.length; ++i) {
                    children[i].copyInlineStyles(sourceChildren[i], true);
                }
            }
        }
    }
    // -----------------------------------------------------------------------------
    // HTML Elements
    class HTMLBaseView extends BaseView {
        get offsetTop() { return this._el.offsetTop; }
        get offsetLeft() { return this._el.offsetLeft; }
        get offsetParent() { return $(this._el.offsetParent || undefined); }
        /** Returns this element's width, including border and padding. */
        get width() { return this._el.offsetWidth; }
        /** Returns this element's height, including border and padding. */
        get height() { return this._el.offsetHeight; }
        /** Returns this element's width, excluding border and padding. */
        get innerWidth() {
            const left = parseFloat(this.css('padding-left'));
            const right = parseFloat(this.css('padding-right'));
            return this._el.clientWidth - left - right;
        }
        /** Returns this element's height, excluding border and padding. */
        get innerHeight() {
            const bottom = parseFloat(this.css('padding-bottom'));
            const top = parseFloat(this.css('padding-top'));
            return this._el.clientHeight - bottom - top;
        }
        /** Returns this element's width, including margins. */
        get outerWidth() {
            const left = parseFloat(this.css('margin-left'));
            const right = parseFloat(this.css('margin-right'));
            return (this.width + left + right) || 0;
        }
        /** Returns this element's height, including margins. */
        get outerHeight() {
            const bottom = parseFloat(this.css('margin-bottom'));
            const top = parseFloat(this.css('margin-top'));
            return (this.height + bottom + top) || 0;
        }
        /** @returns {number} */
        get positionTop() {
            let el = this._el;
            let offset = 0;
            while (el) {
                offset += el.offsetTop;
                el = el.offsetParent;
            }
            return offset;
        }
        /** @returns {number} */
        get positionLeft() {
            let el = this._el;
            let offset = 0;
            while (el) {
                offset += el.offsetLeft;
                el = el.offsetParent;
            }
            return offset;
        }
        /** Calculates the element offset relative to any other parent element. */
        offset(parent) {
            if (parent._el === this._el.offsetParent) {
                // Get offset from immediate parent
                const top = this.offsetTop + parent._el.clientTop;
                const left = this.offsetLeft + parent._el.clientLeft;
                const bottom = top + this.height;
                const right = left + this.width;
                return { top, left, bottom, right };
            }
            else {
                // Get offset based on any other element
                const parentBox = parent._el.getBoundingClientRect();
                const box = this._el.getBoundingClientRect();
                return {
                    top: box.top - parentBox.top, left: box.left - parentBox.left,
                    bottom: box.bottom - parentBox.top, right: box.right - parentBox.left
                };
            }
        }
    }
    // -----------------------------------------------------------------------------
    // SVG Elements
    class SVGBaseView extends BaseView {
        constructor() {
            super(...arguments);
            this.type = 'svg';
        }
        /** Returns the owner `<svg>` which this element is a child of. */
        get $ownerSVG() {
            return $(this._el.ownerSVGElement || undefined);
        }
        // See https://www.chromestatus.com/features/5724912467574784
        get width() { return this.bounds.width; }
        get height() { return this.bounds.height; }
        // SVG Elements don't have offset properties. We instead use the position of
        // the first non-SVG parent, plus the margin of the SVG owner, plus the SVG
        // position of the individual element. This doesn't work for absolutely
        // positioned SVG elements, and some other edge cases.
        get positionLeft() {
            const svgLeft = this._el.getBBox().x + this._el.getCTM().e;
            return this.$ownerSVG.positionLeft + svgLeft;
        }
        get positionTop() {
            const svgTop = this._el.getBBox().y + this._el.getCTM().f;
            return this.$ownerSVG.positionTop + svgTop;
        }
        get inverseTransformMatrix() {
            const m = this._el.getScreenCTM().inverse();
            const matrix = [[m.a, m.c, m.e], [m.b, m.d, m.f]];
            // Firefox doesn't account for the CSS transform of parent elements.
            // TODO Use matrix product of all parent's transforms, not just the
            // translation of the immediate parent.
            if (Browser.isFirefox) {
                const transform = this.transformMatrix;
                matrix[0][2] -= transform[0][2];
                matrix[1][2] -= transform[1][2];
            }
            return matrix;
        }
        setTransform(posn, angle = 0, scale = 1) {
            const t1 = posn ?
                `translate(${roundTo(posn.x, 0.1)} ${roundTo(posn.y, 0.1)})` :
                '';
            const t2 = nearlyEquals(angle, 0) ? '' : `rotate(${angle * 180 / Math.PI})`;
            const t3 = nearlyEquals(scale, 1) ? '' : `scale(${scale})`;
            this.setAttr('transform', [t1, t2, t3].join(' '));
        }
        /**
         * Finds the total stroke length of this element. Similar to the SVG
         * `getTotalLength()` function, but works for a wider variety of elements.
         */
        get strokeLength() {
            if (this._el instanceof SVGGeometryElement) {
                return this._el.getTotalLength();
            }
            else {
                const dim = this.bounds;
                return 2 * dim.height + 2 * dim.width;
            }
        }
        /**
         * Gets the coordinates of the point at a distance `d` along the length of the
         * stroke of this `<path>` element.
         */
        getPointAtLength(d) {
            if (this._el instanceof SVGGeometryElement) {
                const point = this._el.getPointAtLength(d);
                return new Point(point.x, point.y);
            }
            else {
                return new Point(0, 0);
            }
        }
        /**
         * Gets the coordinates of the point at a position `p` along the length of the
         * stroke of this `<path>` element, where `0 ≤ p ≤ 1`.
         */
        getPointAt(p) {
            return this.getPointAtLength(p * this.strokeLength);
        }
        /** Returns a list of all points along an SVG `<path>` element. */
        get points() {
            return parsePath(this.attr('d'));
        }
        /** Sets the list of points for an SVG `<path>` element.c*/
        set points(p) {
            const d = p.length ? 'M' + p.map(x => x.x + ',' + x.y).join('L') : '';
            this.setAttr('d', d);
        }
        /** Appends a new point to an SVG `<path>` element. */
        addPoint(p) {
            const d = this.attr('d') + ' L ' + p.x + ',' + p.y;
            this.setAttr('d', d);
        }
        /** Finds the center of an SVG `<circle>` element. */
        get center() {
            const x = +this.attr(this.tagName === 'TEXT' ? 'x' : 'cx');
            const y = +this.attr(this.tagName === 'TEXT' ? 'y' : 'cy');
            return new Point(x, y);
        }
        /** Sets the center of an SVG `<circle>` or `<text>` element. */
        setCenter(c) {
            this.setAttr(this.tagName === 'TEXT' ? 'x' : 'cx', c.x);
            this.setAttr(this.tagName === 'TEXT' ? 'y' : 'cy', c.y);
        }
        /** Sets the end points of an SVG `<line>` element. */
        setLine(p, q) {
            this.setAttr('x1', p.x);
            this.setAttr('y1', p.y);
            this.setAttr('x2', q.x);
            this.setAttr('y2', q.y);
        }
        /** Sets the bounds of an SVG `<rectangle>` element. */
        setRect(rect) {
            this.setAttr('x', rect.p.x);
            this.setAttr('y', rect.p.y);
            this.setAttr('width', rect.w);
            this.setAttr('height', rect.h);
        }
        /** Draws a generic geometry object onto an SVG `<path>` element. */
        draw(obj, options = {}) {
            if (!obj)
                return this.setAttr('d', '');
            const attributes = {
                mark: this.attr('mark'),
                arrows: this.attr('arrows'),
                size: (+this.attr('size')) || undefined,
                fill: this.hasClass('fill'),
                round: this.hasAttr('round')
            };
            this.setAttr('d', drawSVG(obj, applyDefaults(options, attributes)));
        }
    }
    class SVGParentView extends SVGBaseView {
        /** Returns the viewport coordinates of this `<svg>` element. */
        get viewBox() {
            return this._el.viewBox.baseVal || { width: 0, height: 0 };
        }
        get $ownerSVG() {
            return this;
        }
        get positionLeft() {
            return parseInt(this.css('margin-left')) + this.parent.positionLeft;
        }
        get positionTop() {
            return parseInt(this.css('margin-top')) + this.parent.positionTop;
        }
        /** Returns the intrinsic width of this `<svg>` element. */
        get svgWidth() {
            return this.viewBox.width || this.width;
        }
        /** Returns the intrinsic height of this `<svg>` element. */
        get svgHeight() {
            return this.viewBox.height || this.height;
        }
        /** Converts an SVG element into a PNG data URI. */
        pngImage(size) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const $copy = this.copy(true, true);
                const width = size || this.svgWidth;
                const height = size || this.svgHeight;
                $copy.setAttr('width', width);
                $copy.setAttr('height', height);
                const data = new XMLSerializer().serializeToString($copy._el);
                let url = 'data:image/svg+xml;utf8,' + encodeURIComponent(data);
                url = url.replace('svg ', 'svg xmlns="http://www.w3.org/2000/svg" ');
                // const svgBlob = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
                // const url = window.URL.createObjectURL(svgBlob);
                const $canvas = $N('canvas', { width, height });
                $canvas.ctx.fillStyle = '#fff';
                $canvas.ctx.fillRect(0, 0, width, height);
                const image = yield loadImage(url);
                $canvas.ctx.drawImage(image, 0, 0, width, height);
                return $canvas.pngImage;
                // window.URL.revokeObjectURL(url);
            });
        }
        downloadImage(fileName, size) {
            // iOS Doesn't allow navigation calls within an async event.
            const windowRef = Browser.isIOS ? window.open('', '_blank') : undefined;
            this.pngImage(size).then((href) => {
                if (windowRef)
                    return windowRef.location.href = href;
                const $a = $N('a', { download: fileName, href, target: '_blank' });
                $a._el.dispatchEvent(new MouseEvent('click', { view: window, bubbles: false, cancelable: true }));
            });
        }
    }
    // -----------------------------------------------------------------------------
    // Window Element (<html> and <body>)
    class WindowView extends HTMLBaseView {
        constructor() {
            super(...arguments);
            this.type = 'window';
        }
        get width() { return window.innerWidth; }
        get height() { return window.innerHeight; }
        get innerWidth() { return window.innerWidth; }
        get innerHeight() { return window.innerHeight; }
        get outerWidth() { return window.outerWidth; }
        get outerHeight() { return window.outerHeight; }
        get scrollWidth() { return document.body.scrollWidth; }
        get scrollHeight() { return document.body.scrollHeight; }
        get scrollTop() { return window.pageYOffset; }
        get scrollLeft() { return window.pageXOffset; }
        set scrollTop(y) {
            document.body.scrollTop = document.documentElement.scrollTop = y;
            this.trigger('scroll', { top: y, left: this.scrollLeft });
        }
        set scrollLeft(x) {
            document.body.scrollLeft = document.documentElement.scrollLeft = x;
            this.trigger('scroll', { top: this.scrollTop, left: x });
        }
    }
    class FormView extends HTMLBaseView {
        constructor() {
            super(...arguments);
            this.type = 'form';
        }
        get action() { return this._el.action; }
        /** Summarises the data for an HTML <form> element in an JSON Object. */
        get formData() {
            const data = {};
            for (const el of Array.from(this._el.elements)) {
                const id = el.name || el.id;
                if (id)
                    data[id] = el.value;
            }
            return data;
        }
        get isValid() {
            return this._el.checkValidity();
        }
    }
    class InputView extends HTMLBaseView {
        constructor() {
            super(...arguments);
            this.type = 'input';
        }
        get checked() {
            return this._el instanceof HTMLInputElement ? this._el.checked : false;
        }
        get value() { return this._el.value; }
        set value(v) { this._el.value = v; }
        bindVariable(model, name) {
            model[name] = this.value;
            this.change((v) => model[name] = v);
            model.watch(() => this.value = model[name]);
        }
        /** Binds a change event listener. */
        change(callback) {
            let value = '';
            this.on('change keyup input paste', () => {
                if (this.value === value)
                    return;
                value = this.value.trim();
                callback(value);
            });
        }
        validate(callback) {
            this.change(value => this.setValidity(callback(value)));
        }
        setValidity(str) {
            this._el.setCustomValidity(str);
        }
        get isValid() {
            return this._el.checkValidity();
        }
    }
    // -----------------------------------------------------------------------------
    // Canvas Elements (<canvas>)
    class CanvasView extends HTMLBaseView {
        constructor() {
            super(...arguments);
            this.type = 'canvas';
        }
        /** Returns the drawing context for a `<canvas>` element. */
        getContext(c = '2d', options = {}) {
            return this._el.getContext(c, options);
        }
        /** Converts an Canvas element into a PNG data URI. */
        get pngImage() {
            return this._el.toDataURL('image/png');
        }
        /** Returns the intrinsic pixel width of this `<canvas>` element. */
        get canvasWidth() {
            return this._el.width;
        }
        /** Returns the intrinsic pixel height of this `<canvas>` element. */
        get canvasHeight() {
            return this._el.height;
        }
        /** Cached reference to the 2D context for this `<canvas>` element. */
        get ctx() {
            if (!this._ctx)
                this._ctx = this.getContext();
            return this._ctx;
        }
        /** Draws a generic geometry object ont a `<canvas>` element. */
        draw(obj, options = {}) {
            this.ctx.save();
            drawCanvas(this.ctx, obj, options);
            this.ctx.restore();
        }
        /** Clears this canvas. */
        clear() {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
        /** Clears this canvas. */
        fill(color) {
            this.ctx.save();
            this.ctx.fillStyle = color;
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.ctx.restore();
        }
        /** Erase a specific circle of the canvas. */
        clearCircle(center, radius) {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.beginPath();
            this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.restore();
        }
        downloadImage(fileName) {
            const href = this.pngImage;
            const $a = $N('a', { download: fileName, href, target: '_blank' });
            $a._el.dispatchEvent(new MouseEvent('click', { view: window, bubbles: false, cancelable: true }));
        }
    }
    // -----------------------------------------------------------------------------
    // Media Elements (<video> and <audio>)
    class MediaView extends HTMLBaseView {
        /** Starts playback on a media element. */
        play() {
            return this._el.play() || Promise.resolve();
        }
        /** Pauses playback on a media element. */
        pause() {
            return this._el.pause();
        }
    }
    // -----------------------------------------------------------------------------
    // Element Selectors and Constructors
    const SVG_TAGS = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline',
        'g', 'defs', 'marker', 'line', 'text', 'pattern', 'mask', 'svg', 'foreignObject'];
    /**
     * Finds the Element that matches a specific CSS selector, or creates a new
     * Element wrapper around a native HTMLElement instance.
     */
    function $(query, context) {
        if (!query)
            return undefined;
        const c = context ? context._el : document.documentElement;
        const el = (typeof query === 'string') ? c.querySelector(query) : query;
        if (!el)
            return undefined;
        if (el._view)
            return el._view;
        const tagName = (el.tagName || '').toLowerCase();
        if (tagName === 'svg') {
            return new SVGParentView(el);
        }
        else if (tagName === 'canvas') {
            return new CanvasView(el);
        }
        else if (tagName === 'form') {
            return new FormView(el);
        }
        else if (tagName === 'input' || tagName === 'select' || tagName === 'textarea') {
            return new InputView(el);
        }
        else if (tagName === 'video' || tagName === 'audio') {
            return new MediaView(el);
        }
        else if (SVG_TAGS.includes(tagName)) {
            // TODO <mask> and <pattern> are not SVGGraphicsElements.
            return new SVGBaseView(el);
        }
        else {
            return new HTMLBaseView(el);
        }
    }
    /** Finds all elements that match a specific CSS selector. */
    function $$(selector, context) {
        const c = context ? context._el : document.documentElement;
        const els = selector ? c.querySelectorAll(selector) : [];
        return Array.from(els, el => $(el));
    }
    /** Creates a new Element instance from a given set of options. */
    function $N(tag, attributes = {}, parent) {
        const el = !SVG_TAGS.includes(tag) ? document.createElement(tag) :
            document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [key, value] of Object.entries(attributes)) {
            if (value === undefined)
                continue;
            if (key === 'id') {
                el.id = value;
            }
            else if (key === 'html') {
                el.innerHTML = value;
            }
            else if (key === 'text') {
                el.textContent = value;
            }
            else if (key === 'path') {
                el.setAttribute('d', drawSVG(value));
            }
            else {
                el.setAttribute(key, value);
            }
        }
        const $el = $(el);
        if (parent)
            parent.append($el);
        return $el;
    }
    const $body = new WindowView(document.body);
    const $html = new WindowView(document.documentElement);

    // =============================================================================
    const KEY_CODES = {
        backspace: 8,
        tab: 9,
        enter: 13,
        shift: 16,
        ctrl: 17,
        alt: 18,
        pause: 19,
        capslock: 20,
        escape: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        'delete': 46
    };
    // -----------------------------------------------------------------------------
    // Browser Namespace
    var Browser;
    (function (Browser) {
        const ua = window.navigator.userAgent.toLowerCase();
        Browser.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
        Browser.isRetina = ((window.devicePixelRatio || 1) > 1);
        Browser.isTouch = (!!window.Touch) || 'ontouchstart' in window;
        Browser.isChrome = !!window.chrome;
        Browser.isFirefox = ua.indexOf('firefox') >= 0;
        Browser.isAndroid = ua.indexOf('android') >= 0;
        Browser.isIOS = /iphone|ipad|ipod/i.test(ua);
        Browser.isSafari = /^((?!chrome|android).)*safari/i.test(ua);
        /** Forces a re-paint. This is useful when updating transition properties. */
        function redraw() {
            document.body.offsetHeight; /* jshint ignore:line */
        }
        Browser.redraw = redraw;
        // ---------------------------------------------------------------------------
        // Load Events
        const loadQueue = [];
        let loaded = false;
        function afterLoad() {
            if (loaded)
                return;
            loaded = true;
            for (const fn of loadQueue)
                fn();
            setTimeout(resize);
        }
        window.onload = afterLoad;
        document.addEventListener('DOMContentLoaded', afterLoad);
        /** Binds an event listener that is triggered when the page is loaded. */
        function ready(fn) {
            if (loaded) {
                fn();
            }
            else {
                loadQueue.push(fn);
            }
        }
        Browser.ready = ready;
        const resizeCallbacks = [];
        Browser.width = window.innerWidth;
        Browser.height = window.innerHeight;
        const doResize = throttle(() => {
            Browser.width = window.innerWidth;
            Browser.height = window.innerHeight;
            for (const fn of resizeCallbacks)
                fn({ width: Browser.width, height: Browser.height });
            $body.trigger('scroll', { top: $body.scrollTop });
        });
        function onResize(fn) {
            fn({ width: Browser.width, height: Browser.height });
            resizeCallbacks.push(fn);
        }
        Browser.onResize = onResize;
        function offResize(fn) {
            const i = resizeCallbacks.indexOf(fn);
            if (i >= 0)
                resizeCallbacks.splice(i, 1);
        }
        Browser.offResize = offResize;
        function resize() {
            doResize();
        }
        Browser.resize = resize;
        window.addEventListener('resize', () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            if (Browser.width === newWidth && Browser.height === newHeight)
                return;
            Browser.width = newWidth;
            Browser.height = newHeight;
            doResize();
        });
        // ---------------------------------------------------------------------------
        // Location Hash
        /** Returns the hash string of the current window. */
        function getHash() {
            return window.location.hash.slice(1);
        }
        Browser.getHash = getHash;
        /** Set the hash string of the current window. */
        function setHash(h) {
            // Prevent scroll to top when resetting hash.
            const scroll = document.body.scrollTop;
            window.location.hash = h;
            document.body.scrollTop = scroll;
        }
        Browser.setHash = setHash;
        // ---------------------------------------------------------------------------
        // Cookies
        /** Returns a JSON object of all cookies. */
        function getCookies() {
            const pairs = document.cookie.split(';');
            const result = {};
            for (let i = 0, n = pairs.length; i < n; ++i) {
                const pair = pairs[i].split('=');
                pair[0] = pair[0].replace(/^\s+|\s+$/, '');
                result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
            return result;
        }
        Browser.getCookies = getCookies;
        function getCookie(name) {
            const v = document.cookie.match(new RegExp(`(^|;) ?${name}=([^;]*)(;|$)`));
            return v ? v[2] : undefined;
        }
        Browser.getCookie = getCookie;
        function setCookie(name, value, maxAge = 60 * 60 * 24 * 365) {
            // Cookies are also set for all subdomains. Remove locale subdomains.
            const domain = window.location.hostname.replace(/^[a-z]{2}\./, '');
            document.cookie = `${name}=${value};path=/;max-age=${maxAge};domain=${domain}`;
        }
        Browser.setCookie = setCookie;
        function deleteCookie(name) {
            setCookie(name, '', -1);
        }
        Browser.deleteCookie = deleteCookie;
        // ---------------------------------------------------------------------------
        // Local Storage
        const STORAGE_KEY = '_M';
        function setStorage(key, value) {
            const keys = (key || '').split('.');
            const storage = safeToJSON(window.localStorage.getItem(STORAGE_KEY) || undefined);
            let path = storage;
            for (let i = 0; i < keys.length - 1; ++i) {
                if (path[keys[i]] == undefined)
                    path[keys[i]] = {};
                path = path[keys[i]];
            }
            path[keys[keys.length - 1]] = value;
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
        }
        Browser.setStorage = setStorage;
        function getStorage(key) {
            let path = safeToJSON(window.localStorage.getItem(STORAGE_KEY) || undefined);
            if (!key)
                return path;
            const keys = (key || '').split('.');
            const lastKey = keys.pop();
            for (const k of keys) {
                if (!(k in path))
                    return undefined;
                path = path[k];
            }
            return path[lastKey];
        }
        Browser.getStorage = getStorage;
        function deleteStorage(key) {
            if (key) {
                setStorage(key, undefined);
            }
            else {
                window.localStorage.setItem(STORAGE_KEY, '');
            }
        }
        Browser.deleteStorage = deleteStorage;
        // ---------------------------------------------------------------------------
        // Keyboard Event Handling
        /** The current active element on the page (e.g. and `<input>`). */
        function getActiveInput() {
            const active = document.activeElement;
            return active === document.body ? undefined : $(active);
        }
        Browser.getActiveInput = getActiveInput;
        /** Binds an event listener that is fired when a key is pressed. */
        function onKey(keys, fn, up = false) {
            const keyNames = words(keys);
            const keyCodes = keyNames.map(k => KEY_CODES[k] || k);
            const event = up ? 'keyup' : 'keydown';
            document.addEventListener(event, function (e) {
                const $active = getActiveInput();
                if ($active && ($active.is('input, textarea, [contenteditable]') ||
                    $active.hasAttr('tabindex')))
                    return;
                const i = keyCodes.findIndex(k => e.keyCode === k || e.key === k);
                if (i >= 0)
                    fn(e, keyNames[i]);
            });
        }
        Browser.onKey = onKey;
    })(Browser || (Browser = {}));
    // -----------------------------------------------------------------------------
    // Polyfill for external SVG imports
    const IEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/;
    const webkitUA = /\bAppleWebKit\/(\d+)\b/;
    const EdgeUA = /\bEdge\/12\.(\d+)\b/;
    const polyfill = IEUA.test(navigator.userAgent) ||
        +(navigator.userAgent.match(EdgeUA) || [])[1] < 10547 ||
        +(navigator.userAgent.match(webkitUA) || [])[1] < 537;
    const requests = {};
    /** Replaces SVG `<use>` imports that are not supported by older browsers. */
    function replaceSvgImports() {
        if (!polyfill)
            return;
        const uses = Array.from(document.querySelectorAll('svg > use'));
        uses.forEach(function (use) {
            const src = use.getAttribute('xlink:href');
            const [url, id] = src.split('#');
            if (!url.length || !id)
                return;
            const svg = use.parentNode;
            svg.removeChild(use);
            if (!(url in requests))
                requests[url] = fetch(url).then(r => r.text());
            const request = requests[url];
            request.then((response) => {
                const doc = document.implementation.createHTMLDocument('');
                doc.documentElement.innerHTML = response;
                const icon = doc.getElementById(id);
                const clone = icon.cloneNode(true);
                const fragment = document.createDocumentFragment();
                while (clone.childNodes.length)
                    fragment.appendChild(clone.firstChild);
                svg.appendChild(fragment);
            });
        });
    }

    // =============================================================================
    // Prevent animations on page load.
    let isReady = false;
    setTimeout(() => isReady = true);
    const BOUNCE_IN = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    const BOUNCE_OUT = 'cubic-bezier(0.68, -0.275, 0.825, 0.115)';
    const ResolvedAnimation = { cancel: () => { }, promise: Promise.resolve() };
    /**
     * Runs an animation. If no duration is provided, the animation will run
     * indefinitely, and call `callback` with the time since start as first
     * argument. If a duration is provided, the first callback argument is instead
     * the proportion of the duration passed (between 0 and 1). The second callback
     * argument is the time difference since the last animation frame, and the
     * third callback argument is a `cancel()` function to stop the animation.
     */
    function animate(callback, duration) {
        if (duration === 0) {
            callback(1, 0, () => { });
            return ResolvedAnimation;
        }
        const startTime = Date.now();
        const deferred = defer();
        let lastTime = 0;
        let running = true;
        const cancel = () => {
            running = false;
            deferred.reject();
        };
        function getFrame() {
            if (running && (!duration || lastTime <= duration))
                window.requestAnimationFrame(getFrame);
            const time = Date.now() - startTime;
            callback(duration ? Math.min(1, time / duration) : time, time - lastTime, cancel);
            if (duration && time >= duration)
                deferred.resolve();
            lastTime = time;
        }
        getFrame();
        return { cancel, promise: deferred.promise };
    }
    // -----------------------------------------------------------------------------
    // Easing
    function easeIn(type, t = 0, s = 0) {
        switch (type) {
            case 'quad':
                return Math.pow(t, 2);
            case 'cubic':
                return Math.pow(t, 3);
            case 'quart':
                return Math.pow(t, 4);
            case 'quint':
                return Math.pow(t, 5);
            case 'circ':
                return 1 - Math.sqrt(1 - Math.pow(t, 2));
            case 'sine':
                return 1 - Math.cos(t * Math.PI / 2);
            case 'exp':
                return (t <= 0) ? 0 : Math.pow(2, 10 * (t - 1));
            case 'back':
                if (!s)
                    s = 1.70158;
                return t * t * ((s + 1) * t - s);
            case 'elastic':
                if (!s)
                    s = 0.3;
                return -Math.pow(2, 10 * (t - 1)) *
                    Math.sin(((t - 1) * 2 / s - 0.5) * Math.PI);
            case 'swing':
                return 0.5 - Math.cos(t * Math.PI) / 2;
            case 'spring':
                return 1 - (Math.cos(t * 4.5 * Math.PI) * Math.exp(-t * 6));
            case 'bounce':
                if (t < 1 / 11)
                    return 1 / 64 - 7.5625 * (0.5 / 11 - t) * (0.5 / 11 - t); // 121/16 = 7.5625
                if (t < 3 / 11)
                    return 1 / 16 - 7.5625 * (2 / 11 - t) * (2 / 11 - t);
                if (t < 7 / 11)
                    return 1 / 4 - 7.5625 * (5 / 11 - t) * (5 / 11 - t);
                return 1 - 7.5625 * (1 - t) * (1 - t);
            default:
                return t;
        }
    }
    /**
     * Applies an easing function to a number `t` between 0 and 1. Options include
     * `quad`, `cubic`, `quart`, `quint`, `circ`, `sine`, `exp`, `back`, `elastic`,
     * `swing`, `spring` and `bounce`, optionally followed by `-in` or `-out`. The
     * `s` parameter is only used by `back` and `elastic` easing.
     */
    function ease(type, t = 0, s = 0) {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        const [name, direction] = type.split('-');
        if (direction === 'in')
            return easeIn(name, t, s);
        if (direction === 'out')
            return 1 - easeIn(name, 1 - t, s);
        if (t <= 0.5)
            return easeIn(name, 2 * t, s) / 2;
        return 1 - easeIn(name, 2 * (1 - t), s) / 2;
    }
    function transition($el, properties, duration = 400, _delay = 0, easing = 'ease-in-out') {
        // Don't play animations while the page is loading.
        if (!isReady) {
            Object.keys(properties).forEach(k => {
                const p = properties[k];
                $el.css(k, Array.isArray(p) ? p[1] : p);
            });
            return ResolvedAnimation;
        }
        if (easing === 'bounce-in')
            easing = BOUNCE_IN;
        if (easing === 'bounce-out')
            easing = BOUNCE_OUT;
        let oldTransition = '';
        if (Browser.isSafari) {
            oldTransition = $el._el.style.transition;
            $el.css('transition', 'none');
            Browser.redraw();
        }
        // Cancel any previous animations
        const currentAnimation = $el._data['animation'];
        if (currentAnimation)
            currentAnimation.cancel();
        const to = {}, from = {};
        const deferred = defer();
        const style = window.getComputedStyle($el._el);
        Object.keys(properties).forEach((k) => {
            const p = properties[k];
            const k1 = toCamelCase(k);
            from[k1] = Array.isArray(p) ? p[0] : style.getPropertyValue(k);
            to[k1] = Array.isArray(p) ? p[1] : p;
            // Set initial style, for the duration of the delay.
            if (_delay)
                $el.css(k, from[k1]);
        });
        // Special rules for animations to height: auto
        const oldHeight = to.height;
        if (to.height === 'auto') {
            to.height =
                total($el.children.map($c => $c.outerHeight)) + 'px';
        }
        let player;
        let cancelled = false;
        delay(() => {
            if (cancelled)
                return;
            player = $el._el.animate([from, to], { duration, easing, fill: 'forwards' });
            player.onfinish = () => {
                if ($el._el)
                    Object.keys(properties)
                        .forEach(k => $el.css(k, k === 'height' ? oldHeight : to[k]));
                if (Browser.isSafari)
                    $el.css('transition', oldTransition);
                deferred.resolve();
                player.cancel(); // bit ugly, but needed for Safari...
            };
        }, _delay);
        const animation = {
            cancel() {
                cancelled = true;
                if ($el._el)
                    Object.keys(properties).forEach(k => $el.css(k, $el.css(k)));
                if (player)
                    player.cancel();
            },
            promise: deferred.promise
        };
        // Only allow cancelling of animation in next thread.
        setTimeout(() => $el._data['animation'] = animation);
        return animation;
    }
    // -----------------------------------------------------------------------------
    // Element CSS Animations Effects
    // When applying the 'pop' effect, we want to respect all existing transform
    // except scale. To do that, we have to expand the matrix() notation.
    const CSS_MATRIX = /matrix\([0-9.\-\s]+,[0-9.\-\s]+,[0-9.\-\s]+,[0-9.\-\s]+,([0-9.\-\s]+),([0-9.\-\s]+)\)/;
    function enter($el, effect = 'fade', duration = 500, _delay = 0) {
        $el.show();
        if (!isReady)
            return ResolvedAnimation;
        const opacity = (+$el.css('opacity')) || 1;
        if (effect === 'fade') {
            return transition($el, { opacity: [0, opacity] }, duration, _delay);
        }
        else if (effect === 'pop') {
            const transform = $el.transform.replace(/scale\([0-9.]*\)/, '')
                .replace(CSS_MATRIX, 'translate($1px,$2px)');
            // TODO Merge into one transition.
            transition($el, { opacity: [0, opacity] }, duration, _delay);
            return transition($el, {
                transform: [transform + ' scale(0.5)',
                    transform + ' scale(1)']
            }, duration, _delay, 'bounce-in');
        }
        else if (effect === 'descend') {
            const rules = { opacity: [0, 1], transform: ['translateY(-50%)', 'none'] };
            return transition($el, rules, duration, _delay);
        }
        else if (effect.startsWith('draw')) {
            const l = $el.strokeLength;
            $el.css('stroke-dasharray', l + 'px');
            if (!$el.css('opacity'))
                $el.css('opacity', 1);
            // Note that Safari can't handle negative dash offsets!
            const end = (effect === 'draw-reverse') ? 2 * l + 'px' : 0;
            const rules = { 'stroke-dashoffset': [l + 'px', end] };
            const animation = transition($el, rules, duration, _delay, 'linear');
            animation.promise.then(() => $el.css('stroke-dasharray', ''));
            return animation;
        }
        else if (effect.startsWith('slide')) {
            const rules = { opacity: [0, opacity], transform: ['translateY(50px)', 'none'] };
            if (effect.includes('down'))
                rules.transform[0] = 'translateY(-50px)';
            if (effect.includes('right'))
                rules.transform[0] = 'translateX(-50px)';
            if (effect.includes('left'))
                rules.transform[0] = 'translateX(50px)';
            return transition($el, rules, duration, _delay);
        }
        else if (effect.startsWith('reveal')) {
            const rules = { opacity: [0, opacity], height: [0, 'auto'] };
            if (effect.includes('left'))
                rules.transform = ['translateX(-50%)', 'none'];
            if (effect.includes('right'))
                rules.transform = ['translateX(50%)', 'none'];
            return transition($el, rules, duration, _delay);
        }
        return ResolvedAnimation;
    }
    function exit($el, effect = 'fade', duration = 400, delay = 0, remove = false) {
        if (!$el._el)
            return ResolvedAnimation;
        if (!isReady) {
            $el.hide();
            return ResolvedAnimation;
        }
        if ($el.css('display') === 'none')
            return ResolvedAnimation;
        let animation;
        if (effect === 'fade') {
            animation = transition($el, { opacity: [1, 0] }, duration, delay);
        }
        else if (effect === 'pop') {
            const transform = $el.transform.replace(/scale\([0-9.]*\)/, '');
            transition($el, { opacity: [1, 0] }, duration, delay);
            animation = transition($el, {
                transform: [transform + ' scale(1)',
                    transform + ' scale(0.5)']
            }, duration, delay, 'bounce-out');
        }
        else if (effect === 'ascend') {
            const rules = { opacity: [1, 0], transform: ['none', 'translateY(-50%)'] };
            animation = transition($el, rules, duration, delay);
        }
        else if (effect.startsWith('draw')) {
            const l = $el.strokeLength;
            $el.css('stroke-dasharray', l);
            const start = (effect === 'draw-reverse') ? 2 * l + 'px' : 0;
            const rules = { 'stroke-dashoffset': [start, l + 'px'] };
            animation = transition($el, rules, duration, delay, 'linear');
        }
        else if (effect.startsWith('slide')) {
            const rules = { opacity: 0, transform: 'translateY(50px)' };
            if (effect.includes('up'))
                rules.transform = 'translateY(-50px)';
            animation = transition($el, rules, duration, delay);
        }
        else if (effect.startsWith('reveal')) {
            const rules = { opacity: 0, height: 0 };
            if (effect.includes('left'))
                rules.transform = 'translateX(-50%)';
            if (effect.includes('right'))
                rules.transform = 'translateX(50%)';
            animation = transition($el, rules, duration, delay);
        }
        animation.promise.then(() => remove ? $el.remove() : $el.hide());
        return animation;
    }

    // =============================================================================
    function getViewParams(url, view) {
        const match = view.regex.exec(url);
        if (match) {
            match.shift();
            const params = {};
            for (const [i, p] of view.params.entries())
                params[p] = match[i];
            return params;
        }
        else {
            return undefined;
        }
    }
    function getTemplate(view, params, url) {
        return __awaiter$1(this, void 0, void 0, function* () {
            if (view.template) {
                if (typeof view.template === 'string')
                    return view.template;
                return view.template(params);
            }
            // Append a query string to only load the body of the page, not the header.
            const str = yield fetch(url + (url.indexOf('?') >= 0 ? '&xhr=1' : '?xhr=1'));
            return str.text();
        });
    }
    // Don't trigger Router events during the initial Page load.
    let isReady$1 = (document.readyState === 'complete');
    window.addEventListener('load', () => setTimeout(() => isReady$1 = true));
    // Prevent scroll restoration on popstate
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }
    // -----------------------------------------------------------------------------
    // Router Cla
    class Router extends EventTarget {
        constructor() {
            super(...arguments);
            this.$viewport = $body;
            this.views = [];
            this.active = { path: '', hash: '', index: 0 };
            this.search = window.location.search;
            this.preloaded = false;
            this.transition = false;
            this.noLoad = false;
            this.initialise = () => { };
        }
        setup(options = {}) {
            if (options.$viewport)
                this.$viewport = options.$viewport;
            if (options.initialise)
                this.initialise = options.initialise;
            if (options.preloaded)
                this.preloaded = options.preloaded;
            if (options.transition)
                this.transition = options.transition;
            if (options.noLoad)
                this.noLoad = options.noLoad;
            if (options.click) {
                $body.on('click', (e) => this.onLinkClick(e));
            }
            if (options.history) {
                window.addEventListener('popstate', (e) => {
                    if (isReady$1 && e.state)
                        this.goToState(e.state);
                });
            }
        }
        view(url, { enter, exit, template } = {}) {
            // TODO Error on multiple matching views
            const params = (url.match(/:\w+/g) || []).map(x => x.substr(1));
            const regexStr = url.replace(/:\w+/g, '([\\w-]+)').replace('/', '\\/') +
                '\\/?';
            const searchStr = url.includes('?') ? '' : '(\\?.*)?';
            const regex = new RegExp('^' + regexStr + searchStr + '$', 'i');
            const thisView = { regex, params, enter, exit, template };
            this.views.push(thisView);
            const viewParams = getViewParams(window.location.pathname, thisView);
            if (!viewParams)
                return;
            this.active = {
                path: window.location.pathname + this.search,
                hash: window.location.hash,
                index: 0
            };
            window.history.replaceState(this.active, '', this.active.path + this.active.hash);
            // The wrappers fix stupid Firefox, which doesn't seem to take its time
            // triggering .createdCallbacks for web components...
            Browser.ready(() => {
                setTimeout(() => {
                    if (this.preloaded) {
                        this.initialise(this.$viewport, viewParams);
                        if (thisView.enter)
                            thisView.enter(this.$viewport, viewParams);
                    }
                    else {
                        this.loadView(thisView, viewParams, window.location.pathname);
                    }
                });
            });
        }
        paths(...urls) {
            for (const url of urls)
                this.view(url);
        }
        getView(path) {
            for (const view of this.views) {
                const params = getViewParams(path, view);
                if (params)
                    return { view, params };
            }
        }
        // ---------------------------------------------------------------------------
        // Loading and Rendering
        load(path, hash = '') {
            const go = this.getView(path);
            if (path === this.active.path && hash !== this.active.hash) {
                this.trigger('hashChange', hash.slice(1));
                this.trigger('change', path + hash);
                return true;
            }
            else if (go && path !== this.active.path) {
                this.trigger('change', path + hash);
                if (window.ga)
                    window.ga('send', 'pageview', path + hash);
                if (this.noLoad) {
                    if (go.view.enter)
                        go.view.enter(this.$viewport, go.params);
                }
                else {
                    this.loadView(go.view, go.params, path);
                }
                return true;
            }
            else {
                return false;
            }
        }
        loadView(view, params = {}, url = '') {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.$viewport.css({ opacity: 0.4, 'pointer-events': 'none' });
                const template = yield getTemplate(view, params, url);
                this.$viewport.css('opacity', 0);
                setTimeout(() => {
                    this.$viewport.removeChildren();
                    // TODO Remove all event listeners in $viewport, to avoid memory leaks.
                    $body.scrollTop = 0;
                    this.$viewport.html = template;
                    Browser.resize();
                    replaceSvgImports();
                    this.$viewport.css({ opacity: 1, 'pointer-events': 'all' });
                    const $title = this.$viewport.$('title');
                    if ($title)
                        document.title = $title.text;
                    this.initialise(this.$viewport, params);
                    if (view.enter)
                        view.enter(this.$viewport, params);
                    this.trigger('afterChange', { $viewport: this.$viewport });
                }, 350);
            });
        }
        // ---------------------------------------------------------------------------
        // Navigation Functions
        onLinkClick(e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey)
                return;
            if (e.defaultPrevented)
                return;
            let el = e.target;
            while (el && el.nodeName !== 'A')
                el = el.parentNode;
            if (!el || el.nodeName !== 'A')
                return;
            const anchor = el;
            // Check target
            if (anchor.target)
                return;
            // Different origin
            if (anchor.origin !== window.location.origin)
                return;
            // Ignore if tag has "download" attribute or rel="external" attribute
            if (anchor.hasAttribute('download') || anchor.getAttribute('rel') ===
                'external')
                return;
            // Check for mailto: in the href
            const link = anchor.getAttribute('href');
            if (link && link.indexOf('mailto:') > -1)
                return;
            const success = this.goTo(anchor.pathname + anchor.search, anchor.hash);
            if (success)
                e.preventDefault();
        }
        goToState(state) {
            if (!state || !state.path)
                return;
            const change = this.load(state.path + this.search, state.hash);
            if (change && state.index < this.active.index)
                this.trigger('back');
            if (change && state.index > this.active.index)
                this.trigger('forward');
            this.active = state;
        }
        goTo(path, hash = '') {
            const success = this.load(path, hash);
            if (success) {
                const index = (this.active ? this.active.index + 1 : 0);
                this.active = { path, hash, index };
                window.history.pushState(this.active, '', path + hash);
            }
            return success;
        }
        back() { window.history.back(); }
        forward() { window.history.forward(); }
    }
    const RouterInstance = new Router();

    // =============================================================================
    // -----------------------------------------------------------------------------
    // Utility Functions
    function applyTemplate(el, options) {
        // Array.from() is required to break the reference to the original parent.
        const children = Array.from(el.childNodes);
        if (options.template) {
            el.innerHTML = options.template;
        }
        else if (options.templateId) {
            const template = document.querySelector(options.templateId);
            if (!template)
                throw new Error(`Template not found: ${options.templateId}`);
            while (el.firstChild)
                el.removeChild(el.firstChild);
            const content = template.content;
            const clone = document.importNode(content, true);
            el.appendChild(clone);
        }
        if (!children.length)
            return;
        const defaultSlot = el.querySelector('slot:not([name])');
        for (const child of children) {
            const name = child.getAttribute ? child.getAttribute('slot') : undefined;
            const slot = name ? el.querySelector(`slot[name="${name}"]`) : defaultSlot;
            if (slot)
                slot.parentNode.insertBefore(child, slot);
        }
        for (const slot of Array.from(el.querySelectorAll('slot'))) {
            slot.parentNode.removeChild(slot);
        }
    }
    function customElementChildren(el) {
        const result = [];
        for (const c of Array.from(el.children)) {
            if (c.tagName.startsWith('X-')) {
                result.push(c);
            }
            else {
                result.push(...customElementChildren(c));
            }
        }
        return result;
    }
    // -----------------------------------------------------------------------------
    // Custom Element Classes
    const customElementOptions = new Map();
    class CustomHTMLElement extends HTMLElement {
        constructor() {
            super(...arguments);
            this.wasConnected = false;
            this.isReady = false;
        }
        connectedCallback() {
            return __awaiter$1(this, void 0, void 0, function* () {
                // The element setup is done when it is first attached to the dom. We have
                // to guard against this running more than once.
                if (this.wasConnected) {
                    // TODO Bind the model of the new parent.
                    this._view.trigger('connected');
                    return;
                }
                this.wasConnected = true;
                this.isReady = false;
                this._view.created();
                const options = customElementOptions.get(this._view.tagName) || {};
                // Bind Component Template
                if (options.template || options.templateId)
                    applyTemplate(this, options);
                // Select all unresolved custom element children
                // TODO improve performance and fix ordering
                const promises = customElementChildren(this)
                    .filter(c => !c.isReady)
                    .map(c => new Promise(res => c.addEventListener('ready', res)));
                yield Promise.all(promises);
                this._view.ready();
                this.dispatchEvent(new CustomEvent('ready'));
                this.isReady = true;
            });
        }
        disconnectedCallback() {
            this._view.trigger('disconnected');
        }
        attributeChangedCallback(attrName, oldVal, newVal) {
            this._view.trigger('attr:' + attrName, { newVal, oldVal });
        }
    }
    /**
     * Base class for custom HTML elements. In addition to other custom methods,
     * it can implement `created()` and `ready()` methods that are executed during
     * the element lifecycle.
     */
    class CustomElementView extends HTMLBaseView {
        created() { }
        ready() { }
    }
    /**
     * Decorator for registering a new custom HTML element.
     */
    function register(tagName, options = {}) {
        return function (ElementClass) {
            // Every class can only be used once as custom element,
            // so we have to make a copy.
            class Constructor extends CustomHTMLElement {
                constructor() {
                    super();
                    this._view = new ElementClass(this);
                }
            }
            Constructor.observedAttributes = options.attributes || [];
            customElementOptions.set(tagName.toUpperCase(), options);
            window.customElements.define(tagName, Constructor);
        };
    }

    // =============================================================================
    // Polyhedron Component Data
    // (c) Mathigon
    // =============================================================================
    // Data from http://www.georgehart.com/virtual-polyhedra/vp.html
    // and https://github.com/SirFizX/SirFizX.github.io/blob/master/js/polyhedra.js
    const PolyhedronData = {
        // ---------------------------------------------------------------------------
        // Platonic Solids
        Tetrahedron: {
            'vertex': [[0, 0, 1.732051], [1.632993, 0, -0.5773503],
                [-0.8164966, 1.414214, -0.5773503], [-0.8164966, -1.414214, -0.5773503]],
            'edge': [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]],
            'face': [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]]
        },
        Cube: {
            'vertex': [[0, 0, 1.224745], [1.154701, 0, 0.4082483],
                [-0.5773503, 1, 0.4082483], [-0.5773503, -1, 0.4082483],
                [0.5773503, 1, -0.4082483], [0.5773503, -1, -0.4082483],
                [-1.154701, 0, -0.4082483], [0, 0, -1.224745]],
            'edge': [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4], [2, 6], [3, 5],
                [3, 6], [4, 7], [5, 7], [6, 7]],
            'face': [[0, 1, 4, 2], [0, 2, 6, 3], [0, 3, 5, 1], [1, 5, 7, 4],
                [2, 4, 7, 6], [3, 6, 7, 5]]
        },
        Octahedron: {
            'vertex': [[0, 0, 1.414214], [1.414214, 0, 0], [0, 1.414214, 0],
                [-1.414214, 0, 0], [0, -1.414214, 0], [0, 0, -1.414214]],
            'edge': [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 4], [1, 5], [2, 3],
                [2, 5], [3, 4], [3, 5], [4, 5]],
            'face': [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], [1, 4, 5], [1, 5, 2],
                [2, 5, 3], [3, 5, 4]]
        },
        Dodecahedron: {
            'vertex': [[0, 0, 1.070466], [0.7136442, 0, 0.7978784],
                [-0.3568221, 0.618034, 0.7978784], [-0.3568221, -0.618034, 0.7978784],
                [0.7978784, 0.618034, 0.3568221], [0.7978784, -0.618034, 0.3568221],
                [-0.9341724, 0.381966, 0.3568221], [0.1362939, 1, 0.3568221],
                [0.1362939, -1, 0.3568221], [-0.9341724, -0.381966, 0.3568221],
                [0.9341724, 0.381966, -0.3568221], [0.9341724, -0.381966, -0.3568221],
                [-0.7978784, 0.618034, -0.3568221], [-0.1362939, 1, -0.3568221],
                [-0.1362939, -1, -0.3568221], [-0.7978784, -0.618034, -0.3568221],
                [0.3568221, 0.618034, -0.7978784], [0.3568221, -0.618034, -0.7978784],
                [-0.7136442, 0, -0.7978784], [0, 0, -1.070466]],
            'edge': [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 6], [2, 7], [3, 8],
                [3, 9], [4, 7], [4, 10], [5, 8], [5, 11], [6, 9], [6, 12], [7, 13],
                [8, 14], [9, 15], [10, 11], [10, 16], [11, 17], [12, 13], [12, 18],
                [13, 16], [14, 15], [14, 17], [15, 18], [16, 19], [17, 19], [18, 19]],
            'face': [[0, 1, 4, 7, 2], [0, 2, 6, 9, 3], [0, 3, 8, 5, 1],
                [1, 5, 11, 10, 4], [2, 7, 13, 12, 6], [3, 9, 15, 14, 8],
                [4, 10, 16, 13, 7], [5, 8, 14, 17, 11], [6, 12, 18, 15, 9],
                [10, 11, 17, 19, 16], [12, 13, 16, 19, 18], [14, 15, 18, 19, 17]]
        },
        Icosahedron: {
            'vertex': [[0, 0, 1.175571], [1.051462, 0, 0.5257311],
                [0.3249197, 1, 0.5257311], [-0.8506508, 0.618034, 0.5257311],
                [-0.8506508, -0.618034, 0.5257311], [0.3249197, -1, 0.5257311],
                [0.8506508, 0.618034, -0.5257311], [0.8506508, -0.618034, -0.5257311],
                [-0.3249197, 1, -0.5257311], [-1.051462, 0, -0.5257311],
                [-0.3249197, -1, -0.5257311], [0, 0, -1.175571]],
            'edge': [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 5], [1, 6],
                [1, 7], [2, 3], [2, 6], [2, 8], [3, 4], [3, 8], [3, 9], [4, 5], [4, 9],
                [4, 10], [5, 7], [5, 10], [6, 7], [6, 8], [6, 11], [7, 10], [7, 11],
                [8, 9], [8, 11], [9, 10], [9, 11], [10, 11]],
            'face': [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 1], [1, 5, 7],
                [1, 7, 6], [1, 6, 2], [2, 6, 8], [2, 8, 3], [3, 8, 9], [3, 9, 4],
                [4, 9, 10], [4, 10, 5], [5, 10, 7], [6, 7, 11], [6, 11, 8], [7, 10, 11],
                [8, 11, 9], [9, 11, 10]]
        },
        // ---------------------------------------------------------------------------
        // Archimedean Solids
        TruncatedTetrahedron: {
            'vertex': [[0, 0, 1.105542], [0.8528029, 0, 0.7035265],
                [-0.7106691, 0.4714045, 0.7035265], [0.3316456, -0.7856742, 0.7035265],
                [0.9949367, 0.4714045, -0.1005038], [-1.089693, 0.1571348, -0.1005038],
                [-0.5685352, 0.942809, -0.1005038], [-0.04737794, -1.099944, -0.1005038],
                [0.6159132, 0.1571348, -0.904534], [0.2842676, 0.942809, -0.5025189],
                [-0.758047, -0.6285394, -0.5025189], [0.09475587, -0.6285394, -0.904534]],
            'edge': [[0, 3], [3, 1], [1, 0], [2, 6], [6, 5], [5, 2], [4, 8], [8, 9],
                [9, 4], [7, 10], [10, 11], [11, 7], [1, 4], [9, 6], [2, 0], [5, 10],
                [7, 3], [11, 8]],
            'face': [[0, 3, 1], [2, 6, 5], [4, 8, 9], [7, 10, 11], [0, 1, 4, 9, 6, 2],
                [0, 2, 5, 10, 7, 3], [1, 3, 7, 11, 8, 4], [5, 6, 9, 8, 11, 10]]
        },
        TruncatedCube: {
            'vertex': [[0, 0, 1.042011], [0.5621693, 0, 0.8773552],
                [-0.4798415, 0.2928932, 0.8773552], [0.2569714, -0.5, 0.8773552],
                [0.8773552, 0.2928932, 0.4798415], [-0.9014684, 0.2071068, 0.4798415],
                [-0.5962706, 0.7071068, 0.4798415], [0.1405423, -0.9142136, 0.4798415],
                [1.017898, 0.2071068, -0.08232778], [0.7609261, 0.7071068, 0.08232778],
                [-1.017898, -0.2071068, 0.08232778], [-0.2810846, 1, 0.08232778],
                [-0.2810846, -1, 0.08232778], [0.2810846, -1, -0.08232778],
                [0.9014684, -0.2071068, -0.4798415], [0.2810846, 1, -0.08232778],
                [-0.7609261, -0.7071068, -0.08232778],
                [-0.8773552, -0.2928932, -0.4798415], [-0.1405423, 0.9142136, -0.4798415],
                [0.5962706, -0.7071068, -0.4798415], [0.4798415, -0.2928932, -0.8773552],
                [-0.5621693, 0, -0.8773552], [-0.2569714, 0.5, -0.8773552],
                [0, 0, -1.042011]],
            'edge': [[0, 3], [3, 1], [1, 0], [2, 6], [6, 5], [5, 2], [4, 8], [8, 9],
                [9, 4], [7, 12], [12, 13], [13, 7], [10, 17], [17, 16], [16, 10],
                [11, 15], [15, 18], [18, 11], [14, 19], [19, 20], [20, 14], [21, 22],
                [22, 23], [23, 21], [1, 4], [9, 15], [11, 6], [2, 0], [5, 10], [16, 12],
                [7, 3], [13, 19], [14, 8], [18, 22], [21, 17], [20, 23]],
            'face': [[0, 3, 1], [2, 6, 5], [4, 8, 9], [7, 12, 13], [10, 17, 16],
                [11, 15, 18], [14, 19, 20], [21, 22, 23], [0, 1, 4, 9, 15, 11, 6, 2],
                [0, 2, 5, 10, 16, 12, 7, 3], [1, 3, 7, 13, 19, 14, 8, 4],
                [5, 6, 11, 18, 22, 21, 17, 10], [8, 14, 20, 23, 22, 18, 15, 9],
                [12, 16, 17, 21, 23, 20, 19, 13]]
        },
        TruncatedOctahedron: {
            'vertex': [[0, 0, 1.054093], [0.6324555, 0, 0.843274],
                [-0.421637, 0.4714045, 0.843274], [-0.07027284, -0.6285394, 0.843274],
                [0.843274, 0.4714045, 0.421637], [0.5621827, -0.6285394, 0.6324555],
                [-0.9135469, 0.3142697, 0.421637], [-0.2108185, 0.942809, 0.421637],
                [-0.5621827, -0.7856742, 0.421637], [0.9838197, 0.3142697, -0.2108185],
                [0.421637, 0.942809, 0.2108185], [0.7027284, -0.7856742, 0],
                [-0.7027284, 0.7856742, 0], [-0.9838197, -0.3142697, 0.2108185],
                [-0.421637, -0.942809, -0.2108185], [0.5621827, 0.7856742, -0.421637],
                [0.9135469, -0.3142697, -0.421637], [0.2108185, -0.942809, -0.421637],
                [-0.5621827, 0.6285394, -0.6324555], [-0.843274, -0.4714045, -0.421637],
                [0.07027284, 0.6285394, -0.843274], [0.421637, -0.4714045, -0.843274],
                [-0.6324555, 0, -0.843274], [0, 0, -1.054093]],
            'edge': [[0, 3], [3, 5], [5, 1], [1, 0], [2, 7], [7, 12], [12, 6], [6, 2],
                [4, 9], [9, 15], [15, 10], [10, 4], [8, 13], [13, 19], [19, 14], [14, 8],
                [11, 17], [17, 21], [21, 16], [16, 11], [18, 20], [20, 23], [23, 22],
                [22, 18], [1, 4], [10, 7], [2, 0], [6, 13], [8, 3], [5, 11], [16, 9],
                [14, 17], [12, 18], [22, 19], [15, 20], [21, 23]],
            'face': [[0, 3, 5, 1], [2, 7, 12, 6], [4, 9, 15, 10], [8, 13, 19, 14],
                [11, 17, 21, 16], [18, 20, 23, 22], [0, 1, 4, 10, 7, 2],
                [0, 2, 6, 13, 8, 3], [1, 5, 11, 16, 9, 4], [3, 8, 14, 17, 11, 5],
                [6, 12, 18, 22, 19, 13], [7, 10, 15, 20, 18, 12], [9, 16, 21, 23, 20, 15],
                [14, 19, 22, 23, 21, 17]]
        },
        TruncatedDodecahedron: {
            'vertex': [[0, 0, 1.014485], [0.3367628, 0, 0.9569589],
                [-0.2902233, 0.1708204, 0.9569589], [0.1634681, -0.2944272, 0.9569589],
                [0.5914332, 0.1708204, 0.806354], [-0.5963465, 0.1527864, 0.806354],
                [-0.4230517, 0.4472136, 0.806354], [0.1377417, -0.6, 0.806354],
                [0.8302037, 0.1527864, 0.5626702], [0.6667356, 0.4472136, 0.6201961],
                [-0.8014407, -0.0472136, 0.6201961], [-0.3477493, 0.7236068, 0.6201961],
                [-0.06735256, -0.8, 0.6201961], [0.2694102, -0.8, 0.5626702],
                [0.9618722, -0.0472136, 0.3189863], [0.5339072, 0.7236068, 0.4695912],
                [-0.8271671, -0.3527864, 0.4695912], [-0.9599955, -0.0763932, 0.3189863],
                [-0.3992021, 0.8763932, 0.3189863], [-0.09307895, 0.8944272, 0.4695912],
                [-0.3734757, -0.818034, 0.4695912], [0.5081808, -0.818034, 0.3189863],
                [0.9361459, -0.3527864, 0.1683814], [1.011448, -0.0763932, -0.0177765],
                [0.4824544, 0.8763932, 0.1683814], [0.2436839, 0.8944272, 0.4120653],
                [-0.663699, -0.6472136, 0.4120653], [-1.011448, 0.0763932, 0.0177765],
                [-0.5577569, 0.8472136, 0.0177765], [-0.5320305, -0.8472136, 0.1683814],
                [0.5577569, -0.8472136, -0.0177765], [0.7628511, -0.6472136, 0.1683814],
                [0.9599955, 0.0763932, -0.3189863], [0.5320305, 0.8472136, -0.1683814],
                [-0.9618722, 0.0472136, -0.3189863], [-0.9361459, 0.3527864, -0.1683814],
                [-0.7628511, 0.6472136, -0.1683814], [-0.5081808, 0.818034, -0.3189863],
                [-0.4824544, -0.8763932, -0.1683814], [0.3992021, -0.8763932, -0.3189863],
                [0.8014407, 0.0472136, -0.6201961], [0.8271671, 0.3527864, -0.4695912],
                [0.663699, 0.6472136, -0.4120653], [0.3734757, 0.818034, -0.4695912],
                [-0.8302037, -0.1527864, -0.5626702], [-0.2694102, 0.8, -0.5626702],
                [-0.5339072, -0.7236068, -0.4695912],
                [-0.2436839, -0.8944272, -0.4120653],
                [0.09307895, -0.8944272, -0.4695912], [0.3477493, -0.7236068, -0.6201961],
                [0.5963465, -0.1527864, -0.806354], [0.06735256, 0.8, -0.6201961],
                [-0.6667356, -0.4472136, -0.6201961], [-0.5914332, -0.1708204, -0.806354],
                [-0.1377417, 0.6, -0.806354], [0.4230517, -0.4472136, -0.806354],
                [0.2902233, -0.1708204, -0.9569589], [-0.3367628, 0, -0.9569589],
                [-0.1634681, 0.2944272, -0.9569589], [0, 0, -1.014485]],
            'edge': [[0, 3], [3, 1], [1, 0], [2, 6], [6, 5], [5, 2], [4, 8], [8, 9],
                [9, 4], [7, 12], [12, 13], [13, 7], [10, 17], [17, 16], [16, 10],
                [11, 19], [19, 18], [18, 11], [14, 22], [22, 23], [23, 14], [15, 24],
                [24, 25], [25, 15], [20, 26], [26, 29], [29, 20], [21, 30], [30, 31],
                [31, 21], [27, 35], [35, 34], [34, 27], [28, 37], [37, 36], [36, 28],
                [32, 40], [40, 41], [41, 32], [33, 42], [42, 43], [43, 33], [38, 46],
                [46, 47], [47, 38], [39, 48], [48, 49], [49, 39], [44, 53], [53, 52],
                [52, 44], [45, 51], [51, 54], [54, 45], [50, 55], [55, 56], [56, 50],
                [57, 58], [58, 59], [59, 57], [1, 4], [9, 15], [25, 19], [11, 6], [2, 0],
                [5, 10], [16, 26], [20, 12], [7, 3], [13, 21], [31, 22], [14, 8],
                [18, 28], [36, 35], [27, 17], [23, 32], [41, 42], [33, 24], [29, 38],
                [47, 48], [39, 30], [34, 44], [52, 46], [43, 51], [45, 37], [49, 55],
                [50, 40], [54, 58], [57, 53], [56, 59]],
            'face': [[0, 3, 1], [2, 6, 5], [4, 8, 9], [7, 12, 13], [10, 17, 16],
                [11, 19, 18], [14, 22, 23], [15, 24, 25], [20, 26, 29], [21, 30, 31],
                [27, 35, 34], [28, 37, 36], [32, 40, 41], [33, 42, 43], [38, 46, 47],
                [39, 48, 49], [44, 53, 52], [45, 51, 54], [50, 55, 56], [57, 58, 59],
                [0, 1, 4, 9, 15, 25, 19, 11, 6, 2], [0, 2, 5, 10, 16, 26, 20, 12, 7, 3],
                [1, 3, 7, 13, 21, 31, 22, 14, 8, 4],
                [5, 6, 11, 18, 28, 36, 35, 27, 17, 10],
                [8, 14, 23, 32, 41, 42, 33, 24, 15, 9],
                [12, 20, 29, 38, 47, 48, 39, 30, 21, 13],
                [16, 17, 27, 34, 44, 52, 46, 38, 29, 26],
                [18, 19, 25, 24, 33, 43, 51, 45, 37, 28],
                [22, 31, 30, 39, 49, 55, 50, 40, 32, 23],
                [34, 35, 36, 37, 45, 54, 58, 57, 53, 44],
                [40, 50, 56, 59, 58, 54, 51, 43, 42, 41],
                [46, 52, 53, 57, 59, 56, 55, 49, 48, 47]]
        },
        TruncatedIcosahedron: {
            'vertex': [[0, 0, 1.021], [0.4035482, 0, 0.9378643],
                [-0.2274644, 0.3333333, 0.9378643], [-0.1471226, -0.375774, 0.9378643],
                [0.579632, 0.3333333, 0.7715933], [0.5058321, -0.375774, 0.8033483],
                [-0.6020514, 0.2908927, 0.7715933], [-0.05138057, 0.6666667, 0.7715933],
                [0.1654988, -0.6080151, 0.8033483], [-0.5217096, -0.4182147, 0.7715933],
                [0.8579998, 0.2908927, 0.4708062], [0.3521676, 0.6666667, 0.6884578],
                [0.7841999, -0.4182147, 0.5025612], [-0.657475, 0.5979962, 0.5025612],
                [-0.749174, -0.08488134, 0.6884578], [-0.3171418, 0.8302373, 0.5025612],
                [0.1035333, -0.8826969, 0.5025612], [-0.5836751, -0.6928964, 0.4708062],
                [0.8025761, 0.5979962, 0.2017741], [0.9602837, -0.08488134, 0.3362902],
                [0.4899547, 0.8302373, 0.3362902], [0.7222343, -0.6928964, 0.2017741],
                [-0.8600213, 0.5293258, 0.1503935], [-0.9517203, -0.1535518, 0.3362902],
                [-0.1793548, 0.993808, 0.1503935], [0.381901, -0.9251375, 0.2017741],
                [-0.2710537, -0.9251375, 0.3362902], [-0.8494363, -0.5293258, 0.2017741],
                [0.8494363, 0.5293258, -0.2017741], [1.007144, -0.1535518, -0.06725804],
                [0.2241935, 0.993808, 0.06725804], [0.8600213, -0.5293258, -0.1503935],
                [-0.7222343, 0.6928964, -0.2017741], [-1.007144, 0.1535518, 0.06725804],
                [-0.381901, 0.9251375, -0.2017741], [0.1793548, -0.993808, -0.1503935],
                [-0.2241935, -0.993808, -0.06725804],
                [-0.8025761, -0.5979962, -0.2017741], [0.5836751, 0.6928964, -0.4708062],
                [0.9517203, 0.1535518, -0.3362902], [0.2710537, 0.9251375, -0.3362902],
                [0.657475, -0.5979962, -0.5025612], [-0.7841999, 0.4182147, -0.5025612],
                [-0.9602837, 0.08488134, -0.3362902], [-0.1035333, 0.8826969, -0.5025612],
                [0.3171418, -0.8302373, -0.5025612], [-0.4899547, -0.8302373, -0.3362902],
                [-0.8579998, -0.2908927, -0.4708062], [0.5217096, 0.4182147, -0.7715933],
                [0.749174, 0.08488134, -0.6884578], [0.6020514, -0.2908927, -0.7715933],
                [-0.5058321, 0.375774, -0.8033483], [-0.1654988, 0.6080151, -0.8033483],
                [0.05138057, -0.6666667, -0.7715933],
                [-0.3521676, -0.6666667, -0.6884578], [-0.579632, -0.3333333, -0.7715933],
                [0.1471226, 0.375774, -0.9378643], [0.2274644, -0.3333333, -0.9378643],
                [-0.4035482, 0, -0.9378643], [0, 0, -1.021]],
            'edge': [[0, 3], [3, 8], [8, 5], [5, 1], [1, 0], [2, 7], [7, 15], [15, 13],
                [13, 6], [6, 2], [4, 10], [10, 18], [18, 20], [20, 11], [11, 4], [9, 14],
                [14, 23], [23, 27], [27, 17], [17, 9], [12, 21], [21, 31], [31, 29],
                [29, 19], [19, 12], [16, 26], [26, 36], [36, 35], [35, 25], [25, 16],
                [22, 32], [32, 42], [42, 43], [43, 33], [33, 22], [24, 30], [30, 40],
                [40, 44], [44, 34], [34, 24], [28, 39], [39, 49], [49, 48], [48, 38],
                [38, 28], [37, 47], [47, 55], [55, 54], [54, 46], [46, 37], [41, 45],
                [45, 53], [53, 57], [57, 50], [50, 41], [51, 52], [52, 56], [56, 59],
                [59, 58], [58, 51], [1, 4], [11, 7], [2, 0], [6, 14], [9, 3], [5, 12],
                [19, 10], [17, 26], [16, 8], [25, 21], [13, 22], [33, 23], [20, 30],
                [24, 15], [29, 39], [28, 18], [34, 32], [27, 37], [46, 36], [38, 40],
                [35, 45], [41, 31], [43, 47], [50, 49], [44, 52], [51, 42], [54, 53],
                [48, 56], [58, 55], [57, 59]],
            'face': [[0, 3, 8, 5, 1], [2, 7, 15, 13, 6], [4, 10, 18, 20, 11],
                [9, 14, 23, 27, 17], [12, 21, 31, 29, 19], [16, 26, 36, 35, 25],
                [22, 32, 42, 43, 33], [24, 30, 40, 44, 34], [28, 39, 49, 48, 38],
                [37, 47, 55, 54, 46], [41, 45, 53, 57, 50], [51, 52, 56, 59, 58],
                [0, 1, 4, 11, 7, 2], [0, 2, 6, 14, 9, 3], [1, 5, 12, 19, 10, 4],
                [3, 9, 17, 26, 16, 8], [5, 8, 16, 25, 21, 12], [6, 13, 22, 33, 23, 14],
                [7, 11, 20, 30, 24, 15], [10, 19, 29, 39, 28, 18],
                [13, 15, 24, 34, 32, 22], [17, 27, 37, 46, 36, 26],
                [18, 28, 38, 40, 30, 20], [21, 25, 35, 45, 41, 31],
                [23, 33, 43, 47, 37, 27], [29, 31, 41, 50, 49, 39],
                [32, 34, 44, 52, 51, 42], [35, 36, 46, 54, 53, 45],
                [38, 48, 56, 52, 44, 40], [42, 51, 58, 55, 47, 43],
                [48, 49, 50, 57, 59, 56], [53, 54, 55, 58, 59, 57]]
        },
        Cuboctahedron: {
            'vertex': [[0, 0, 1.154701], [1, 0, 0.5773503],
                [0.3333333, 0.942809, 0.5773503], [-1, 0, 0.5773503],
                [-0.3333333, -0.942809, 0.5773503], [1, 0, -0.5773503],
                [0.6666667, -0.942809, 0], [-0.6666667, 0.942809, 0],
                [0.3333333, 0.942809, -0.5773503], [-1, 0, -0.5773503],
                [-0.3333333, -0.942809, -0.5773503], [0, 0, -1.154701]],
            'edge': [[0, 1], [1, 2], [2, 0], [0, 3], [3, 4], [4, 0], [1, 6], [6, 5],
                [5, 1], [2, 8], [8, 7], [7, 2], [3, 7], [7, 9], [9, 3], [4, 10], [10, 6],
                [6, 4], [5, 11], [11, 8], [8, 5], [9, 11], [11, 10], [10, 9]],
            'face': [[0, 1, 2], [0, 3, 4], [1, 6, 5], [2, 8, 7], [3, 7, 9], [4, 10, 6],
                [5, 11, 8], [9, 11, 10], [0, 2, 7, 3], [0, 4, 6, 1], [1, 5, 8, 2],
                [3, 9, 10, 4], [5, 6, 10, 11], [7, 8, 11, 9]]
        },
        TruncatedCuboctahedron: {
            'vertex': [[0, 0, 1.024117], [0.4314788, 0, 0.928785],
                [-0.02106287, 0.4309644, 0.928785], [-0.3410582, -0.2642977, 0.928785],
                [0.4104159, 0.4309644, 0.833453], [0.7006238, -0.2642977, 0.6986333],
                [-0.3831839, 0.5976311, 0.7381211], [-0.3919084, -0.6380712, 0.6986333],
                [-0.7031792, -0.09763107, 0.7381211], [0.6584981, 0.5976311, 0.5079694],
                [0.6497736, -0.6380712, 0.4684816], [0.948706, -0.09763107, 0.3731496],
                [-0.4638216, 0.8333333, 0.3731496], [-0.7242421, 0.3333333, 0.6427891],
                [-0.7540295, -0.4714045, 0.5079694], [-0.1227634, -0.9023689, 0.4684816],
                [0.5778604, 0.8333333, 0.1429979], [0.9276431, 0.3333333, 0.2778177],
                [0.8978557, -0.4714045, 0.1429979], [0.3087154, -0.9023689, 0.3731496],
                [-0.8048797, 0.5690356, 0.2778177], [-0.2157394, 1, 0.04766598],
                [-0.8470055, -0.5690356, 0.08715377], [-0.2157394, -1, 0.04766598],
                [0.8470055, 0.5690356, -0.08715377], [0.2157394, 1, -0.04766598],
                [0.8048797, -0.5690356, -0.2778177], [0.2157394, -1, -0.04766598],
                [-0.8978557, 0.4714045, -0.1429979], [-0.3087154, 0.9023689, -0.3731496],
                [-0.9276431, -0.3333333, -0.2778177],
                [-0.5778604, -0.8333333, -0.1429979], [0.7540295, 0.4714045, -0.5079694],
                [0.1227634, 0.9023689, -0.4684816], [0.7242421, -0.3333333, -0.6427891],
                [0.4638216, -0.8333333, -0.3731496], [-0.948706, 0.09763107, -0.3731496],
                [-0.6497736, 0.6380712, -0.4684816], [-0.6584981, -0.5976311, -0.5079694],
                [0.7031792, 0.09763107, -0.7381211], [0.3919084, 0.6380712, -0.6986333],
                [0.3831839, -0.5976311, -0.7381211], [-0.7006238, 0.2642977, -0.6986333],
                [-0.4104159, -0.4309644, -0.833453], [0.3410582, 0.2642977, -0.928785],
                [0.02106287, -0.4309644, -0.928785], [-0.4314788, 0, -0.928785],
                [0, 0, -1.024117]],
            'edge': [[0, 1], [1, 4], [4, 2], [2, 0], [3, 8], [8, 14], [14, 7], [7, 3],
                [5, 10], [10, 18], [18, 11], [11, 5], [6, 12], [12, 20], [20, 13],
                [13, 6], [9, 17], [17, 24], [24, 16], [16, 9], [15, 23], [23, 27],
                [27, 19], [19, 15], [21, 25], [25, 33], [33, 29], [29, 21], [22, 30],
                [30, 38], [38, 31], [31, 22], [26, 35], [35, 41], [41, 34], [34, 26],
                [28, 37], [37, 42], [42, 36], [36, 28], [32, 39], [39, 44], [44, 40],
                [40, 32], [43, 46], [46, 47], [47, 45], [45, 43], [2, 6], [13, 8], [3, 0],
                [1, 5], [11, 17], [9, 4], [14, 22], [31, 23], [15, 7], [10, 19], [27, 35],
                [26, 18], [12, 21], [29, 37], [28, 20], [24, 32], [40, 33], [25, 16],
                [30, 36], [42, 46], [43, 38], [41, 45], [47, 44], [39, 34]],
            'face': [[0, 1, 4, 2], [3, 8, 14, 7], [5, 10, 18, 11], [6, 12, 20, 13],
                [9, 17, 24, 16], [15, 23, 27, 19], [21, 25, 33, 29], [22, 30, 38, 31],
                [26, 35, 41, 34], [28, 37, 42, 36], [32, 39, 44, 40], [43, 46, 47, 45],
                [0, 2, 6, 13, 8, 3], [1, 5, 11, 17, 9, 4], [7, 14, 22, 31, 23, 15],
                [10, 19, 27, 35, 26, 18], [12, 21, 29, 37, 28, 20],
                [16, 24, 32, 40, 33, 25], [30, 36, 42, 46, 43, 38],
                [34, 41, 45, 47, 44, 39], [0, 3, 7, 15, 19, 10, 5, 1],
                [2, 4, 9, 16, 25, 21, 12, 6], [8, 13, 20, 28, 36, 30, 22, 14],
                [11, 18, 26, 34, 39, 32, 24, 17], [23, 31, 38, 43, 45, 41, 35, 27],
                [29, 33, 40, 44, 47, 46, 42, 37]]
        },
        Rhombicuboctahedron: {
            'vertex': [[0, 0, 1.070722], [0.7148135, 0, 0.7971752],
                [-0.104682, 0.7071068, 0.7971752], [-0.6841528, 0.2071068, 0.7971752],
                [-0.104682, -0.7071068, 0.7971752], [0.6101315, 0.7071068, 0.5236279],
                [1.04156, 0.2071068, 0.1367736], [0.6101315, -0.7071068, 0.5236279],
                [-0.3574067, 1, 0.1367736], [-0.7888348, -0.5, 0.5236279],
                [-0.9368776, 0.5, 0.1367736], [-0.3574067, -1, 0.1367736],
                [0.3574067, 1, -0.1367736], [0.9368776, -0.5, -0.1367736],
                [0.7888348, 0.5, -0.5236279], [0.3574067, -1, -0.1367736],
                [-0.6101315, 0.7071068, -0.5236279], [-1.04156, -0.2071068, -0.1367736],
                [-0.6101315, -0.7071068, -0.5236279], [0.104682, 0.7071068, -0.7971752],
                [0.6841528, -0.2071068, -0.7971752], [0.104682, -0.7071068, -0.7971752],
                [-0.7148135, 0, -0.7971752], [0, 0, -1.070722]],
            'edge': [[0, 2], [2, 3], [3, 0], [1, 6], [6, 5], [5, 1], [4, 9], [9, 11],
                [11, 4], [7, 15], [15, 13], [13, 7], [8, 16], [16, 10], [10, 8], [12, 14],
                [14, 19], [19, 12], [17, 22], [22, 18], [18, 17], [20, 21], [21, 23],
                [23, 20], [0, 1], [5, 2], [3, 9], [4, 0], [4, 7], [7, 1], [13, 6],
                [5, 12], [12, 8], [8, 2], [10, 3], [10, 17], [17, 9], [11, 15], [6, 14],
                [13, 20], [20, 14], [19, 16], [18, 11], [16, 22], [18, 21], [21, 15],
                [23, 19], [23, 22]],
            'face': [[0, 2, 3], [1, 6, 5], [4, 9, 11], [7, 15, 13], [8, 16, 10],
                [12, 14, 19], [17, 22, 18], [20, 21, 23], [0, 1, 5, 2], [0, 3, 9, 4],
                [0, 4, 7, 1], [1, 7, 13, 6], [2, 5, 12, 8], [2, 8, 10, 3], [3, 10, 17, 9],
                [4, 11, 15, 7], [5, 6, 14, 12], [6, 13, 20, 14], [8, 12, 19, 16],
                [9, 17, 18, 11], [10, 16, 22, 17], [11, 18, 21, 15], [13, 15, 21, 20],
                [14, 20, 23, 19], [16, 19, 23, 22], [18, 22, 23, 21]]
        },
        SnubCube: {
            'vertex': [[0, 0, 1.077364], [0.7442063, 0, 0.7790187],
                [0.3123013, 0.6755079, 0.7790187], [-0.482096, 0.5669449, 0.7790187],
                [-0.7169181, -0.1996786, 0.7790187], [-0.1196038, -0.7345325, 0.7790187],
                [0.6246025, -0.7345325, 0.4806734], [1.056508, -0.1996786, 0.06806912],
                [0.8867128, 0.5669449, 0.2302762], [0.2621103, 1.042774, 0.06806912],
                [-0.532287, 0.9342111, 0.06806912], [-1.006317, 0.3082417, 0.2302762],
                [-0.7020817, -0.784071, 0.2302762], [0.02728827, -1.074865, 0.06806912],
                [0.6667271, -0.784071, -0.3184664], [0.8216855, -0.09111555, -0.6908285],
                [0.6518908, 0.6755079, -0.5286215], [-0.1196038, 0.8751866, -0.6168117],
                [-0.8092336, 0.4758293, -0.5286215], [-0.9914803, -0.2761507, -0.3184664],
                [-0.4467414, -0.825648, -0.5286215], [0.1926974, -0.5348539, -0.915157],
                [0.1846311, 0.2587032, -1.029416], [-0.5049987, -0.1406541, -0.9412258]],
            'edge': [[0, 1], [1, 2], [2, 0], [2, 3], [3, 0], [3, 4], [4, 0], [4, 5],
                [5, 0], [1, 6], [6, 7], [7, 1], [7, 8], [8, 1], [8, 2], [8, 9], [9, 2],
                [3, 10], [10, 11], [11, 3], [11, 4], [4, 12], [12, 5], [12, 13], [13, 5],
                [13, 6], [6, 5], [13, 14], [14, 6], [14, 7], [14, 15], [15, 7], [8, 16],
                [16, 9], [16, 17], [17, 9], [17, 10], [10, 9], [17, 18], [18, 10],
                [18, 11], [18, 19], [19, 11], [12, 19], [19, 20], [20, 12], [20, 13],
                [14, 21], [21, 15], [21, 22], [22, 15], [22, 16], [16, 15], [22, 17],
                [18, 23], [23, 19], [23, 20], [23, 21], [21, 20], [23, 22]],
            'face': [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [1, 6, 7], [1, 7, 8],
                [1, 8, 2], [2, 8, 9], [3, 10, 11], [3, 11, 4], [4, 12, 5], [5, 12, 13],
                [5, 13, 6], [6, 13, 14], [6, 14, 7], [7, 14, 15], [8, 16, 9], [9, 16, 17],
                [9, 17, 10], [10, 17, 18], [10, 18, 11], [11, 18, 19], [12, 19, 20],
                [12, 20, 13], [14, 21, 15], [15, 21, 22], [15, 22, 16], [16, 22, 17],
                [18, 23, 19], [19, 23, 20], [20, 23, 21], [21, 23, 22], [0, 5, 6, 1],
                [2, 9, 10, 3], [4, 11, 19, 12], [7, 15, 16, 8], [13, 20, 21, 14],
                [17, 22, 23, 18]]
        },
        Icosidodecahedron: {
            'vertex': [[0, 0, 1.051462], [0.618034, 0, 0.8506508],
                [0.2763932, 0.5527864, 0.8506508], [-0.618034, 0, 0.8506508],
                [-0.2763932, -0.5527864, 0.8506508], [1, 0, 0.3249197],
                [0.7236068, -0.5527864, 0.5257311], [-0.1708204, 0.8944272, 0.5257311],
                [0.4472136, 0.8944272, 0.3249197], [-1, 0, 0.3249197],
                [-0.7236068, 0.5527864, 0.5257311], [0.1708204, -0.8944272, 0.5257311],
                [-0.4472136, -0.8944272, 0.3249197], [1, 0, -0.3249197],
                [0.8944272, 0.5527864, 0], [0.5527864, -0.8944272, 0],
                [-0.5527864, 0.8944272, 0], [0.4472136, 0.8944272, -0.3249197],
                [-1, 0, -0.3249197], [-0.8944272, -0.5527864, 0],
                [-0.4472136, -0.8944272, -0.3249197], [0.618034, 0, -0.8506508],
                [0.7236068, -0.5527864, -0.5257311], [0.1708204, -0.8944272, -0.5257311],
                [-0.7236068, 0.5527864, -0.5257311], [-0.1708204, 0.8944272, -0.5257311],
                [0.2763932, 0.5527864, -0.8506508], [-0.618034, 0, -0.8506508],
                [-0.2763932, -0.5527864, -0.8506508], [0, 0, -1.051462]],
            'edge': [[0, 1], [1, 2], [2, 0], [0, 3], [3, 4], [4, 0], [1, 6], [6, 5],
                [5, 1], [2, 8], [8, 7], [7, 2], [3, 10], [10, 9], [9, 3], [4, 12],
                [12, 11], [11, 4], [5, 13], [13, 14], [14, 5], [6, 11], [11, 15], [15, 6],
                [7, 16], [16, 10], [10, 7], [8, 14], [14, 17], [17, 8], [9, 18], [18, 19],
                [19, 9], [12, 19], [19, 20], [20, 12], [13, 22], [22, 21], [21, 13],
                [15, 23], [23, 22], [22, 15], [16, 25], [25, 24], [24, 16], [17, 26],
                [26, 25], [25, 17], [18, 24], [24, 27], [27, 18], [20, 28], [28, 23],
                [23, 20], [21, 29], [29, 26], [26, 21], [27, 29], [29, 28], [28, 27]],
            'face': [[0, 1, 2], [0, 3, 4], [1, 6, 5], [2, 8, 7], [3, 10, 9],
                [4, 12, 11], [5, 13, 14], [6, 11, 15], [7, 16, 10], [8, 14, 17],
                [9, 18, 19], [12, 19, 20], [13, 22, 21], [15, 23, 22], [16, 25, 24],
                [17, 26, 25], [18, 24, 27], [20, 28, 23], [21, 29, 26], [27, 29, 28],
                [0, 2, 7, 10, 3], [0, 4, 11, 6, 1], [1, 5, 14, 8, 2], [3, 9, 19, 12, 4],
                [5, 6, 15, 22, 13], [7, 8, 17, 25, 16], [9, 10, 16, 24, 18],
                [11, 12, 20, 23, 15], [13, 21, 26, 17, 14], [18, 27, 28, 20, 19],
                [21, 22, 23, 28, 29], [24, 25, 26, 29, 27]]
        },
        TruncatedIcosidodecahedron: {
            'vertex': [[0, 0, 1.008759], [0.2629922, 0, 0.973874],
                [-0.00462747, 0.2629515, 0.973874], [-0.2211363, -0.1423503, 0.973874],
                [0.2583647, 0.2629515, 0.9389886], [0.4673861, -0.1423503, 0.8825429],
                [-0.2303913, 0.3835526, 0.9041033], [-0.3159502, -0.372678, 0.8825429],
                [-0.4469001, -0.02174919, 0.9041033], [0.4581312, 0.3835526, 0.8127722],
                [0.5351104, -0.372678, 0.7696515], [0.6671526, -0.02174919, 0.7563265],
                [-0.3326926, 0.5786893, 0.7563265], [-0.4515276, 0.2412023, 0.8692179],
                [-0.541714, -0.2520769, 0.8127722], [-0.248226, -0.6030057, 0.7696515],
                [0.518368, 0.5786893, 0.6434351], [0.6625252, 0.2412023, 0.7214412],
                [0.7348768, -0.2520769, 0.6434351], [0.4402965, -0.6030057, 0.6783205],
                [-0.5538289, 0.436339, 0.7214412], [-0.2724557, 0.7738261, 0.5869894],
                [-0.6997536, -0.3618034, 0.6301101], [-0.04383203, -0.745356, 0.6783205],
                [-0.4062656, -0.7127322, 0.5869894], [0.722762, 0.436339, 0.552104],
                [0.4160667, 0.7738261, 0.4956583], [0.8398294, -0.3618034, 0.4258876],
                [0.2191601, -0.745356, 0.6434351], [0.5452491, -0.7127322, 0.460773],
                [-0.7147284, 0.4891254, 0.5172187], [-0.07268925, 0.8944272, 0.460773],
                [-0.4333553, 0.8266125, 0.3827669], [-0.8606531, -0.309017, 0.4258876],
                [-0.6320294, -0.5921311, 0.5172187], [-0.2018716, -0.8550825, 0.4956583],
                [0.8248546, 0.4891254, 0.3129962], [0.1903029, 0.8944272, 0.4258876],
                [0.5181594, 0.8266125, 0.2565505], [0.9419221, -0.309017, 0.1867798],
                [0.7450156, -0.5921311, 0.3345566], [0.3241127, -0.8550825, 0.4258876],
                [-0.8727679, 0.3793989, 0.3345566], [-0.6544916, 0.6842621, 0.3478816],
                [-0.2335888, 0.9472136, 0.2565505], [-0.7929289, -0.5393447, 0.3129962],
                [-0.9629544, -0.1138803, 0.2781109], [-0.096919, -0.9648091, 0.2781109],
                [0.9298072, 0.3793989, 0.09544872], [0.7225533, 0.6842621, 0.1652194],
                [0.2923956, 0.9472136, 0.1867798], [0.8471082, -0.5393447, 0.09544872],
                [1.002159, -0.1138803, 0.01744268], [0.1660732, -0.9648091, 0.2432255],
                [-0.8125311, 0.5745356, 0.1652194], [-0.9675818, 0.1490712, 0.2432255],
                [-0.1314961, 1, 0.01744268], [-0.8275059, -0.5745356, 0.05232804],
                [-0.9975315, -0.1490712, 0.01744268], [-0.1314961, -1, 0.01744268],
                [0.8275059, 0.5745356, -0.05232804], [0.9975315, 0.1490712, -0.01744268],
                [0.1314961, 1, -0.01744268], [0.8125311, -0.5745356, -0.1652194],
                [0.9675818, -0.1490712, -0.2432255], [0.1314961, -1, -0.01744268],
                [-0.8471082, 0.5393447, -0.09544872], [-1.002159, 0.1138803, -0.01744268],
                [-0.1660732, 0.9648091, -0.2432255], [-0.7225533, -0.6842621, -0.1652194],
                [-0.9298072, -0.3793989, -0.09544872],
                [-0.2923956, -0.9472136, -0.1867798], [0.7929289, 0.5393447, -0.3129962],
                [0.9629544, 0.1138803, -0.2781109], [0.096919, 0.9648091, -0.2781109],
                [0.6544916, -0.6842621, -0.3478816], [0.8727679, -0.3793989, -0.3345566],
                [0.2335888, -0.9472136, -0.2565505], [-0.7450156, 0.5921311, -0.3345566],
                [-0.9419221, 0.309017, -0.1867798], [-0.3241127, 0.8550825, -0.4258876],
                [-0.8248546, -0.4891254, -0.3129962],
                [-0.5181594, -0.8266125, -0.2565505],
                [-0.1903029, -0.8944272, -0.4258876], [0.6320294, 0.5921311, -0.5172187],
                [0.8606531, 0.309017, -0.4258876], [0.2018716, 0.8550825, -0.4956583],
                [0.7147284, -0.4891254, -0.5172187], [0.4333553, -0.8266125, -0.3827669],
                [0.07268925, -0.8944272, -0.460773], [-0.8398294, 0.3618034, -0.4258876],
                [-0.5452491, 0.7127322, -0.460773], [-0.2191601, 0.745356, -0.6434351],
                [-0.722762, -0.436339, -0.552104], [-0.4160667, -0.7738261, -0.4956583],
                [0.6997536, 0.3618034, -0.6301101], [0.4062656, 0.7127322, -0.5869894],
                [0.04383203, 0.745356, -0.6783205], [0.5538289, -0.436339, -0.7214412],
                [0.2724557, -0.7738261, -0.5869894], [-0.7348768, 0.2520769, -0.6434351],
                [-0.4402965, 0.6030057, -0.6783205], [-0.6625252, -0.2412023, -0.7214412],
                [-0.518368, -0.5786893, -0.6434351], [0.541714, 0.2520769, -0.8127722],
                [0.248226, 0.6030057, -0.7696515], [0.4515276, -0.2412023, -0.8692179],
                [0.3326926, -0.5786893, -0.7563265], [-0.6671526, 0.02174919, -0.7563265],
                [-0.5351104, 0.372678, -0.7696515], [-0.4581312, -0.3835526, -0.8127722],
                [0.4469001, 0.02174919, -0.9041033], [0.3159502, 0.372678, -0.8825429],
                [0.2303913, -0.3835526, -0.9041033], [-0.4673861, 0.1423503, -0.8825429],
                [-0.2583647, -0.2629515, -0.9389886], [0.2211363, 0.1423503, -0.973874],
                [0.00462747, -0.2629515, -0.973874], [-0.2629922, 0, -0.973874],
                [0, 0, -1.008759]],
            'edge': [[0, 1], [1, 4], [4, 2], [2, 0], [3, 8], [8, 14], [14, 7], [7, 3],
                [5, 10], [10, 18], [18, 11], [11, 5], [6, 12], [12, 20], [20, 13],
                [13, 6], [9, 17], [17, 25], [25, 16], [16, 9], [15, 24], [24, 35],
                [35, 23], [23, 15], [19, 28], [28, 41], [41, 29], [29, 19], [21, 31],
                [31, 44], [44, 32], [32, 21], [22, 33], [33, 45], [45, 34], [34, 22],
                [26, 38], [38, 50], [50, 37], [37, 26], [27, 40], [40, 51], [51, 39],
                [39, 27], [30, 43], [43, 54], [54, 42], [42, 30], [36, 48], [48, 60],
                [60, 49], [49, 36], [46, 55], [55, 67], [67, 58], [58, 46], [47, 59],
                [59, 65], [65, 53], [53, 47], [52, 64], [64, 73], [73, 61], [61, 52],
                [56, 62], [62, 74], [74, 68], [68, 56], [57, 70], [70, 81], [81, 69],
                [69, 57], [63, 75], [75, 87], [87, 76], [76, 63], [66, 78], [78, 90],
                [90, 79], [79, 66], [71, 82], [82, 94], [94, 83], [83, 71], [72, 85],
                [85, 95], [95, 84], [84, 72], [77, 89], [89, 99], [99, 88], [88, 77],
                [80, 92], [92, 101], [101, 91], [91, 80], [86, 96], [96, 105], [105, 97],
                [97, 86], [93, 102], [102, 110], [110, 103], [103, 93], [98, 107],
                [107, 113], [113, 106], [106, 98], [100, 109], [109, 114], [114, 108],
                [108, 100], [104, 111], [111, 116], [116, 112], [112, 104], [115, 118],
                [118, 119], [119, 117], [117, 115], [2, 6], [13, 8], [3, 0], [1, 5],
                [11, 17], [9, 4], [14, 22], [34, 24], [15, 7], [10, 19], [29, 40],
                [27, 18], [12, 21], [32, 43], [30, 20], [25, 36], [49, 38], [26, 16],
                [35, 47], [53, 41], [28, 23], [31, 37], [50, 62], [56, 44], [33, 46],
                [58, 70], [57, 45], [51, 63], [76, 64], [52, 39], [54, 66], [79, 67],
                [55, 42], [48, 61], [73, 85], [72, 60], [59, 71], [83, 89], [77, 65],
                [74, 86], [97, 92], [80, 68], [81, 93], [103, 94], [82, 69], [75, 88],
                [99, 107], [98, 87], [78, 91], [101, 109], [100, 90], [95, 104],
                [112, 105], [96, 84], [102, 108], [114, 118], [115, 110], [113, 117],
                [119, 116], [111, 106]],
            'face': [[0, 1, 4, 2], [3, 8, 14, 7], [5, 10, 18, 11], [6, 12, 20, 13],
                [9, 17, 25, 16], [15, 24, 35, 23], [19, 28, 41, 29], [21, 31, 44, 32],
                [22, 33, 45, 34], [26, 38, 50, 37], [27, 40, 51, 39], [30, 43, 54, 42],
                [36, 48, 60, 49], [46, 55, 67, 58], [47, 59, 65, 53], [52, 64, 73, 61],
                [56, 62, 74, 68], [57, 70, 81, 69], [63, 75, 87, 76], [66, 78, 90, 79],
                [71, 82, 94, 83], [72, 85, 95, 84], [77, 89, 99, 88], [80, 92, 101, 91],
                [86, 96, 105, 97], [93, 102, 110, 103], [98, 107, 113, 106],
                [100, 109, 114, 108], [104, 111, 116, 112], [115, 118, 119, 117],
                [0, 2, 6, 13, 8, 3], [1, 5, 11, 17, 9, 4], [7, 14, 22, 34, 24, 15],
                [10, 19, 29, 40, 27, 18], [12, 21, 32, 43, 30, 20],
                [16, 25, 36, 49, 38, 26], [23, 35, 47, 53, 41, 28],
                [31, 37, 50, 62, 56, 44], [33, 46, 58, 70, 57, 45],
                [39, 51, 63, 76, 64, 52], [42, 54, 66, 79, 67, 55],
                [48, 61, 73, 85, 72, 60], [59, 71, 83, 89, 77, 65],
                [68, 74, 86, 97, 92, 80], [69, 81, 93, 103, 94, 82],
                [75, 88, 99, 107, 98, 87], [78, 91, 101, 109, 100, 90],
                [84, 95, 104, 112, 105, 96], [102, 108, 114, 118, 115, 110],
                [106, 113, 117, 119, 116, 111], [0, 3, 7, 15, 23, 28, 19, 10, 5, 1],
                [2, 4, 9, 16, 26, 37, 31, 21, 12, 6],
                [8, 13, 20, 30, 42, 55, 46, 33, 22, 14],
                [11, 18, 27, 39, 52, 61, 48, 36, 25, 17],
                [24, 34, 45, 57, 69, 82, 71, 59, 47, 35],
                [29, 41, 53, 65, 77, 88, 75, 63, 51, 40],
                [32, 44, 56, 68, 80, 91, 78, 66, 54, 43],
                [38, 49, 60, 72, 84, 96, 86, 74, 62, 50],
                [58, 67, 79, 90, 100, 108, 102, 93, 81, 70],
                [64, 76, 87, 98, 106, 111, 104, 95, 85, 73],
                [83, 94, 103, 110, 115, 117, 113, 107, 99, 89],
                [92, 97, 105, 112, 116, 119, 118, 114, 109, 101]]
        },
        Rhombicosidodecahedron: {
            'vertex': [[0, 0, 1.026054], [0.447838, 0, 0.9231617],
                [-0.02363976, 0.4472136, 0.9231617], [-0.4050732, 0.190983, 0.9231617],
                [-0.1693344, -0.4145898, 0.9231617], [0.4241982, 0.4472136, 0.8202696],
                [0.7673818, 0.190983, 0.6537868], [0.5552827, -0.4145898, 0.7566788],
                [-0.2312241, 0.7562306, 0.6537868], [-0.5744076, -0.2236068, 0.8202696],
                [-0.6126576, 0.5, 0.6537868], [0.1738492, -0.6708204, 0.7566788],
                [-0.4669629, -0.6381966, 0.6537868], [0.493393, 0.7562306, 0.4873039],
                [0.8748265, -0.2236068, 0.4873039], [0.8365765, 0.5, 0.320821],
                [0.7054921, -0.6381966, 0.3844118], [0.08831973, 0.9472136, 0.3844118],
                [-0.5434628, 0.809017, 0.320821], [-0.8866463, -0.1708204, 0.4873039],
                [-0.9102861, 0.2763932, 0.3844118], [-0.1237794, -0.8944272, 0.4873039],
                [0.3240586, -0.8944272, 0.3844118], [-0.7792016, -0.5854102, 0.320821],
                [0.6289922, 0.809017, 0.05144604], [1.010426, -0.1708204, 0.05144604],
                [0.9867859, 0.2763932, -0.05144604], [0.8410913, -0.5854102, -0.05144604],
                [-0.223919, 1, 0.05144604], [0.223919, 1, -0.05144604],
                [-0.8410913, 0.5854102, 0.05144604], [-0.9867859, -0.2763932, 0.05144604],
                [-1.010426, 0.1708204, -0.05144604], [-0.223919, -1, 0.05144604],
                [0.223919, -1, -0.05144604], [-0.6289922, -0.809017, -0.05144604],
                [0.7792016, 0.5854102, -0.320821], [0.9102861, -0.2763932, -0.3844118],
                [0.8866463, 0.1708204, -0.4873039], [0.5434628, -0.809017, -0.320821],
                [-0.3240586, 0.8944272, -0.3844118], [0.1237794, 0.8944272, -0.4873039],
                [-0.7054921, 0.6381966, -0.3844118], [-0.8365765, -0.5, -0.320821],
                [-0.8748265, 0.2236068, -0.4873039],
                [-0.08831973, -0.9472136, -0.3844118],
                [-0.493393, -0.7562306, -0.4873039], [0.4669629, 0.6381966, -0.6537868],
                [0.6126576, -0.5, -0.6537868], [0.5744076, 0.2236068, -0.8202696],
                [0.2312241, -0.7562306, -0.6537868], [-0.1738492, 0.6708204, -0.7566788],
                [-0.5552827, 0.4145898, -0.7566788], [-0.7673818, -0.190983, -0.6537868],
                [-0.4241982, -0.4472136, -0.8202696], [0.1693344, 0.4145898, -0.9231617],
                [0.4050732, -0.190983, -0.9231617], [0.02363976, -0.4472136, -0.9231617],
                [-0.447838, 0, -0.9231617], [0, 0, -1.026054]],
            'edge': [[0, 2], [2, 3], [3, 0], [1, 6], [6, 5], [5, 1], [4, 9], [9, 12],
                [12, 4], [7, 16], [16, 14], [14, 7], [8, 18], [18, 10], [10, 8], [11, 21],
                [21, 22], [22, 11], [13, 15], [15, 24], [24, 13], [17, 29], [29, 28],
                [28, 17], [19, 31], [31, 23], [23, 19], [20, 30], [30, 32], [32, 20],
                [25, 27], [27, 37], [37, 25], [26, 38], [38, 36], [36, 26], [33, 45],
                [45, 34], [34, 33], [35, 43], [43, 46], [46, 35], [39, 50], [50, 48],
                [48, 39], [40, 41], [41, 51], [51, 40], [42, 52], [52, 44], [44, 42],
                [47, 49], [49, 55], [55, 47], [53, 58], [58, 54], [54, 53], [56, 57],
                [57, 59], [59, 56], [0, 1], [5, 2], [3, 9], [4, 0], [1, 7], [14, 6],
                [2, 8], [10, 3], [12, 21], [11, 4], [6, 15], [13, 5], [7, 11], [22, 16],
                [8, 17], [28, 18], [9, 19], [23, 12], [18, 30], [20, 10], [24, 29],
                [17, 13], [16, 27], [25, 14], [15, 26], [36, 24], [19, 20], [32, 31],
                [21, 33], [34, 22], [31, 43], [35, 23], [37, 38], [26, 25], [27, 39],
                [48, 37], [29, 41], [40, 28], [30, 42], [44, 32], [33, 35], [46, 45],
                [45, 50], [39, 34], [38, 49], [47, 36], [51, 52], [42, 40], [41, 47],
                [55, 51], [43, 53], [54, 46], [52, 58], [53, 44], [50, 57], [56, 48],
                [49, 56], [59, 55], [58, 59], [57, 54]],
            'face': [[0, 2, 3], [1, 6, 5], [4, 9, 12], [7, 16, 14], [8, 18, 10],
                [11, 21, 22], [13, 15, 24], [17, 29, 28], [19, 31, 23], [20, 30, 32],
                [25, 27, 37], [26, 38, 36], [33, 45, 34], [35, 43, 46], [39, 50, 48],
                [40, 41, 51], [42, 52, 44], [47, 49, 55], [53, 58, 54], [56, 57, 59],
                [0, 1, 5, 2], [0, 3, 9, 4], [1, 7, 14, 6], [2, 8, 10, 3], [4, 12, 21, 11],
                [5, 6, 15, 13], [7, 11, 22, 16], [8, 17, 28, 18], [9, 19, 23, 12],
                [10, 18, 30, 20], [13, 24, 29, 17], [14, 16, 27, 25], [15, 26, 36, 24],
                [19, 20, 32, 31], [21, 33, 34, 22], [23, 31, 43, 35], [25, 37, 38, 26],
                [27, 39, 48, 37], [28, 29, 41, 40], [30, 42, 44, 32], [33, 35, 46, 45],
                [34, 45, 50, 39], [36, 38, 49, 47], [40, 51, 52, 42], [41, 47, 55, 51],
                [43, 53, 54, 46], [44, 52, 58, 53], [48, 50, 57, 56], [49, 56, 59, 55],
                [54, 58, 59, 57], [0, 4, 11, 7, 1], [2, 5, 13, 17, 8], [3, 10, 20, 19, 9],
                [6, 14, 25, 26, 15], [12, 23, 35, 33, 21], [16, 22, 34, 39, 27],
                [18, 28, 40, 42, 30], [24, 36, 47, 41, 29], [31, 32, 44, 53, 43],
                [37, 48, 56, 49, 38], [45, 46, 54, 57, 50], [51, 55, 59, 58, 52]]
        },
        SnubDodecahedron: {
            'vertex': [[0, 0, 1.028031], [0.4638569, 0, 0.9174342],
                [0.2187436, 0.4090409, 0.9174342], [-0.2575486, 0.3857874, 0.9174342],
                [-0.4616509, -0.04518499, 0.9174342], [-0.177858, -0.4284037, 0.9174342],
                [0.5726782, -0.4284037, 0.7384841], [0.8259401, -0.04518499, 0.6104342],
                [0.6437955, 0.3857874, 0.702527], [0.349648, 0.7496433, 0.6104342],
                [-0.421009, 0.7120184, 0.6104342], [-0.6783139, 0.3212396, 0.702527],
                [-0.6031536, -0.4466658, 0.702527], [-0.2749612, -0.7801379, 0.6104342],
                [0.1760766, -0.6931717, 0.7384841], [0.5208138, -0.7801379, 0.4206978],
                [0.8552518, -0.4466658, 0.3547998], [1.01294, -0.03548596, 0.1718776],
                [0.7182239, 0.661842, 0.3208868], [0.3633691, 0.9454568, 0.1758496],
                [-0.04574087, 0.9368937, 0.4206978], [-0.4537394, 0.905564, 0.1758496],
                [-0.7792791, 0.5887312, 0.3208868], [-0.9537217, 0.1462217, 0.3547998],
                [-0.9072701, -0.3283699, 0.3547998], [-0.6503371, -0.7286577, 0.3208868],
                [0.08459482, -0.9611501, 0.3547998],
                [0.3949153, -0.9491262, -0.007072558], [0.9360473, -0.409557, -0.1136978],
                [0.9829382, 0.02692292, -0.2999274], [0.9463677, 0.4014808, -0.007072558],
                [0.6704578, 0.7662826, -0.1419366], [-0.05007646, 1.025698, -0.04779978],
                [-0.4294337, 0.8845784, -0.2999274], [-0.9561681, 0.3719321, -0.06525234],
                [-1.022036, -0.1000338, -0.04779978],
                [-0.8659056, -0.5502712, -0.06525234],
                [-0.5227761, -0.8778535, -0.1136978],
                [-0.06856319, -1.021542, -0.09273844],
                [0.2232046, -0.8974878, -0.4489366], [0.6515438, -0.7200947, -0.3373472],
                [0.7969535, -0.3253959, -0.5619888], [0.8066872, 0.4395354, -0.461425],
                [0.4468035, 0.735788, -0.5619888], [0.001488801, 0.8961155, -0.503809],
                [-0.3535403, 0.6537658, -0.7102452], [-0.7399517, 0.5547758, -0.4489366],
                [-0.9120238, 0.1102196, -0.461425], [-0.6593998, -0.6182798, -0.4896639],
                [-0.2490651, -0.8608088, -0.503809], [0.4301047, -0.5764987, -0.734512],
                [0.5057577, -0.1305283, -0.8854492], [0.5117735, 0.3422252, -0.8232973],
                [0.09739587, 0.5771941, -0.8451093], [-0.6018946, 0.2552591, -0.7933564],
                [-0.6879024, -0.2100741, -0.734512], [-0.3340437, -0.5171509, -0.8232973],
                [0.08570633, -0.3414376, -0.9658797], [0.1277354, 0.1313635, -1.011571],
                [-0.3044499, -0.06760332, -0.979586]],
            'edge': [[0, 1], [1, 2], [2, 0], [2, 3], [3, 0], [3, 4], [4, 0], [4, 5],
                [5, 0], [1, 6], [6, 7], [7, 1], [7, 8], [8, 1], [8, 2], [8, 9], [9, 2],
                [3, 10], [10, 11], [11, 3], [11, 4], [4, 12], [12, 5], [12, 13], [13, 5],
                [13, 14], [14, 5], [6, 14], [14, 15], [15, 6], [15, 16], [16, 6], [16, 7],
                [16, 17], [17, 7], [8, 18], [18, 9], [18, 19], [19, 9], [19, 20], [20, 9],
                [10, 20], [20, 21], [21, 10], [21, 22], [22, 10], [22, 11], [22, 23],
                [23, 11], [12, 24], [24, 25], [25, 12], [25, 13], [13, 26], [26, 14],
                [26, 15], [26, 27], [27, 15], [16, 28], [28, 17], [28, 29], [29, 17],
                [29, 30], [30, 17], [18, 30], [30, 31], [31, 18], [31, 19], [19, 32],
                [32, 20], [32, 21], [32, 33], [33, 21], [22, 34], [34, 23], [34, 35],
                [35, 23], [35, 24], [24, 23], [35, 36], [36, 24], [36, 25], [36, 37],
                [37, 25], [26, 38], [38, 27], [38, 39], [39, 27], [39, 40], [40, 27],
                [28, 40], [40, 41], [41, 28], [41, 29], [29, 42], [42, 30], [42, 31],
                [42, 43], [43, 31], [32, 44], [44, 33], [44, 45], [45, 33], [45, 46],
                [46, 33], [34, 46], [46, 47], [47, 34], [47, 35], [36, 48], [48, 37],
                [48, 49], [49, 37], [49, 38], [38, 37], [49, 39], [39, 50], [50, 40],
                [50, 41], [50, 51], [51, 41], [42, 52], [52, 43], [52, 53], [53, 43],
                [53, 44], [44, 43], [53, 45], [45, 54], [54, 46], [54, 47], [54, 55],
                [55, 47], [48, 55], [55, 56], [56, 48], [56, 49], [50, 57], [57, 51],
                [57, 58], [58, 51], [58, 52], [52, 51], [58, 53], [54, 59], [59, 55],
                [59, 56], [59, 57], [57, 56], [59, 58]],
            'face': [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [1, 6, 7], [1, 7, 8],
                [1, 8, 2], [2, 8, 9], [3, 10, 11], [3, 11, 4], [4, 12, 5], [5, 12, 13],
                [5, 13, 14], [6, 14, 15], [6, 15, 16], [6, 16, 7], [7, 16, 17],
                [8, 18, 9], [9, 18, 19], [9, 19, 20], [10, 20, 21], [10, 21, 22],
                [10, 22, 11], [11, 22, 23], [12, 24, 25], [12, 25, 13], [13, 26, 14],
                [14, 26, 15], [15, 26, 27], [16, 28, 17], [17, 28, 29], [17, 29, 30],
                [18, 30, 31], [18, 31, 19], [19, 32, 20], [20, 32, 21], [21, 32, 33],
                [22, 34, 23], [23, 34, 35], [23, 35, 24], [24, 35, 36], [24, 36, 25],
                [25, 36, 37], [26, 38, 27], [27, 38, 39], [27, 39, 40], [28, 40, 41],
                [28, 41, 29], [29, 42, 30], [30, 42, 31], [31, 42, 43], [32, 44, 33],
                [33, 44, 45], [33, 45, 46], [34, 46, 47], [34, 47, 35], [36, 48, 37],
                [37, 48, 49], [37, 49, 38], [38, 49, 39], [39, 50, 40], [40, 50, 41],
                [41, 50, 51], [42, 52, 43], [43, 52, 53], [43, 53, 44], [44, 53, 45],
                [45, 54, 46], [46, 54, 47], [47, 54, 55], [48, 55, 56], [48, 56, 49],
                [50, 57, 51], [51, 57, 58], [51, 58, 52], [52, 58, 53], [54, 59, 55],
                [55, 59, 56], [56, 59, 57], [57, 59, 58], [0, 5, 14, 6, 1],
                [2, 9, 20, 10, 3], [4, 11, 23, 24, 12], [7, 17, 30, 18, 8],
                [13, 25, 37, 38, 26], [15, 27, 40, 28, 16], [19, 31, 43, 44, 32],
                [21, 33, 46, 34, 22], [29, 41, 51, 52, 42], [35, 47, 55, 48, 36],
                [39, 49, 56, 57, 50], [45, 53, 58, 59, 54]]
        },
        /* Other */
        PentagonalPrism: {
            'vertex': [[0, 0, 1.159953], [1.013464, 0, 0.5642542],
                [-0.3501431, 0.9510565, 0.5642542], [-0.7715208, -0.6571639, 0.5642542],
                [0.6633206, 0.9510565, -0.03144481], [0.8682979, -0.6571639, -0.3996071],
                [-1.121664, 0.2938926, -0.03144481], [-0.2348831, -1.063314, -0.3996071],
                [0.5181548, 0.2938926, -0.9953061], [-0.5850262, -0.112257, -0.9953061]],
            'edge': [[0, 1], [1, 4], [4, 2], [2, 0], [2, 6], [6, 3], [3, 0], [1, 5],
                [5, 8], [8, 4], [6, 9], [9, 7], [7, 3], [5, 7], [9, 8]],
            'face': [[0, 1, 4, 2], [0, 2, 6, 3], [1, 5, 8, 4], [3, 6, 9, 7],
                [5, 7, 9, 8], [0, 3, 7, 5, 1], [2, 4, 8, 9, 6]]
        },
        Hebesphenorotunda: {
            'vertex': [[-0.748928, 0.557858, -0.030371],
                [-0.638635, 0.125804, -0.670329], [-0.593696, 0.259282, 0.67329],
                [-0.427424, 0.876636, -0.665507], [-0.373109, -0.604827, -0.606627],
                [-0.32817, -0.471348, 0.736992], [-0.217876, -0.903403, 0.097033],
                [-0.141658, 1.042101, 0.041134], [-0.021021, 0.094954, 1.176701],
                [0.013575, 0.743525, 0.744795], [0.036802, 0.343022, -0.994341],
                [0.267732, -1.036179, -0.498733], [0.302328, -0.387609, -0.93064],
                [0.443205, -0.438661, 0.847867], [0.499183, 0.610749, 0.149029],
                [0.553499, -0.870715, 0.207908], [0.609478, 0.178694, -0.490931],
                [0.76471, -0.119883, 0.212731]],
            'edge': [[11, 12], [12, 16], [16, 17], [17, 15], [15, 11], [11, 4], [4, 12],
                [11, 6], [6, 4], [15, 6], [15, 13], [13, 5], [5, 6], [17, 13], [8, 13],
                [17, 14], [14, 9], [9, 8], [8, 5], [2, 5], [8, 2], [9, 2], [7, 9],
                [14, 7], [7, 0], [0, 2], [16, 14], [16, 10], [10, 3], [3, 7], [3, 0],
                [3, 1], [1, 0], [10, 1], [4, 1], [10, 12]],
            'face': [[12, 11, 4], [11, 6, 4], [6, 11, 15], [13, 15, 17], [5, 13, 8],
                [2, 5, 8], [2, 8, 9], [7, 9, 14], [16, 14, 17], [3, 0, 7], [3, 1, 0],
                [1, 3, 10], [12, 10, 16], [6, 15, 13, 5], [2, 9, 7, 0], [12, 4, 1, 10],
                [11, 12, 16, 17, 15], [8, 13, 17, 14, 9], [16, 10, 3, 7, 14],
                [1, 4, 6, 5, 2, 0]]
        },
        StellatedDodecahedron: {
            vertex: [[.8944, .4472, 0], [.2764, .4472, .8506], [.2764, .4472, -.8506],
                [-.7236, .4472, .5257], [-.7236, .4472, -.5257], [-.3416, .4472, 0],
                [-.1056, .4472, .3249], [-.1056, .4472, -.3249], [.2764, .4472, .2008],
                [.2764, .4472, -.2008], [-.8944, -.4472, 0], [-.2764, -.4472, .8506],
                [-.2764, -.4472, -.8506], [.7236, -.4472, .5257], [.7236, -.4472, -.5257],
                [.3416, -.4472, 0], [.1056, -.4472, .3249], [.1056, -.4472, -.3249],
                [-.2764, -.4472, .2008], [-.2764, -.4472, -.2008], [-.5527, .1058, 0],
                [-.1708, .1058, .5527], [-.1708, .1058, -.5527], [.4471, .1058, .3249],
                [.4471, .1058, -.3249], [.5527, -.1058, 0], [.1708, -.1058, .5527],
                [.1708, -.1058, -.5527], [-.4471, -.1058, .3249],
                [-.4471, -.1058, -.3249], [0, 1, 0], [0, -1, 0]],
            edge: [[0, 8], [8, 9], [0, 9], [2, 7], [7, 9], [2, 9], [4, 5], [5, 7],
                [4, 7], [3, 5], [5, 6], [3, 6], [1, 6], [6, 8], [1, 8], [0, 23], [23, 8],
                [30, 6], [30, 8], [21, 3], [21, 6], [11, 21], [21, 26], [11, 26],
                [13, 23], [23, 26], [13, 26], [2, 24], [24, 9], [30, 9], [1, 23],
                [23, 25], [13, 25], [14, 24], [24, 25], [14, 25], [22, 4], [22, 7],
                [30, 7], [0, 24], [24, 27], [14, 27], [12, 22], [22, 27], [12, 27],
                [20, 3], [20, 5], [30, 5], [2, 22], [22, 29], [12, 29], [10, 20],
                [20, 29], [10, 29], [1, 21], [20, 4], [20, 28], [10, 28], [21, 28],
                [11, 28], [10, 18], [18, 19], [10, 19], [12, 17], [17, 19], [12, 19],
                [14, 15], [15, 17], [14, 17], [13, 15], [15, 16], [13, 16], [11, 16],
                [16, 18], [11, 18], [19, 31], [17, 31], [17, 27], [2, 27], [29, 4],
                [19, 29], [18, 31], [28, 3], [18, 28], [16, 31], [1, 26], [16, 26],
                [15, 31], [0, 25], [15, 25]],
            face: [[0, 9, 8], [2, 7, 9], [4, 5, 7], [3, 6, 5], [1, 8, 6], [0, 8, 23],
                [30, 6, 8], [3, 21, 6], [11, 26, 21], [13, 23, 26], [2, 9, 24],
                [30, 8, 9], [1, 23, 8], [13, 25, 23], [14, 24, 25], [4, 7, 22],
                [30, 9, 7], [0, 24, 9], [14, 27, 24], [12, 22, 27], [3, 5, 20],
                [30, 7, 5], [2, 22, 7], [12, 29, 22], [10, 20, 29], [1, 6, 21],
                [30, 5, 6], [4, 20, 5], [10, 28, 20], [11, 21, 28], [10, 19, 18],
                [12, 17, 19], [14, 15, 17], [13, 16, 15], [11, 18, 16], [31, 19, 17],
                [14, 17, 27], [2, 27, 22], [4, 22, 29], [10, 29, 19], [31, 18, 19],
                [12, 19, 29], [4, 29, 20], [3, 20, 28], [11, 28, 18], [31, 16, 18],
                [10, 18, 28], [3, 28, 21], [1, 21, 26], [13, 26, 16], [31, 15, 16],
                [11, 16, 26], [1, 26, 23], [0, 23, 25], [14, 25, 15], [31, 17, 15],
                [13, 15, 25], [0, 25, 24], [2, 24, 27], [12, 27, 17]]
        }
    };

    // =============================================================================
    const url = '/resources/shared/vendor/three-91.min.js';
    const renderers = {};
    let threePromise;
    function loadTHREE() {
        if (!threePromise)
            threePromise = loadScript(url);
        return threePromise;
    }
    function getRenderer(width, height) {
        const id = [width, height].join(',');
        if (renderers[id])
            return renderers[id];
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.localClippingEnabled = true;
        renderer.setClearColor($html.hasClass('dark-mode') ? 0x22212e : 0xffffff, 1);
        renderer.setSize(width, height);
        return renderers[id] = renderer;
    }
    function create3D($el, fov, width, height = width) {
        return __awaiter(this, void 0, void 0, function* () {
            const $canvas = $N('canvas', { width, height, style: 'max-width: 100%' }, $el);
            const context = $canvas.ctx;
            yield loadTHREE();
            const scene = new THREE.Scene();
            const renderer = getRenderer(width, height);
            const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
            scene.add(camera);
            const callbacks = [];
            const onDraw = (fn) => callbacks.push(fn);
            const add = (obj) => scene.add(obj);
            const draw = () => {
                renderer.render(scene, camera);
                context.clearRect(0, 0, width, height);
                context.drawImage(renderer.domElement, 0, 0);
                for (const fn of callbacks)
                    fn();
            };
            return { $canvas, camera, renderer, draw, onDraw, add };
        });
    }

    // =============================================================================
    // Polyhedron Component
    // (c) Mathigon
    // =============================================================================
    var Solid_1;
    const STROKE_COLOR = 0x666666;
    const LINE_RADIUS = 0.012;
    const LINE_SEGMENTS = 4;
    const POINT_RADIUS = 0.08;
    function rotate($solid, animate = true, speed = 1) {
        // TODO Damping after mouse movement
        // TODO Better mouse-to-point mapping
        // Only Chrome is fast enough to support auto-rotation.
        const autoRotate = animate && Browser.isChrome && !Browser.isMobile;
        $solid.css('cursor', 'grab');
        let dragging = false;
        let visible = false;
        function frame() {
            if (visible && autoRotate)
                requestAnimationFrame(frame);
            $solid.scene.draw();
            if (!dragging)
                $solid.object.rotation.y += speed * 0.012;
        }
        if (autoRotate) {
            $solid.scene.$canvas.on('enterViewport', () => { visible = true; frame(); });
            $solid.scene.$canvas.on('exitViewport', () => { visible = false; });
        }
        else {
            setTimeout(frame);
        }
        // The 1.1 creates rotations that are slightly faster than the mouse/finger.
        const s = Math.PI / 2 / $solid.scene.$canvas.width * 1.1;
        slide($solid.scene.$canvas, {
            start() {
                dragging = true;
                $html.addClass('grabbing');
            },
            move(posn, start, last) {
                const d = posn.subtract(last).scale(s);
                const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(d.y, d.x));
                $solid.object.quaternion.multiplyQuaternions(q, $solid.object.quaternion);
                $solid.trigger('rotate', { quaternion: $solid.object.quaternion });
                if (!autoRotate)
                    frame();
            },
            end() {
                dragging = false;
                $html.removeClass('grabbing');
            }
        });
    }
    function createEdges(geometry, material, maxAngle) {
        const obj = new THREE.Object3D();
        if (!maxAngle)
            return obj;
        const edges = new THREE.EdgesGeometry(geometry, maxAngle);
        const edgeData = edges.attributes.position.array;
        const points = chunk(chunk(edgeData, 3).map(p => new THREE.Vector3(...p)), 2);
        for (const edge of points) {
            const curve = new THREE.LineCurve3(edge[0], edge[1]);
            const geometry = new THREE.TubeGeometry(curve, 1, LINE_RADIUS, LINE_SEGMENTS);
            obj.add(new THREE.Mesh(geometry, material));
        }
        return obj;
    }
    // -----------------------------------------------------------------------------
    // Custom Element
    let Solid = Solid_1 = class Solid extends CustomElementView {
        constructor() {
            super(...arguments);
            this.isReady = false;
        }
        ready() {
            return __awaiter(this, void 0, void 0, function* () {
                const size = this.attr('size').split(',');
                const width = +size[0];
                const height = size.length > 1 ? +size[1] : width;
                this.css({ width: width + 'px', height: height + 'px' });
                this.scene = yield create3D(this, 35, 2 * width, 2 * height);
                this.scene.camera.position.set(0, 3, 6);
                this.scene.camera.up = new THREE.Vector3(0, 1, 0);
                this.scene.camera.lookAt(new THREE.Vector3(0, 0, 0));
                const light1 = new THREE.AmbientLight(0x555555);
                this.scene.add(light1);
                const light2 = new THREE.PointLight(0xffffff);
                light2.position.set(3, 4.5, 6);
                this.scene.add(light2);
                this.object = new THREE.Object3D();
                this.scene.add(this.object);
                this.trigger('loaded');
                this.isReady = true;
            });
        }
        addMesh(fn) {
            if (this.isReady) {
                this.addMeshCallback(fn);
            }
            else {
                this.one('loaded', () => this.addMeshCallback(fn));
            }
        }
        addMeshCallback(fn) {
            const items = fn(this.scene) || [];
            for (const i of items)
                this.object.add(i);
            if (!this.hasAttr('static')) {
                const speed = +this.attr('rotate') || 1;
                rotate(this, this.hasAttr('rotate'), speed);
            }
            this.scene.draw();
        }
        rotate(q) {
            this.object.quaternion.set(q.x, q.y, q.z, q.w);
            this.scene.draw();
        }
        // ---------------------------------------------------------------------------
        // Element Creation Utilities
        addLabel(text, posn, color = STROKE_COLOR, margin = '') {
            const $label = $N('div', { text, class: 'label3d' });
            $label.css('color', '#' + color.toString(16).padStart(6, '0'));
            if (margin)
                $label.css('margin', margin);
            let posn1 = new THREE.Vector3(...posn);
            this.scene.$canvas.insertAfter($label);
            this.scene.onDraw(() => {
                const p = posn1.clone().applyQuaternion(this.object.quaternion)
                    .add(this.object.position).project(this.scene.camera);
                $label.css('left', (1 + p.x) * this.scene.$canvas.width / 2 + 'px');
                $label.css('top', (1 - p.y) * this.scene.$canvas.height / 2 + 'px');
            });
            return {
                updatePosition(posn) {
                    posn1 = new THREE.Vector3(...posn);
                }
            };
        }
        addArrow(from, to, color = STROKE_COLOR) {
            const material = new THREE.MeshBasicMaterial({ color });
            const obj = new THREE.Object3D();
            const height = new THREE.Vector3(...from).distanceTo(new THREE.Vector3(...to));
            const line = new THREE.CylinderGeometry(0.02, 0.02, height - 0.3, 8, 1, true);
            obj.add(new THREE.Mesh(line, material));
            const start = new THREE.ConeGeometry(0.1, 0.15, 16, 1);
            start.translate(0, height / 2 - 0.1, 0);
            obj.add(new THREE.Mesh(start, material));
            const end = new THREE.ConeGeometry(0.1, 0.15, 16, 1);
            end.rotateX(Math.PI);
            end.translate(0, -height / 2 + 0.1, 0);
            obj.add(new THREE.Mesh(end, material));
            obj.updateEnds = function (f, t) {
                // TODO Support changing the height of the arrow.
                const q = new THREE.Quaternion();
                const v = new THREE.Vector3(t[0] - f[0], t[1] - f[1], t[2] - f[2]).normalize();
                q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
                obj.setRotationFromQuaternion(q);
                obj.position.set((f[0] + t[0]) / 2, (f[1] + t[1]) / 2, (f[2] + t[2]) / 2);
            };
            obj.updateEnds(from, to);
            this.object.add(obj);
            return obj;
        }
        addCircle(radius, color = STROKE_COLOR, segments = 64) {
            const path = new THREE.Curve();
            path.getPoint = function (t) {
                const a = 2 * Math.PI * t;
                return new THREE.Vector3(radius * Math.cos(a), radius * Math.sin(a), 0);
            };
            const material = new THREE.MeshBasicMaterial({ color });
            const geometry = new THREE.TubeGeometry(path, segments, LINE_RADIUS, LINE_SEGMENTS);
            const mesh = new THREE.Mesh(geometry, material);
            this.object.add(mesh);
            return mesh;
        }
        addPoint(position, color = STROKE_COLOR) {
            const material = new THREE.MeshBasicMaterial({ color });
            const geometry = new THREE.SphereGeometry(POINT_RADIUS, 16, 16);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...position);
            this.object.add(mesh);
        }
        addSolid(geo, color, maxAngle = 5, flatShading = false) {
            const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const edges = new THREE.EdgesGeometry(geo, maxAngle);
            const obj = new THREE.Object3D();
            obj.add(new THREE.LineSegments(edges, edgeMaterial));
            obj.add(new THREE.Mesh(geo, Solid_1.solidMaterial(color, flatShading)));
            this.object.add(obj);
            return obj;
        }
        // TODO merge addOutlined() and addWireframe(), by looking at
        //      geometry.isConeGeometry etc.
        // A translucent material with a solid border.
        addOutlined(geo, color = 0xaaaaaa, maxAngle = 5, opacity = 0.1, strokeColor) {
            const solidMaterial = Solid_1.translucentMaterial(color, opacity);
            const solid = new THREE.Mesh(geo, solidMaterial);
            const edgeMaterial = new THREE.MeshBasicMaterial({ color: strokeColor || STROKE_COLOR });
            let edges = createEdges(geo, edgeMaterial, maxAngle);
            const obj = new THREE.Object3D();
            obj.add(solid, edges);
            obj.setClipPlanes = function (planes) {
                solidMaterial.clippingPlanes = planes;
            };
            obj.updateGeometry = function (geo) {
                solid.geometry.dispose();
                solid.geometry = geo;
                obj.remove(edges);
                edges = createEdges(geo, edgeMaterial, maxAngle);
                obj.add(edges);
            };
            this.object.add(obj);
            return obj;
        }
        // Like .addOutlined, but we also add outlines for curved edges (e.g. of
        // a sphere or cylinder).
        addWireframe(geometry, color = 0xaaaaaa, maxAngle = 5, opacity = 0.1) {
            const solid = this.addOutlined(geometry, color, maxAngle, opacity);
            const outlineMaterial = new THREE.MeshBasicMaterial({
                color: STROKE_COLOR,
                side: THREE.BackSide
            });
            outlineMaterial.onBeforeCompile = function (shader) {
                const token = '#include <begin_vertex>';
                const customTransform = '\nvec3 transformed = position + vec3(normal) * 0.02;\n';
                shader.vertexShader = shader.vertexShader.replace(token, customTransform);
            };
            const outline = new THREE.Mesh(geometry, outlineMaterial);
            const knockoutMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.BackSide
            });
            const knockout = new THREE.Mesh(geometry, knockoutMaterial);
            const obj = new THREE.Object3D();
            obj.add(solid, outline, knockout);
            obj.setClipPlanes = function (planes) {
                if (solid.setClipPlanes)
                    solid.setClipPlanes(planes);
                for (const m of [outlineMaterial, knockoutMaterial])
                    m.clippingPlanes = planes;
            };
            obj.updateGeometry = function (geo) {
                if (solid.updateGeometry)
                    solid.updateGeometry(geo);
                for (const mesh of [outline, knockout]) {
                    mesh.geometry.dispose();
                    mesh.geometry = geo;
                }
            };
            this.object.add(obj);
            return obj;
        }
        // ---------------------------------------------------------------------------
        // Materials
        static solidMaterial(color, flatShading = false) {
            return new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
                specular: 0x222222,
                // depthWrite: false,
                color, flatShading
            });
        }
        static translucentMaterial(color, opacity = 0.1) {
            return new THREE.MeshLambertMaterial({
                side: THREE.DoubleSide,
                transparent: true,
                depthWrite: false,
                opacity, color
            });
        }
    };
    Solid = Solid_1 = __decorate([
        register('x-solid')
    ], Solid);

    // =============================================================================
    const colours = {
        3: 0xfd8c00,
        4: 0x0f82f2,
        5: 0x22ab24,
        6: 0xcd0e66,
        8: 0x6d3bbf,
        10: 0x009ea6 // teal
    };
    const scales = {
        StellatedDodecahedron: 2,
        Octahedron: 1.3,
        Tetrahedron: 1.1
    };
    let Polyhedron = class Polyhedron extends Solid {
        created() {
            const shape = this.attr('shape');
            const data = PolyhedronData[shape];
            if (!data)
                return console.error('Unknown polyhedron:', shape);
            const scale = scales[shape] || 1.65;
            this.setAttr('rotate', '1');
            this.addMesh(() => {
                const polyhedron = new THREE.Object3D();
                const vertices = data.vertex.map(v => new THREE.Vector3(v[0], v[1], v[2]).multiplyScalar(scale));
                const faceGeometry = new THREE.Geometry();
                faceGeometry.vertices = vertices;
                for (const f of data.face) {
                    for (let i = 1; i < f.length - 1; i++) {
                        const face = new THREE.Face3(f[0], f[i], f[i + 1]);
                        face.color = new THREE.Color(colours[f.length]);
                        faceGeometry.faces.push(face);
                    }
                }
                faceGeometry.computeFaceNormals();
                faceGeometry.computeVertexNormals();
                const faceMaterial = new THREE.MeshPhongMaterial({
                    vertexColors: THREE.FaceColors,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.9,
                    specular: 0x222222,
                    flatShading: true
                });
                polyhedron.add(new THREE.Mesh(faceGeometry, faceMaterial));
                for (const e of data.edge) {
                    const edgeGeometry = new THREE.Geometry();
                    edgeGeometry.vertices = [vertices[e[0]], vertices[e[1]]];
                    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
                    const edge = new THREE.Line(edgeGeometry, edgeMaterial);
                    polyhedron.add(edge);
                }
                return [polyhedron];
            });
        }
    };
    Polyhedron = __decorate([
        register('x-polyhedron')
    ], Polyhedron);

    // =============================================================================
    // Polyhedron Folding Data
    // (c) Mathigon
    // =============================================================================
    // Data from https://github.com/paaatrick/polyhedra-folding/tree/master/poly
    const FoldingData = {
        Tetrahedron: {
            net: [
                [1, 2, 4],
                [3, 1, 4],
                [1, 0, 2],
                [4, 2, 5]
            ],
            hinges: [
                [0, 0, 2, 2, 1.2309594173407747],
                [0, 1, 3, 0, 1.2309594173407747],
                [0, 2, 1, 1, 1.2309594173407747]
            ],
            vertices: [
                [-1, -.577350269189626, 0],
                [-.5, .288675134594813, 0],
                [0, -.577350269189626, 0],
                [0, 1.15470053837925, 0],
                [.5, .288675134594813, 0],
                [1, -.577350269189626, 0]
            ]
        },
        Cube: {
            net: [
                [4, 3, 7, 8],
                [5, 4, 8, 9],
                [1, 0, 3, 4],
                [3, 2, 6, 7],
                [8, 7, 10, 11],
                [11, 10, 12, 13]
            ],
            hinges: [
                [0, 0, 2, 2, 1.5707963267948966],
                [0, 1, 3, 3, 1.5707963267948966],
                [0, 2, 4, 0, 1.5707963267948966],
                [0, 3, 1, 1, 1.5707963267948966],
                [5, 0, 4, 2, 1.5707963267948966]
            ],
            vertices: [
                [-1.5, -.5, 0],
                [-1.5, .5, 0],
                [-.5, -1.5, 0],
                [-.5, -.5, 0],
                [-.5, .5, 0],
                [-.5, 1.5, 0],
                [.5, -1.5, 0],
                [.5, -.5, 0],
                [.5, .5, 0],
                [.5, 1.5, 0],
                [1.5, -.5, 0],
                [1.5, .5, 0],
                [2.5, -.5, 0],
                [2.5, .5, 0]
            ]
        },
        Octahedron: {
            net: [
                [1, 5, 6],
                [1, 6, 2],
                [2, 6, 7],
                [6, 9, 7],
                [0, 2, 3],
                [2, 7, 3],
                [3, 7, 8],
                [3, 8, 4]
            ],
            hinges: [
                [0, 2, 1, 0, 1.9106332362490186],
                [1, 1, 2, 0, 1.9106332362490186],
                [2, 1, 3, 2, 1.9106332362490186],
                [2, 2, 5, 0, 1.9106332362490186],
                [4, 1, 5, 2, 1.9106332362490186],
                [6, 0, 5, 1, 1.9106332362490186],
                [7, 0, 6, 2, 1.9106332362490186]
            ],
            vertices: [
                [-1.44337567297406, 1.5, 0],
                [-.577350269189626, 0, 0],
                [-.577350269189626, 1, 0],
                [-.577350269189626, 2, 0],
                [-.577350269189626, 3, 0],
                [.288675134594813, -.5, 0],
                [.288675134594813, .5, 0],
                [.288675134594813, 1.5, 0],
                [.288675134594813, 2.5, 0],
                [1.15470053837925, 1, 0]
            ]
        },
        Dodecahedron: {
            net: [
                [10, 16, 23, 24, 17],
                [37, 32, 24, 23, 31],
                [25, 18, 17, 24, 30],
                [4, 3, 10, 17, 11],
                [1, 9, 16, 10, 2],
                [22, 29, 23, 16, 15],
                [15, 8, 14, 21, 22],
                [0, 5, 13, 14, 6],
                [12, 19, 20, 13, 7],
                [33, 34, 27, 20, 26],
                [36, 28, 21, 27, 35],
                [27, 21, 14, 13, 20]
            ],
            hinges: [
                [0, 0, 4, 2, 2.0344439357957027],
                [0, 1, 5, 2, 2.0344439357957027],
                [0, 2, 1, 2, 2.0344439357957027],
                [0, 3, 2, 2, 2.0344439357957027],
                [0, 4, 3, 2, 2.0344439357957027],
                [5, 4, 6, 4, 2.0344439357957027],
                [11, 0, 10, 2, 2.0344439357957027],
                [11, 1, 6, 2, 2.0344439357957027],
                [11, 2, 7, 2, 2.0344439357957027],
                [11, 3, 8, 2, 2.0344439357957027],
                [11, 4, 9, 2, 2.0344439357957027]
            ],
            vertices: [
                [-1.80170732464719, -3.92705098312484, 0],
                [-1.80170732464719, -1.30901699437495, 0],
                [-1.80170732464719, -.309016994374947, 0],
                [-1.80170732464719, .309016994374947, 0],
                [-1.80170732464719, 1.30901699437495, 0],
                [-1.21392207235472, -4.73606797749979, 0],
                [-1.21392207235472, -3.11803398874989, 0],
                [-.85065080835204001, -5.23606797749979, 0],
                [-.85065080835204001, -2.61803398874989, 0],
                [-.85065080835204001, -1.61803398874989, 0],
                [-.85065080835204001, 0, 0],
                [-.85065080835204001, 1.61803398874989, 0],
                [-.262865556059567, -6.04508497187474, 0],
                [-.262865556059567, -4.42705098312484, 0],
                [-.262865556059567, -3.42705098312484, 0],
                [-.262865556059567, -1.80901699437495, 0],
                [-.262865556059567, -.80901699437494701, 0],
                [-.262865556059567, .80901699437494701, 0],
                [-.262865556059567, 1.80901699437495, 0],
                [.688190960235587, -5.73606797749979, 0],
                [.688190960235587, -4.73606797749979, 0],
                [.688190960235587, -3.11803398874989, 0],
                [.688190960235587, -2.11803398874989, 0],
                [.688190960235587, -.5, 0],
                [.688190960235587, .5, 0],
                [.688190960235587, 2.11803398874989, 0],
                [1.27597621252806, -5.54508497187474, 0],
                [1.27597621252806, -3.92705098312484, 0],
                [1.27597621252806, -2.30901699437495, 0],
                [1.27597621252806, -1.30901699437495, 0],
                [1.27597621252806, 1.30901699437495, 0],
                [1.63924747653074, -.80901699437494701, 0],
                [1.63924747653074, .80901699437494701, 0],
                [2.22703272882321, -5.23606797749979, 0],
                [2.22703272882321, -4.23606797749979, 0],
                [2.22703272882321, -3.61803398874989, 0],
                [2.22703272882321, -2.61803398874989, 0],
                [2.22703272882321, 0, 0]
            ]
        },
        Icosahedron: {
            net: [
                [0, 5, 6],
                [5, 11, 12],
                [1, 6, 7],
                [6, 12, 13],
                [2, 7, 8],
                [7, 13, 14],
                [3, 8, 9],
                [8, 14, 15],
                [4, 9, 10],
                [9, 15, 16],
                [12, 6, 5],
                [17, 12, 11],
                [13, 7, 6],
                [18, 13, 12],
                [14, 8, 7],
                [19, 14, 13],
                [15, 9, 8],
                [20, 15, 14],
                [16, 10, 9],
                [21, 16, 15]
            ],
            hinges: [
                [0, 1, 10, 1, 2.4118649973628269],
                [10, 2, 1, 2, 2.4118649973628269],
                [1, 1, 11, 1, 2.4118649973628269],
                [2, 1, 12, 1, 2.4118649973628269],
                [12, 2, 3, 2, 2.4118649973628269],
                [3, 1, 13, 1, 2.4118649973628269],
                [10, 0, 3, 0, 2.4118649973628269],
                [4, 1, 14, 1, 2.4118649973628269],
                [14, 2, 5, 2, 2.4118649973628269],
                [5, 1, 15, 1, 2.4118649973628269],
                [12, 0, 5, 0, 2.4118649973628269],
                [6, 1, 16, 1, 2.4118649973628269],
                [16, 2, 7, 2, 2.4118649973628269],
                [7, 1, 17, 1, 2.4118649973628269],
                [14, 0, 7, 0, 2.4118649973628269],
                [8, 1, 18, 1, 2.4118649973628269],
                [18, 2, 9, 2, 2.4118649973628269],
                [9, 1, 19, 1, 2.4118649973628269],
                [16, 0, 9, 0, 2.4118649973628269]
            ],
            vertices: [
                [-.577350269189626, 0, 0],
                [-.577350269189626, 1, 0],
                [-.577350269189626, 2, 0],
                [-.577350269189626, 3, 0],
                [-.577350269189626, 4, 0],
                [.288675134594813, -.5, 0],
                [.288675134594813, .5, 0],
                [.288675134594813, 1.5, 0],
                [.288675134594813, 2.5, 0],
                [.288675134594813, 3.5, 0],
                [.288675134594813, 4.5, 0],
                [1.15470053837925, -1, 0],
                [1.15470053837925, 0, 0],
                [1.15470053837925, 1, 0],
                [1.15470053837925, 2, 0],
                [1.15470053837925, 3, 0],
                [1.15470053837925, 4, 0],
                [2.02072594216369, -.5, 0],
                [2.02072594216369, .5, 0],
                [2.02072594216369, 1.5, 0],
                [2.02072594216369, 2.5, 0],
                [2.02072594216369, 3.5, 0]
            ]
        }
    };

    // =============================================================================
    const colours$1 = {
        3: 0xfd8c00,
        4: 0x0f82f2,
        5: 0x22ab24,
        6: 0xcd0e66,
        8: 0x6d3bbf,
        10: 0x009ea6 // teal
    };
    function drawFace(face, vertices) {
        const faceGeometry = new THREE.Geometry();
        faceGeometry.vertices = vertices;
        for (let i = 1; i < face.length - 1; i++) {
            const faceObj = new THREE.Face3(face[0], face[i], face[i + 1]);
            faceObj.color = new THREE.Color(colours$1[face.length]);
            faceGeometry.faces.push(faceObj);
        }
        faceGeometry.computeFaceNormals();
        faceGeometry.computeVertexNormals();
        return faceGeometry;
    }
    function getFolding(data) {
        const vertices = data.vertices.map(v => new THREE.Vector3(...v));
        const hinges = data.hinges;
        function buildTree(f, side = 0, angle = Math.PI, parent) {
            const node = new THREE.Object3D();
            node.name = '' + f;
            const face = data.net[f];
            const faceGeometry = drawFace(face, vertices);
            const faceMaterial = new THREE.MeshPhongMaterial({
                vertexColors: THREE.FaceColors,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
                specular: 0x222222,
                flatShading: true
            });
            node.add(new THREE.Mesh(faceGeometry, faceMaterial));
            const s1 = face[side];
            const s2 = face[(side + 1) % face.length];
            node.userData = {
                offset: vertices[s1],
                axis: new THREE.Vector3().subVectors(vertices[s2], vertices[s1]).clone().normalize(),
                amount: angle
            };
            const parentName = (parent === undefined) ? -1 : parent.name;
            for (let n = 0; n < hinges.length; n++) {
                const hinge = hinges[n];
                if (hinge[0] === f && hinge[2] !== parentName) {
                    buildTree(hinge[2], hinge[3], hinge[4], node);
                }
                else if (hinge[2] === f && hinge[0] !== parentName) {
                    buildTree(hinge[0], hinge[1], hinge[4], node);
                }
            }
            if (parent)
                parent.add(node);
            return node;
        }
        return buildTree(hinges[0][0]);
    }
    function updateHinges(polyhedron, p) {
        polyhedron.traverse((obj) => {
            const u = obj.userData;
            if (u.offset)
                return;
            const t1 = new THREE.Matrix4().makeTranslation(-u.offset.x, -u.offset.y, -u.offset.z);
            const r = new THREE.Matrix4().makeRotationAxis(u.axis, p * (Math.PI - u.amount));
            const t2 = new THREE.Matrix4().makeTranslation(u.offset.x, u.offset.y, u.offset.z);
            obj.matrix = new THREE.Matrix4().multiplyMatrices(t2, r).multiply(t1);
            obj.matrixAutoUpdate = false;
            obj.matrixWorldNeedsUpdate = true;
        });
    }
    // -----------------------------------------------------------------------------
    let Folding = class Folding extends CustomElementView {
        ready() {
            return __awaiter(this, void 0, void 0, function* () {
                const size = +this.attr('size');
                const shape = this.attr('shape');
                this.css({ width: size + 'px' });
                const data = FoldingData[shape];
                if (!data)
                    return console.error('Unknown folding:', shape);
                const scene = yield create3D(this, 35, 2 * size);
                scene.camera.position.set(0, 0, 25);
                scene.camera.up = new THREE.Vector3(0, -1, 0);
                scene.camera.lookAt(0, 0, 0);
                const polyhedron = getFolding(data);
                scene.add(polyhedron);
                const $slider = $N('x-slider', { steps: 100 }, this);
                $slider.on('move', p => {
                    updateHinges(polyhedron, p / 100);
                    const a = 0.5 * (p / 100) * Math.PI / 2;
                    const r = 25 - p / 100 * 15;
                    scene.camera.position.set(0, r * Math.sin(a), r * Math.cos(a));
                    scene.camera.lookAt(0, 0, 0);
                });
            });
        }
    };
    Folding = __decorate([
        register('x-folding')
    ], Folding);

    // =============================================================================
    class Burst {
        constructor($svg, items = 20) {
            this.isAnimating = false;
            this.$ring = $N('circle', { opacity: 0.6 }, $svg);
            this.$lines =
                tabulate(() => $N('line', { 'stroke-width': 2 }, $svg), items);
        }
        play(time = 1000, center = [80, 80], radius = [0, 80]) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isAnimating)
                    return;
                this.isAnimating = true;
                const n = this.$lines.length;
                this.$ring.setCenter({ x: center[0], y: center[1] });
                yield animate((p) => {
                    const q = ease('sine-out', p);
                    this.$ring.setAttr('r', radius[0] + 0.6 * q * radius[1]);
                    this.$ring.setAttr('stroke-width', 0.25 * (1 - q) * radius[1]);
                    const r = ease('exp-out', p);
                    const r1 = radius[0] + (0.2 + 0.8 * r) * radius[1];
                    const r2 = radius[0] + (0.55 + 0.45 * r) * radius[1];
                    for (let i = 0; i < n; ++i) {
                        const c = Math.cos(Math.PI * 2 * i / n);
                        const s = Math.sin(Math.PI * 2 * i / n);
                        this.$lines[i].setLine({ x: center[0] + c * r1, y: center[1] + s * r1 }, { x: center[0] + c * r2, y: center[1] + s * r2 });
                    }
                }, time).promise;
                this.isAnimating = false;
            });
        }
    }

    // =============================================================================
    let Anibutton = class Anibutton extends CustomElementView {
        ready() {
            const $svg = $N('svg', { width: 160, height: 160 }, this);
            this.$text = $N('span', { html: this.attr('text') }, this);
            this.burst = new Burst($svg, 20);
            this.on('attr:text', e => this.$text.text = e.newVal);
        }
        play() {
            if (this.burst.isAnimating)
                return;
            animate(p => {
                const s = p < 0.3 ? 0 : ease('elastic-out', 1.43 * p - 0.43);
                this.$text.css('transform', `scale(${s})`);
            }, 1000);
            this.burst.play(1000, [80, 80], [0, 80]);
        }
    };
    Anibutton = __decorate([
        register('x-anibutton', { attributes: ['text'] })
    ], Anibutton);

    // =============================================================================
    function internalAngles(polygon) {
        const n = polygon.points.length;
        return polygon.points.map((p, i) => {
            const a = polygon.points[(i + 1) % n];
            const b = polygon.points[(i - 1 + n) % n];
            return Math.round(new Angle(a, p, b).deg);
        });
    }
    function angles($step) {
        const totals = [360, 540];
        const $buttons = $step.$$('x-anibutton');
        const overlap = [false, false];
        for (const [i, $b] of $buttons.entries()) {
            $step.model.watch(() => $b.setAttr('text', '???'));
            $b.on('click', () => {
                if (overlap[i])
                    return $step.addHint('no-overlap', { force: true });
                $b.play();
                $b.setAttr('text', totals[i] + '°');
                $step.score('angle-' + i);
            });
        }
        $step.model.setComputed('a1', (m) => internalAngles(m.p1));
        $step.model.setComputed('a2', (m) => internalAngles(m.p2));
        $step.model.watch((s) => {
            overlap[0] = total(s.a1) > 361;
            overlap[1] = total(s.a2) >= 541;
            if (overlap[0] || overlap[1])
                $step.addHint('no-overlap');
        });
        $buttons[0].one('click', () => $step.addHint('angles-repeat'));
    }
    function regularArea($step) {
        $step.model.assign({
            toWord,
            tan: Math.tan,
            regular: (c, r, n) => Polygon.regular(n, r).translate(c)
        });
    }
    function regular2($step) {
        $step.model.round = Math.round;
    }
    // -----------------------------------------------------------------------------
    function midsegments($step) {
        return __awaiter(this, void 0, void 0, function* () {
            const $geopad = $step.$('x-geopad');
            $geopad.switchTool('point');
            const a = yield $geopad.waitForPoint();
            let b = yield $geopad.waitForPoint();
            let c = yield $geopad.waitForPoint();
            let d = yield $geopad.waitForPoint();
            // Reorder the points to be clockwise.
            if (Segment.intersect(new Segment(a.value, b.value), new Segment(c.value, d.value))) {
                [b, c] = [c, b];
            }
            else if (Segment.intersect(new Segment(a.value, d.value), new Segment(b.value, c.value))) {
                [c, d] = [d, c];
            }
            $step.score('points');
            $geopad.switchTool('move');
            const pointStr = [a, b, c, d].map(p => p.name).join(',');
            $geopad.drawPath(`polygon(${pointStr})`, { name: 'quad', animated: 1000 });
            yield $step.onScore('blank-0');
            for (let i = 0; i < 4; ++i) {
                $geopad.drawPoint(`quad.edges[${i}].midpoint`, { name: `m${i}`, classes: 'red', interactive: false });
            }
            $geopad.drawPath(`polygon(m0,m1,m2,m3)`, { classes: 'red', name: 'p0', animated: 1000 });
            yield $step.onScore('blank-1');
            $geopad.showGesture(a.name, c.name);
            // Two possible diagonals:
            const s1 = new Segment(a.value, c.value);
            const s2 = new Segment(b.value, d.value);
            $geopad.switchTool('line');
            let orientation = 0;
            const diagonal = yield $geopad.waitForPath((p) => {
                if (!isLineLike(p))
                    return false;
                orientation = p.equals(s1) ? 1 : p.equals(s2) ? 2 : 0;
                return orientation > 0;
            }, { onIncorrect: () => $step.addHint('not-a-diagonal') });
            diagonal.$el.setAttr('target', 'parallel');
            $step.score('diagonal');
            $geopad.switchTool('move');
            const [a1, b1, c1, d1] = [a, b, c, d].map(p => p.name);
            const o = (orientation === 1);
            $geopad.drawPath(`segment(m0,m1)`, { classes: 'transparent red', target: o ? 'midsegment parallel' : 'other' });
            $geopad.drawPath(`segment(m2,m3)`, { classes: 'transparent red', target: o ? 'midsegment parallel' : 'other' });
            $geopad.drawPath(`segment(m1,m2)`, { classes: 'transparent red', target: !o ? 'midsegment parallel' : 'other' });
            $geopad.drawPath(`segment(m0,m3)`, { classes: 'transparent red', target: !o ? 'midsegment parallel' : 'other' });
            $geopad.drawPath(`segment(${o ? b1 : a1},${o ? d1 : c1})`, { classes: 'transparent', target: 'other' });
            $geopad.drawPath(`polygon(${b1},${o ? c1 : d1},${a1})`, { classes: 'fill green transparent', target: 'triangle' });
            $geopad.drawPath(`polygon(${c1},${d1},${o ? a1 : b1})`, { classes: 'fill yellow transparent', target: 'triangle' });
        });
    }
    function parallelogramsProof($step) {
        return __awaiter(this, void 0, void 0, function* () {
            const $geo1 = $step.$$('x-geopad')[0];
            const model = $step.model;
            $geo1.showGesture('a', 'c');
            $geo1.switchTool('line');
            model.o = false;
            const diagonal = yield $geo1.waitForPath((path) => {
                if (!isLineLike(path))
                    return false;
                const d1 = path.equals(new Segment(model.b, model.d));
                const d2 = path.equals(new Segment(model.a, model.c));
                model.o = d2;
                return d1 || d2;
            }, { onIncorrect: () => $step.addHint('not-a-diagonal-1') });
            diagonal.$el.setAttr('target', 'diagonal');
            $step.score('diagonal');
            $geo1.switchTool('move');
        });
    }
    function quadrilateralsArea($step) {
        const $geopads = $step.$$('x-geopad');
        $geopads[0].switchTool('rectangle');
        $geopads[0].on('add:path', ({ path }) => {
            if (path.value.w === 8 && path.value.h === 6) {
                $geopads[0].animatePoint(path.components[0].name, new Point(2, 3));
                $geopads[0].animatePoint(path.components[1].name, new Point(10, 9));
                $step.addHint('correct');
                $step.score('draw-1');
                $geopads[0].switchTool('move');
            }
            else {
                $step.addHint('incorrect');
                path.delete();
            }
        });
        $geopads[1].switchTool('rectangle');
        $geopads[1].on('add:path', ({ path }) => {
            if (path.value.w * path.value.h === 48) {
                $geopads[1].animatePoint(path.components[0].name, new Point(3, 3));
                $geopads[1].animatePoint(path.components[1].name, new Point(11, 9));
                $step.addHint('correct');
                $step.score('draw-2');
                $geopads[1].switchTool('move');
            }
            else {
                $step.addHint('incorrect');
                path.delete();
            }
        });
    }
    // -----------------------------------------------------------------------------
    function tessellationDrawing($step) {
        const $polypad = $step.$('x-polypad');
        const $overlayTiles = $('.overlay .tiles');
        // TODO Save and restore progress
        let polygons = 0;
        for (const $a of $step.$$('.tessellation .add')) {
            $polypad.bindSource($a, 'polygon', $a.data.shape, $overlayTiles);
            $a.$('svg').setAttr('viewBox', '0 0 80 80');
        }
        const [$clear, $download] = $step.$$('.tessellation .btn');
        $clear.on('click', () => $polypad.clear());
        $download.on('click', () => $polypad.$svg.downloadImage('tessellation.png'));
        $polypad.on('move-selection rotate-selection add-tile', () => {
            const tiles = Array.from($polypad.tiles);
            for (const t of tiles)
                t.$body.removeClass('overlap');
            const n = tiles.length;
            for (let i = 0; i < n; ++i) {
                for (let j = i + 1; j < n; ++j) {
                    if (Point.distance(tiles[i].posn, tiles[j].posn) > 150)
                        continue;
                    if (!Polygon.collision(tiles[i].outline, tiles[j].outline))
                        continue;
                    tiles[i].$body.addClass('overlap');
                    tiles[j].$body.addClass('overlap');
                }
            }
        });
        $polypad.on('add-tile', () => {
            polygons += 1;
            if (polygons >= 3)
                $step.score('shapes0');
            if (polygons >= 5)
                $step.score('shapes1');
        });
    }
    function escher($step) {
        const $img = $step.$('.metamorph img');
        let translate = 0;
        let max = 3000;
        slide($img, {
            move(p, start, last) {
                translate += last.x - p.x;
                translate = clamp(translate, 0, max);
                $img.translate(-translate, 0);
            }
        });
        Browser.onResize(({ width }) => {
            max = 3000 - Math.min(760, width - 60);
        });
    }
    function penrose($step) {
        const $g = $step.$$('svg g');
        $g[1].setAttr('opacity', 0);
        $g[2].setAttr('opacity', 0);
        const $slider = $step.$('x-slider');
        $slider.on('move', (n) => {
            $g[0].setAttr('opacity', n < 50 ? 1 - n / 77 : 0.35);
            $g[1].setAttr('opacity', n < 50 ? n / 50 : 1.5 - n / 100);
            $g[2].setAttr('opacity', n < 50 ? 0 : n / 50 - 1);
        });
    }
    // -----------------------------------------------------------------------------
    function polyhedra($step) {
        $step.addHint('move-polyhedra');
    }
    function platonicOverview($step) {
        $step.addHint('use-euler');
    }
    function makePolyhedronGeo(data) {
        const vertices = data.vertex.map(v => new THREE.Vector3(v[0], v[1], v[2]));
        const geometry = new THREE.Geometry();
        geometry.vertices = vertices;
        for (const f of data.face) {
            for (let i = 1; i < f.length - 1; i++) {
                geometry.faces.push(new THREE.Face3(f[0], f[i], f[i + 1]));
            }
        }
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        return geometry;
    }
    function platonicDual($step) {
        const $solids = $step.$$('x-solid');
        const $sliders = $step.$$('x-slider');
        $solids[0].addMesh((scene) => {
            const octahedronGeo = makePolyhedronGeo(PolyhedronData.Octahedron);
            const octahedron = $solids[0].addSolid(octahedronGeo, 0xfd8c00, 5, true);
            const cubeGeo = makePolyhedronGeo(PolyhedronData.Cube);
            const cube = $solids[0].addSolid(cubeGeo, 0x22ab24, 5, true);
            cube.setRotationFromEuler(new THREE.Euler(0.71, 0.63, -0.97));
            function update(n) {
                cube.scale.setScalar(lerp(1.67, 0.95, n / 100));
                octahedron.scale.setScalar(lerp(0.83, 1.43, n / 100));
                scene.draw();
            }
            scene.camera.fov = 45;
            $solids[0].object.rotateX(0.2).rotateY(-0.6);
            $sliders[0].on('move', update);
            update(0);
        });
        $solids[1].addMesh((scene) => {
            const icosahedronGeo = makePolyhedronGeo(PolyhedronData.Icosahedron);
            const icosahedron = $solids[1].addSolid(icosahedronGeo, 0xf7aff, 5, true);
            icosahedron.setRotationFromEuler(new THREE.Euler(-0.47, 0, 0.3));
            const dodecahedronGeo = makePolyhedronGeo(PolyhedronData.Dodecahedron);
            const dodecahedron = $solids[1].addSolid(dodecahedronGeo, 0xcd0e66, 5, true);
            dodecahedron.setRotationFromEuler(new THREE.Euler(0.17, 0, 0.52));
            function update(n) {
                dodecahedron.scale.setScalar(lerp(1.88, 1.48, n / 100));
                icosahedron.scale.setScalar(lerp(1.35, 1.7, n / 100));
                scene.draw();
            }
            $solids[1].object.rotateX(0.2).rotateY(-0.25);
            $sliders[1].on('move', update);
            update(0);
        });
    }

    exports.angles = angles;
    exports.escher = escher;
    exports.midsegments = midsegments;
    exports.parallelogramsProof = parallelogramsProof;
    exports.penrose = penrose;
    exports.platonicDual = platonicDual;
    exports.platonicOverview = platonicOverview;
    exports.polyhedra = polyhedra;
    exports.quadrilateralsArea = quadrilateralsArea;
    exports.regular2 = regular2;
    exports.regularArea = regularArea;
    exports.tessellationDrawing = tessellationDrawing;

    return exports;

}({}));
