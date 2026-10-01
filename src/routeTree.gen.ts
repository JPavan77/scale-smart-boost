/* eslint-disable */
// @ts-nocheck
// Generated route tree. TanStack Router will overwrite this during generation.

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as EmpresaRouteImport } from './routes/$empresa'
import { Route as AuthRouteImport } from './routes/auth'
import { Route as PainelRouteImport } from './routes/painel'
import { Route as AdminRouteImport } from './routes/admin'

const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const EmpresaRoute = EmpresaRouteImport.update({ id: '/$empresa', path: '/$empresa', getParentRoute: () => rootRouteImport } as any)
const AuthRoute = AuthRouteImport.update({ id: '/auth', path: '/auth', getParentRoute: () => rootRouteImport } as any)
const PainelRoute = PainelRouteImport.update({ id: '/painel', path: '/painel', getParentRoute: () => rootRouteImport } as any)
const AdminRoute = AdminRouteImport.update({ id: '/admin', path: '/admin', getParentRoute: () => rootRouteImport } as any)

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/$empresa': { id: '/$empresa'; path: '/$empresa'; fullPath: '/$empresa'; preLoaderRoute: typeof EmpresaRouteImport; parentRoute: typeof rootRouteImport }
    '/auth': { id: '/auth'; path: '/auth'; fullPath: '/auth'; preLoaderRoute: typeof AuthRouteImport; parentRoute: typeof rootRouteImport }
    '/painel': { id: '/painel'; path: '/painel'; fullPath: '/painel'; preLoaderRoute: typeof PainelRouteImport; parentRoute: typeof rootRouteImport }
    '/admin': { id: '/admin'; path: '/admin'; fullPath: '/admin'; preLoaderRoute: typeof AdminRouteImport; parentRoute: typeof rootRouteImport }
  }
}

const rootRouteChildren = {
  IndexRoute,
  EmpresaRoute,
  AuthRoute,
  PainelRoute,
  AdminRoute,
}

export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)
