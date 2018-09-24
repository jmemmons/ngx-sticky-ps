import { Directive, ElementRef, Input, Renderer2, Inject, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { DOCUMENT } from '@angular/common';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { isNullOrUndefined, isUndefined } from 'util';

/**
 * This directive can be used to make certain elements on the page appear sticky.
 *
 * @summary This directive was created to work with the ngx-perfect-scrollbar component, since the window/scroll
 * listeners never fired anything. It automatically calculates the width based on the container your sticky component is
 * hosted in.
 *
 * @example
 * <perfect-scrollbar #ps>
 *     <div ngxStickyPs [perfectScrollBarRef]="ps" [bottomOffset]="10">
 *     </div>
 * </perfect-scrollbar>
 *
 *
 */
@Directive({
  selector: '[ngxStickyPs]'
})
export class NgxStickyPsDirective {

   /**
     * Binds to the ngx-perfect-scrollbar element
     */
    @Input() perfectScrollBarRef: PerfectScrollbarComponent;

    /**
     * Binds to the number in pixels you want to set the bottom offset to
     */
    @Input() bottomOffset: number | undefined;

    /**
     * Binds to the number in pixels you want to set the top ofset to
     */
    @Input() topOffset: number | undefined;

    private scrollEndOfPage$: Subscription;
    private scrollUpDown$: Subscription;
    private scrollLeftRight$: Subscription;
    private windowResize$: Subscription;

    constructor(
        private el: ElementRef,
        private render: Renderer2,
        @Inject(DOCUMENT) private document: Document) { }

    /**
     * @summary We are subscribing to some of the perfect scrollbar component's events so that we can recalculate
     * and render on the fly based on the event.
     *
     * @todo Need to wire up scrolling left and right implementations eventually
     */
    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit(): void {

        this.windowResize$ = fromEvent(window, 'resize').subscribe(() => {
            this.recalculateAndRenderComponent();
        });

        /**
         * When the user gets to the end of the page, the removeSticky() is called, so we should not render the component.
         */
        this.scrollUpDown$ = this.perfectScrollBarRef.PS_SCROLL_Y.subscribe((data: EventEmitter<any>) => {
            const currentPosition = this.perfectScrollBarRef.directiveRef.position(false);
            if (currentPosition.y && currentPosition.y === 'end') {
                return;
            }
            this.recalculateAndRenderComponent();
        });

        this.scrollEndOfPage$ = this.perfectScrollBarRef.PS_Y_REACH_END.subscribe((data: EventEmitter<any>) => {
            this.removeSticky();
        });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        if (!isNullOrUndefined(this.scrollEndOfPage$)) {
            this.scrollEndOfPage$.unsubscribe();
        }
        if (!isNullOrUndefined(this.scrollUpDown$)) {
            this.scrollUpDown$.unsubscribe();
        }
        if (!isNullOrUndefined(this.windowResize$)) {
            this.windowResize$.unsubscribe();
        }
        if (!isNullOrUndefined(this.scrollLeftRight$)) {
            this.scrollLeftRight$.unsubscribe();
        }
    }

    /**
     * Renders the component in its natural state, without a sticky.
     *
     * @description Note that the location on the page where your component sits is where it will appear.
     */
    private removeSticky(): void {
        this.render.setStyle(this.el.nativeElement, 'position', '');
    }

    private recalculateAndRenderComponent(): void {
        if (!isUndefined(this.bottomOffset)) {
            this.render.setStyle(this.el.nativeElement, 'bottom', `${this.bottomOffset}px`);
        } else if (!isUndefined(this.topOffset)) {
            this.render.setStyle(this.el.nativeElement, 'top', `${this.topOffset}px`);
        }

        this.render.setStyle(this.el.nativeElement, 'position', 'fixed');
        this.render.setStyle(this.el.nativeElement, 'width', `${this.calculateParentContainerWidth()}px`);
        this.render.setStyle(this.el.nativeElement, 'height', `${this.calculateHeight()}px`);
    }

    /**
     * @description Gets the width of the container that holds the sticky component. The width of the container is important so that
     * the sticky component will know where to sit on the page.
     *
     * @summary If the component that's using the sticky directive has
     * a bootstrap column class, it adds 15 pixels of padding on the right and left side of the component. We need to know
     * if the parent container has this column so we're sure to subtract 30 pixels from the total width of the div.
     *
     * @returns the width of the parents container
     */
    private calculateParentContainerWidth(): number {
        let width: number = this.el.nativeElement.parentElement.clientWidth;
        if (this.checkForPadding()) {
            width = width - 30;
        }
        return width;
    }

    /**
     * Calculates the height of the component
     *
     * @returns the height of the component that is stickied
     */
    private calculateHeight(): number {
        const height: number = this.el.nativeElement.clientHeight;
        let childHeight: number;
        const child = this.el.nativeElement.children[0];
        if (child) {
            childHeight = child.clientHeight;
            if (childHeight < height) {
                return childHeight;
            }
        }
        return height;
    }

    /**
     * Determines if the stickied component's parent container has a Bootstrap col class, which has padding.
     *
     * @returns true if the parent container has a col-*-* class
     */
    private checkForPadding(): boolean {
        const classList = new Array<string>();
        if (this.el.nativeElement.parentElement.classList) {
            const tempArr = this.el.nativeElement.parentElement.classList as Array<string>;
            tempArr.forEach((element: string) => {
                if (element.indexOf('col') >= 0) {
                    classList.push(element);
                }
            });
        }
        return classList.length > 0;
    }
}
