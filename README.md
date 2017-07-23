# react-redux-async

Load react components and redux reducers asynchronously. Useful for code splitting and lazy loading.


<!-- TOC depthFrom:2 depthTo:3 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Installation](#installation)
- [Example](#example)
- [Documentation](#documentation)
	- [API](#api)
	- [React Router](#react-router)
	- [Preload](#preload)
- [License](#license)

<!-- /TOC -->


## Installation

```bash
npm install react-redux-async --save
```


## Example

> Most of these examples use [Functional Components] and ES6 syntax.

Let's say you have a component `MyComponent`:

*App.js*

```js
import React from 'react'
import MyComponent from './MyComponent'

export default () =>
  <div>
    <h1>My App</h1>
    <MyComponent />
  </div>
```

To load `MyComponent` asynchronously:

*App.js*

```diff
import React from 'react'
-import MyComponent from './MyComponent'
+import Async from 'react-redux-async'

export default () =>
  <div>
    <h1>My App</h1>
-   <MyComponent />
+   <Async load={() => import('./MyComponent')}
  </div>
```

`MyComponent` will automatically render after it is loaded. Alternatively you can also create a separate "async component":

*MyAsyncComponent.js*

```js
import React from 'react'
import Async from 'react-redux-async'

export default () => <Async load={() => import('./MyComponent')} />
```

Now you can use this async component like a normal component:

*App.js*

```js
import React from 'react'
import MyAsyncComponent from './MyAsyncComponent'

export default () =>
  <div>
    <h1>My App</h1>
    <MyAsyncComponent />
  </div>
```

You can also load redux reducers asynchronously. Redux `store` is passed as the first argument to `load` function:

*MyAsyncComponent.js*

```js
import React from 'react'
import Async from 'react-redux-async'

export default () => {
  const load = async store => {
    // Load your component asynchronously
    // but don't "wait" for it to load.
    const component = import('./MyComponent')

    // Load your reducer(s) asynchronously
    // and "wait" for them to load.
    const reducer = await import('./reducer')

    // TODO: Here use store.replaceReducer() to add the new reducer(s).

    // "Wait" for the component to load.
    // This way both component and reducer(s) can be loaded in parallel.
    return await component
  }

  return <Async load={load} />
}
```


## Documentation

### API

#### `children: node` - Loading State

You can pass a loader/spinner through `children` which will be rendered before the component is loaded (promise returned by `load` function is resolved).

```js
import React from 'react'
import Async from 'react-redux-async'

export default () =>
  <Async load={() => import('./MyComponent')}>
    <div>Loading...</div>
  </Async>
```

#### `load: func`

A function that should return a promise like [`import()`][import()]. The promise should return a module object or component when resolved. `load` function will be called only after `Async` has mounted.

> **NOTE:** If you want to support older browsers that lack Promise support, you'll need to include a Promise polyfill.

When `store` is available through `props` or [`context`][context], it will be passed as the first argument to `load` function. You can use it to add reducers dynamically to store. See previous examples.

#### `props: object`

`props` that should be passed to the component that will be loaded.

```js
import React from 'react'
import Async from 'react-redux-async'

export default (props) =>
  <Async load={() => import('./MyComponent')} props={props} />
```

Now you can pass `props` to the async component as if you were passing them to the actual component.

```js
<MyAsyncComponent foo="bar" /> // <MyComponent foo="bar" />
```

#### `render: func`

A function to render the loaded component. Loaded component will be passed as the first argument. Return value of the `render` function will be rendered.

```js
import React from 'react'
import Async from 'react-redux-async'

export default (props) =>
  <Async
    load={() => import('./MyComponent')}
    render={MyComponent => <MyComponent {...props} />}
  />
```

### React Router

Since `load` function will be called only after `Async` has mounted, you can use it with [react-router] v4 to lazy load components:

```js
import React from 'react'
import { Route } from 'react-router'
import MyAsyncComponent from './MyAsyncComponent'

export default () =>
  <div>
    <h1>My App</h1>
    <Route path="/foo" component={MyAsyncComponent} />
  </div>
```

Here `MyComponent` is loaded by `MyAsyncComponent` only when URL path matches `'/foo'`.

### Preload

You can preload a component without rendering it by returning `null` in `render` function of `Async`:

*App.js*

```js
import React from 'react'
import { Route } from 'react-router'
import MyAsyncComponent from './MyAsyncComponent'

export default () =>
  <div>
    <h1>My App</h1>
    <MyAsyncComponent render={() => null} />
    <Route path="/foo" component={MyAsyncComponent} />
  </div>
```

You should pass the `render` function to `Async`:

*MyAsyncComponent.js*

```js
import React from 'react'
import Async from 'react-redux-async'

export default ({ render }) =>
  <Async load={() => import('./MyComponent')} render={render} />
```

Here `MyAsyncComponent` will start loading `MyComponent` as soon as `App` is rendered. But `MyComponent` will not be rendered until the URL path matches `'/foo'`.

Passing `null` or `undefined` to `render` will not have any effect and the loaded component will be rendered normally.


## License

[MIT][license]


[license]: /LICENSE
[Functional Components]: https://facebook.github.io/react/docs/components-and-props.html#functional-and-class-components
[context]: https://facebook.github.io/react/docs/context.html
[react-router]: https://github.com/ReactTraining/react-router
[import()]: https://webpack.js.org/api/module-methods/#import-
