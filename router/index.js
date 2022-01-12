import Router from "vue-router";

let subdomains = [
  { sub: 'boutique', directory: 'shop' },
  { sub: 'mon', directory: 'dashboard' },
  { sub: 'blog', directory: 'blog' }
]

export function createRouter(ssrContext, createDefaultRouter, routerOptions) {
  const options = routerOptions || createDefaultRouter(ssrContext).options;
  let routesDirectory = null;

  if (process.server && ssrContext && ssrContext.nuxt && ssrContext.req) {
    const req = ssrContext.req;
    // get the subdomain from the request host
    const matcher = req.headers.host.match(/^(\w+(-\w+)?)\.(localhost|\w+(-\w+)?)(\.\w+)?/) || [ 'main' ];
    routesDirectory = matcher[1] || matcher[0];
    // if the subdomain is not in the list of user provided domains, set the rootdirectory to root - domain given by the user
    
    if (routesDirectory != 'arriere-boutique') {
      let found = subdomains.find(s => s.sub == routesDirectory)
      routesDirectory = found ? found.directory : '';
    } else {
      routesDirectory = 'main'
    }
    
    // Save to the object that will be sent to the client as inline-script
    ssrContext.nuxt.routesDirectory = routesDirectory;
  }
  if (process.client) {
    // Get what we saved on SSR
    if (window.__NUXT__ && window.__NUXT__.routesDirectory) {
      routesDirectory = window.__NUXT__.routesDirectory;
    }
  }

  function isUnderDirectory(route, directory) {
    let isUnderDir = false;
    const path = route.path;
    if (typeof directory == "object") {
      directory.map(dir => {
        if(path === "/" + dir || path.startsWith("/" + dir + "/")){
          isUnderDir = true
        }
      })
      return isUnderDir;
    } else {
      return path === "/" + directory || path.startsWith("/" + directory + "/");
    }
  }

  let newRoutes = options.routes;
  if (routesDirectory) {
    newRoutes = options.routes
      .filter(route => {
        // remove routes from other directories
        const toRemove = subdomains.map(s => s.directory).filter(domain => {
          return domain != routesDirectory
        })
        return !isUnderDirectory(route, toRemove);
      })
      .map(route => {
        // remove directory from path and route-name
        if (isUnderDirectory(route, routesDirectory)) {
          return {
            ...route,
            path: route.path.substr(routesDirectory.length + 1) || "/",
            name: route.name.substr(routesDirectory.length + 1) || "index"
          };
        }
        return route;
      });
  }

  return new Router({
    ...options,
    routes: newRoutes
  });
}