# Router for dom.

This library uses webpack. I added my webpack config to the project. You can learn more here.

If you like this project please show your support with a [GitHub :star:](https://github.com/Ikrom-Murodov/router-for-dom)!

# Introduction.

`router-for-dom` - It is a routing library for JavaScript in the browser. Includes the following Features:

- Automatic placement and removal of active CSS class for links. 
- Dynamic Route Matching.
- HTML5 history mode.
- Lazy Loading Routes.


# Installation.

Npm

```npm
npm i router-for-dom
```
Yarn
```yarn
yarn add router-for-dom
```

# Getting Started.

### HTML

```html 
<div id="app">
  <header class="header">
    <nav class="header-navigation">
      <div class="header-navigation__wrapper-content">
        <ul class="header-navigation__content">
          <li class="header-navigation__item">
            <!-- We Use the 'data-router-link' attribute to tell the router that this is a navigation link. -->
            <!-- When the url is '/' then an 'active-class' will be added for all html elements that have this attribute. -->
            <a data-router-link="/" class="header-navigation__link"> Home </a>
          </li>

          <li class="header-navigation__item">
            <!-- We Use the 'data-router-link' attribute to tell the router that this is a navigation link -->
            <!-- When the url is '/Contact' then an 'active-class' will be added for all html elements that have this attribute. -->
            <a data-router-link="/Contact" class="header-navigation__link"> Contact </a>
          </li>

          <li class="header-navigation__item">
            <!-- We Use the 'data-router-link' attribute to tell the router that this is a navigation link -->
            <!-- When the url is '/Contact' then an 'active-class' will be added for all html elements that have this attribute. -->
            <a data-router-link="/About-me" class="header-navigation__link"> About me </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</div>
```

### TYPESCRIPT

```ts 
// 1) We importing the router class.
import { Router } from 'router-for-dom';

// 2) We are importing the pages we want to use.
import { Contact, AboutMe, Home } from 'src/pages';

// 3) We create an instance of the router class and pass parameters to it.
const router: Router = new Router({
  // Should be the html element on which the pages will be rendered.
  el: document.querySelector('#app') as HTMLElement,

  // Passing the pages that we want to use.
  routes: [
    {
      path: '/',
      page: Home,
    },
    {
      path: '/About-me',
      page: AboutMe,
    },
    {
      path: '/Contact',
      page: Contact,
      // optional fields.
      state: {
        email: 'ikrommurodov2001@gmail.com',
      },
    },
  ],
});
```

### PAGES

```ts
// src/pages/Home.ts
import { IPage, IPageParams } from 'router-for-dom';

export class Home implements IPage {
  constructor(private params: IPageParams) {
    this.init();
  }

  private init(): void {
    console.log('home: params', this.params); // { router: Router -> router class instance, stateHistory: {} }
  }

  // the router will call this method to get the page content.
  public toHtml(): HTMLElement {
    const element = document.createElement('h1');
    element.textContent = 'Home page';
    return element;
  }

  // hooks

  // This hook will fire before changing the content of the html element.
  public beforeRenderElement(): void {
    console.log('home: beforeRenderElement');
  }

  // This hook will fire after changing content of html element.
  public afterRenderElement(): void {
    console.log('home: afterRenderElement');
  }
  
  // This hook will fire after push method has been called.
  public destroy(): void {
    console.log('home: destroy');
  }
}
```


```ts
// src/pages/AboutMe.ts
import { IPage, IPageParams } from 'router-for-dom';

export class AboutMe implements IPage {
  constructor(private params: IPageParams) {
    this.init();
  }

  private init(): void {
    console.log('about-me: params', this.params); // { router: Router -> router class instance, stateHistory: {} }
  }

  // the router will call this method to get the page content.
  public toHtml(): HTMLElement {
    const element = document.createElement('h1');
    element.textContent = 'About-me page';
    return element;
  }

  // hooks

  // This hook will fire before changing the content of the html element.
  public beforeRenderElement(): void {
    console.log('about-me: beforeRenderElement');
  }

  // This hook will fire after changing content of html element.
  public afterRenderElement(): void {
    console.log('about-me: afterRenderElement');
  }
  
  // This hook will fire after push method has been called.
  public destroy(): void {
    console.log('about-me: destroy');
  }
}
```


```ts
// src/pages/Contact.ts
import { IPage, IPageParams } from 'router-for-dom';

export class Contact implements IPage {
  constructor(private params: IPageParams) {
    this.init();
  }

  private init(): void {
    console.log('contact: params', this.params);
    /**
     * {
     *   router: Router -> router class instance,
     *   stateHistory: { email: 'ikrommurodov2001@gmail.com' }
     * }
     */
  }

  // the router will call this method to get the page content.
  public toHtml(): HTMLElement {
    const element = document.createElement('div');
    element.insertAdjacentHTML(
      'afterbegin',
      `
      <h1>Contact page</h1>
      <ul>
        <li>Email: ${this.params.stateHistory.email}</li>
      </ul>
    `,
    );
    return element;
  }

  // hooks

  // This hook will fire before changing the content of the html element.
  public beforeRenderElement(): void {
    console.log('contact: beforeRenderElement');
  }
  

  // This hook will fire after changing content of html element.
  public afterRenderElement(): void {
    console.log('contact: afterRenderElement');
  }

  // This hook will fire after push method has been called.
  public destroy(): void {
    console.log('contact: destroy');
  }
}
```

```ts
// src/pages/index.ts
export { AboutMe } from './AboutMe';
export { Contact } from './Contact';
export { Home } from './Home';
```



# Dynamic Route Matching 

Very often we need to match routes to a given pattern. For example,
we might have a user page that should be displayed to all users, 
but with different user IDs. In router-for-dom,
we can use a dynamic segment in the route to achieve this:

```ts
// 1) We importing the router class.
import { Router } from 'router-for-dom';

// 2) We are importing the pages we want to use.
import { User } from 'src/pages';

// 3) We create an instance of the router class and pass parameters to it.
const router: Router = new Router({
  // Should be the html element on which the pages will be rendered.
  el: document.querySelector('#app') as HTMLElement,

  // Passing the pages that we want to use.
  routes: [
   {
      path: '/user/:id',
      page: User,
    },
  ],
});
```


```ts 
// src/pages/User.ts
import { IPage, IPageParams } from 'router-for-dom';

export class User implements IPage {
  constructor(private params: IPageParams) {
    this.init();
  }

  private init(): void {
    console.log('user: params', this.params);
    /**
     * {
     *   router: Router -> router class instance,
     *   stateHistory: { Id: dynamic }
     * }
     */
  }

  // the router will call this method to get the page content.
  public toHtml(): HTMLElement {
    const element = document.createElement('div');
    element.insertAdjacentHTML(
      'afterbegin',
      `
      <h1>User page</h1>
      <ul>
        <li>Id: ${this.params.stateHistory.id}</li>
      </ul>
    `,
    );
    return element;
  }

  // hooks

  // This hook will fire before changing the content of the html element.
  public beforeRenderElement(): void {
    console.log('user: beforeRenderElement');
  }

  // This hook will fire after changing content of html element.
  public afterRenderElement(): void {
    console.log('user: afterRenderElement');
  }

  // This hook will fire after push method has been called.
  public destroy(): void {
    console.log('user: destroy');
  }
}
```

Now URLs like /user/foo and /user/bar will both map to the same route.



# Lazy Loading Routes.


When using a modular system, the resulting JavaScript assembly can be quite large, 
which negatively affects page load time. In some cases, 
it would be more efficient to split the pages into separate fragments and load them only when 
going to the corresponding route.

```ts 
// 1) We importing the router class.
import { Router } from 'router-for-dom';

// 2) We are importing the pages we want to use.
import { Contact, AboutMe, Home } from 'src/pages';

// 3) We create an instance of the router class and pass parameters to it.
const router: Router = new Router({
  // Should be the html element on which the pages will be rendered.
  el: document.querySelector('#app') as HTMLElement,

  // Passing the pages that we want to use.
  routes: [
    {
      path: '/',
      page: () => import('src/pages/Home').then((res) => res.Home),
    },
    {
      path: '/About-me',
      page: () => import('src/pages/AboutMe').then((res) => res.AboutMe),
    },
    {
      path: '/Contact',
      page: () => import('src/pages/Contact').then((res) => res.Contact),
      // optional fields.
      state: {
        email: 'ikrommurodov2001@gmail.com',
      },
    },
    {
      path: '/user/:id',
      page: () => import('src/pages/User').then((res) => res.User),
    },
  ],
});
```


# Router (API)

### push - To navigate to a different URL, use router.push.
   * @param{string} path - Url address to go to a new page.

```ts 
// 1) We importing the router class.
import { Router } from 'router-for-dom';

// 2) We are importing the pages we want to use.
import { Contact, AboutMe, Home } from 'src/pages';

// 3) We create an instance of the router class and pass parameters to it.
const router: Router = new Router({
  // Should be the html element on which the pages will be rendered.
  el: document.querySelector('#app') as HTMLElement,

  // Passing the pages that we want to use.
  routes: [
    {
      path: '/',
      page: () => import('src/pages/Home').then((res) => res.Home),
    },
    {
      path: '/About-me',
      page: () => import('src/pages/AboutMe').then((res) => res.AboutMe),
    },
    {
      path: '/Contact',
      page: () => import('src/pages/Contact').then((res) => res.Contact),
      // optional fields.
      state: {
        email: 'ikrommurodov2001@gmail.com',
      },
    },
    {
      path: '/user/:id',
      page: () => import('src/pages/User').then((res) => res.User),
    },
  ],
});

router.push('/About-me');
```


### getStateHistory - This method returns the states of the browser history.
   * @returns {Object} - history state

```ts 
// 1) We importing the router class.
import { Router } from 'router-for-dom';

// 2) We are importing the pages we want to use.
import { Contact, AboutMe, Home } from 'src/pages';

// 3) We create an instance of the router class and pass parameters to it.
const router: Router = new Router({
  // Should be the html element on which the pages will be rendered.
  el: document.querySelector('#app') as HTMLElement,

  // Passing the pages that we want to use.
  routes: [
    {
      path: '/',
      page: () => import('src/pages/Home').then((res) => res.Home),
    },
    {
      path: '/About-me',
      page: () => import('src/pages/AboutMe').then((res) => res.AboutMe),
    },
    {
      path: '/Contact',
      page: () => import('src/pages/Contact').then((res) => res.Contact),
      // optional fields.
      state: {
        email: 'ikrommurodov2001@gmail.com',
      },
    },
    {
      path: '/user/:id',
      page: () => import('src/pages/User').then((res) => res.User),
    },
  ],
});

console.log(router.getStateHistory()) // Object
```
