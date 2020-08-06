// =============================================================================
// Dragging Component
// (c) Mathigon
// =============================================================================


import {Browser, CustomElementView, ElementView, register, slide} from '@mathigon/boost';
import {isBetween, Point} from '@mathigon/fermat';


class FlowGrid {
  private width = 0;

  constructor(private readonly $parent: ElementView, private margin: number,
              private minHeight = 0) {
    Browser.onResize(() => {
      if (this.width !== $parent.width) this.reflow();
    });
  }

  reflow() {
    const $children = this.$parent.children;
    this.width = this.$parent.width;

    let yOffset = 0;
    let $rowEls: ElementView[] = [];
    let rowWidths: number[] = [];
    let rowHeight = 0;
    let rowWidth = 0;

    for (const $c of $children) {
      const box = $c.bounds;

      // Add this element to current row
      if (rowWidth + box.width + this.margin <= this.width) {
        $rowEls.push($c);
        rowWidths.push(box.width);
        rowHeight = Math.max(rowHeight, box.height);
        rowWidth += box.width + this.margin;
        continue;
      }

      // Layout one row of elements
      this.positionRow($rowEls, rowWidths, rowWidth, yOffset);
      yOffset += this.margin + rowHeight;

      // Start a new Row
      $rowEls = [$c];
      rowWidths = [box.width];
      rowHeight = box.height;
      rowWidth = box.width;
    }

    // Layout last row
    if ($rowEls.length) {
      this.positionRow($rowEls, rowWidths, rowWidth, yOffset);
      yOffset += this.margin + rowHeight;
    }

    const height = Math.max(this.minHeight, yOffset);
    this.$parent.animate({height: `${height}px`}, 200)
  }

  private positionRow($rowEls: ElementView[], rowWidths: number[],
                      rowWidth: number, yOffset: number) {
    let xOffset = (this.width - rowWidth) / 2;
    for (const [i, $e] of $rowEls.entries()) {
      $e.css('left', `${xOffset}px`);
      $e.css('top', `${yOffset}px`);
      xOffset += rowWidths[i] + this.margin;
    }
  }
}

// -----------------------------------------------------------------------------

function contains(bounds: DOMRect, posn: Point) {
  return isBetween(posn.x, bounds.left, bounds.left + bounds.width) &&
         isBetween(posn.y, bounds.top, bounds.top + bounds.height);
}


@register('x-buckets')
export class Buckets extends CustomElementView {
  private $cards!: ElementView[];
  private position!: number[];
  private solution!: number[];

  ready() {
    const $input = this.$('.inputs')!;
    const $buckets = this.$$('.bucket');

    const inputFlow = new FlowGrid($input, 10);
    const bucketFlows = $buckets.map($b => new FlowGrid($b, 10, 150));

    this.$cards = this.$$('.input');
    this.solution = this.$cards.map($el => +$el.attr('bucket'));
    this.position = this.$cards.map(() => -1);

    let bucketBounds: DOMRect[];
    let targetBucket = -1;

    for (const [i, $i] of this.$cards.entries()) {
      $i.removeAttr('bucket');
      slide($i, {
        start: () => {
          $i.addClass('active');
          bucketBounds = $buckets.map($b => $b.bounds);
        },
        move: (p: Point, start: Point) => {
          $i.setTransform(p.subtract(start));

          const oldTargetBucket = targetBucket;
          targetBucket = bucketBounds.findIndex(b => contains(b, p));

          if (targetBucket === oldTargetBucket) return;
          if (oldTargetBucket >= 0) $buckets[oldTargetBucket].removeClass('active');
          if (targetBucket >= 0 && this.position[i] !== targetBucket) $buckets[targetBucket].addClass('active');
        },
        end: async (p: Point, start: Point) => {
          if (targetBucket >= 0) $buckets[targetBucket].removeClass('active');

          if (targetBucket >= 0 && this.position[i] !== targetBucket) {
            const da = $buckets[targetBucket].topLeftPosition;
            const db = (this.position[i] >= 0 ? $buckets[this.position[i]] : $input).topLeftPosition

            $buckets[targetBucket].append($i);
            $i.setTransform(p.subtract(start).add(db).subtract(da));

            if (this.position[i] < 0) inputFlow.reflow();
            if (this.position[i] >= 0) bucketFlows[this.position[i]].reflow();
            bucketFlows[targetBucket].reflow();

            this.position[i] = targetBucket;
            targetBucket = -1;
            this.check();
          }

          await $i.animate({transform: 'none'}, 200).promise;
          $i.removeClass('active');
        }
      });
    }

    // TODO Implement this!
  }

  restore() {
    // TODO Implement
  }

  check() {
    if (this.position.some(p => p < 0)) return;
    let errors = 0;

    for (const [i, p] of this.position.entries()) {
      const correct = (p === this.solution[i]);
      this.$cards[i].setClass('error', !correct);
      if (!correct) errors += 1;
    }

    if (errors) {
      this.trigger('error');
    } else {
      this.trigger('correct');
    }
  }
}
