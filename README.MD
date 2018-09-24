# ngx-sticky-ps

An Angular directive that works with NgxPerfectScrollbar to stick components to the page

## Usage

```xml
<perfect-scrollbar #ps>
  <div ngxStickyPs [perfectScrollBarRef]="ps" [bottomOffset]="10">
  </div>
</perfect-scrollbar>
```

## Installation

To install, run:

```bash
npm install ngx-sticky-ps --save
```

and include the directive in your AppModule:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxStickyPsDirective } from 'ngx-sticky-ps';

@NgModule({
  declarations: [
    AppComponent,
    NgxStickyPsDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
npm run build
```

To lint all `*.ts` files:

```bash
npm run lint
```

## License

MIT © [John Emmons](mailto:emmons.johnm@gmail.com)
