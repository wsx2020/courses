var StepFunctions = (function (exports) {
    'use strict';

    // =============================================================================
    // Core.ts | Utility Functions
    // (c) Mathigon
    // =============================================================================
    /** Creates a random UID string of a given length. */
    function uid(n = 10) {
        return Math.random().toString(36).substr(2, n);
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
    /** Finds the sum of all elements in an numeric array. */
    function total(array) {
        return array.reduce((t, v) => t + v, 0);
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
    /** Rounds a number `n` to `precision` decimal places. */
    function round(n, precision = 0) {
        let factor = Math.pow(10, precision);
        return Math.round(n * factor) / factor;
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

    // =============================================================================
    const absStr = (n, suffix) => {
        const prefix = n < 0 ? '–' : '';
        if (Math.abs(n) === 1 && suffix)
            return prefix + suffix;
        return prefix + Math.abs(n) + (suffix || '');
    };
    /**  Complex number class. */
    class Complex {
        constructor(re = 0, im = 0) {
            this.re = re;
            this.im = im;
        }
        get modulus() {
            return Math.sqrt(this.re * this.re + this.im * this.im);
        }
        get argument() {
            return Math.atan2(this.im, this.re);
        }
        get conjugate() {
            return new Complex(this.re, -this.im);
        }
        /** Returns the ith nth-root of this complex number. */
        root(n, i = 0) {
            const r = Math.pow(this.modulus, 1 / n);
            const th = (this.argument + i * 2 * Math.PI) / n;
            return new Complex(r * Math.cos(th), r * Math.sin(th));
        }
        toString(precision = 2) {
            const re = round(this.re, precision);
            const im = round(this.im, precision);
            if (im === 0)
                return absStr(re);
            if (re === 0)
                return absStr(im, 'i');
            return [absStr(re), im < 0 ? '–' : '+', absStr(Math.abs(im), 'i')].join(' ');
        }
        // ---------------------------------------------------------------------------
        add(a) {
            return Complex.sum(this, a);
        }
        subtract(a) {
            return Complex.difference(this, a);
        }
        multiply(a) {
            return Complex.product(this, a);
        }
        divide(a) {
            return Complex.quotient(this, a);
        }
        /** Calculates the sum of two complex numbers c1 and c2. */
        static sum(c1, c2) {
            if (typeof c1 === 'number')
                c1 = new Complex(c1, 0);
            if (typeof c2 === 'number')
                c2 = new Complex(c2, 0);
            return new Complex(c1.re + c2.re, c1.im + c2.im);
        }
        /** Calculates the difference of two complex numbers c1 and c2. */
        static difference(c1, c2) {
            if (typeof c1 === 'number')
                c1 = new Complex(c1, 0);
            if (typeof c2 === 'number')
                c2 = new Complex(c2, 0);
            return new Complex(c1.re - c2.re, c1.im - c2.im);
        }
        /** Calculates the product of two complex numbers c1 and c2. */
        static product(c1, c2) {
            if (typeof c1 === 'number')
                c1 = new Complex(c1, 0);
            if (typeof c2 === 'number')
                c2 = new Complex(c2, 0);
            let re = c1.re * c2.re - c1.im * c2.im;
            let im = c1.im * c2.re + c1.re * c2.im;
            return new Complex(re, im);
        }
        /** Calculates the quotient of two complex numbers c1 and c2. */
        static quotient(c1, c2) {
            if (typeof c1 === 'number')
                c1 = new Complex(c1, 0);
            if (typeof c2 === 'number')
                c2 = new Complex(c2, 0);
            if (Math.abs(c2.re) < Number.EPSILON || Math.abs(c2.im) < Number.EPSILON)
                return new Complex(Infinity, Infinity);
            let denominator = c2.re * c2.re + c2.im * c2.im;
            let re = (c1.re * c2.re + c1.im * c2.im) / denominator;
            let im = (c1.im * c2.re - c1.re * c2.im) / denominator;
            return new Complex(re, im);
        }
        /** Calculates e^c for a complex number c. */
        static exp(c) {
            if (typeof c === 'number')
                c = new Complex(c, 0);
            const r = Math.exp(c.re);
            return new Complex(r * Math.cos(c.im), r * Math.sin(c.im));
        }
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
    function rad(p, c = ORIGIN) {
        const a = Math.atan2(p.y - c.y, p.x - c.x);
        return (a + TWO_PI) % TWO_PI;
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
    function demo($step) {
        $step.model.complexRoot = (p, n, i) => {
            const c = new Complex(p.x, p.y);
            const root = c.root(n, i);
            return new Point(root.re, root.im);
        };
    }

    exports.demo = demo;

    return exports;

}({}));
