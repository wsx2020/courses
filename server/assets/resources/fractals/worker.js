(function () {
  'use strict';

  // =============================================================================
  // Fractals Background Worker
  // (c) Mathigon
  // =============================================================================
  function computeMandelbrot([xMin, xMax, yMin, yMax, res]) {
      const run = (cx, cy) => {
          let x = 0;
          let y = 0;
          for (let i = 0; i < 127; ++i) {
              const xy = x * y;
              x = x * x - y * y + cx;
              y = 2 * xy + cy;
              if (x * x + y * y >= 3)
                  return 0;
          }
          return 1;
      };
      const result = [];
      for (let x = xMin; x <= xMax; x += res) {
          const row = [];
          for (let y = yMin; y <= yMax; y += res)
              row.push(run(x, y));
          result.push(row);
      }
      return result;
  }
  function computeJulia([cx, cy, xMin, xMax, yMin, yMax, res]) {
      const run = (x, y) => {
          for (let i = 0; i < 127; ++i) {
              const xy = x * y;
              x = x * x - y * y + cx;
              y = 2 * xy + cy;
              if (x * x + y * y >= 3)
                  return 0;
          }
          return 1;
      };
      const result = [];
      for (let x = xMin; x <= xMax; x += res) {
          const row = [];
          for (let y = yMin; y <= yMax; y += res)
              row.push(run(x, y));
          result.push(row);
      }
      return result;
  }
  onmessage = (e) => {
      const [type, ...options] = e.data;
      if (type === 'julia') {
          postMessage(computeJulia(options));
      }
      else if (type === 'mandelbrot') {
          postMessage(computeMandelbrot(options));
      }
  };

}());
