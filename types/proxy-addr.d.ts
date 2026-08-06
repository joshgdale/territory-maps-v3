declare module 'proxy-addr' {
  type Trust = (address: string, hopDistance: number) => boolean

  interface ProxyAddr {
    (req: unknown, trust: Trust | string | string[]): string
    compile(val: string | string[]): Trust
    all(req: unknown, trust?: Trust | string | string[]): string[]
  }

  const proxyAddr: ProxyAddr
  export default proxyAddr
}
