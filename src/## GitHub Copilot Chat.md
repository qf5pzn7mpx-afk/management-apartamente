## GitHub Copilot Chat

- Extension: 0.46.2 (prod)
- VS Code: 1.118.1 (034f571df509819cc10b0c8129f66ef77a542f0e)
- OS: win32 10.0.26200 x64
- GitHub Account: Alinaiuga9

## Network

User Settings:
```json
  "http.systemCertificatesNode": true,
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.121.5 (8 ms)
- DNS ipv6 Lookup: Error (4 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (0 ms)
- Electron fetch (configured): Error (97 ms): Error: net::ERR_CERT_DATE_INVALID
    at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
    at SimpleURLLoaderWrapper.emit (node:events:519:28)
    at SimpleURLLoaderWrapper.emit (node:domain:489:12)
    at SimpleURLLoaderWrapper.topLevelDomainCallback (node:domain:161:15)
    at SimpleURLLoaderWrapper.callbackTrampoline (node:internal/async_hooks:128:24)
  {"is_request_error":true,"network_process_crashed":false}
- Node.js https: Error (113 ms): Error: certificate is not yet valid
    at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
    at TLSSocket.emit (node:events:519:28)
    at TLSSocket.emit (node:domain:489:12)
    at TLSSocket._finishInit (node:_tls_wrap:1095:8)
    at TLSWrap.ssl.onhandshakedone (node:_tls_wrap:881:12)
    at TLSWrap.callbackTrampoline (node:internal/async_hooks:130:17)
- Node.js fetch: Error (113 ms): TypeError: fetch failed
    at node:internal/deps/undici/undici:14902:13
    at processTicksAndRejections (node:internal/process/task_queues:103:5)
    at t._fetch (c:\Users\Alina Iuga\AppData\Local\Programs\Microsoft VS Code\034f571df5\resources\app\extensions\copilot\dist\extension.js:5325:5229)
    at t.fetch (c:\Users\Alina Iuga\AppData\Local\Programs\Microsoft VS Code\034f571df5\resources\app\extensions\copilot\dist\extension.js:5325:4541)
    at u (c:\Users\Alina Iuga\AppData\Local\Programs\Microsoft VS Code\034f571df5\resources\app\extensions\copilot\dist\extension.js:5357:186)
    at Pg._executeContributedCommand (file:///c:/Users/Alina%20Iuga/AppData/Local/Programs/Microsoft%20VS%20Code/034f571df5/resources/app/out/vs/workbench/api/node/extensionHostProcess.js:503:48675)
  Error: certificate is not yet valid
      at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
      at TLSSocket.emit (node:events:519:28)
      at TLSSocket.emit (node:domain:489:12)
      at TLSSocket._finishInit (node:_tls_wrap:1095:8)
      at TLSWrap.ssl.onhandshakedone (node:_tls_wrap:881:12)
      at TLSWrap.callbackTrampoline (node:internal/async_hooks:130:17)

Connecting to https://api.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.112.22 (4 ms)
- DNS ipv6 Lookup: Error (6 ms): getaddrinfo ENOTFOUND api.githubcopilot.com
- Proxy URL: None (6 ms)
- Electron fetch (configured): HTTP 200 (396 ms)
- Node.js https: HTTP 200 (398 ms)
- Node.js fetch: HTTP 200 (402 ms)

Connecting to https://copilot-proxy.githubusercontent.com/_ping:
- DNS ipv4 Lookup: 20.250.119.64 (5 ms)
- DNS ipv6 Lookup: Error (5 ms): getaddrinfo ENOTFOUND copilot-proxy.githubusercontent.com
- Proxy URL: None (9 ms)
- Electron fetch (configured): HTTP 200 (172 ms)
- Node.js https: HTTP 200 (163 ms)
- Node.js fetch: HTTP 200 (166 ms)

Connecting to https://mobile.events.data.microsoft.com: HTTP 404 (671 ms)
Connecting to https://dc.services.visualstudio.com: HTTP 404 (293 ms)
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: HTTP 200 (443 ms)
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: HTTP 200 (419 ms)
Connecting to https://default.exp-tas.com: HTTP 400 (157 ms)

Number of system certificates: 102

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).