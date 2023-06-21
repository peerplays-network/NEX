[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=PBSA_NEX&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=PBSA_NEX)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=PBSA_NEX&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=PBSA_NEX)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=PBSA_NEX&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=PBSA_NEX)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=PBSA_NEX&metric=bugs)](https://sonarcloud.io/summary/new_code?id=PBSA_NEX)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=PBSA_NEX&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=PBSA_NEX)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=PBSA_NEX&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=PBSA_NEX)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=PBSA_NEX&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=PBSA_NEX)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=PBSA_NEX&metric=coverage)](https://sonarcloud.io/summary/new_code?id=PBSA_NEX)
[![pipeline status](https://gitlab.com/PBSA/NEX/badges/dev/pipeline.svg)](https://gitlab.com/PBSA/NEX/-/commits/dev)

Project to build moderen DEX-UI for the Peerplays on chain DEX

# Peerplays DEX

## Prerequisites

Install the build dependencies on Linux:

```
apt-get update
apt-get install build-essential nasm
```

## Installation

Node v16+ is required and it can be installed using nvm following these [installation steps](https://github.com/nvm-sh/nvm#installing-and-updating).

Clone this repo:

```
https://gitlab.com/PBSA/NEX.git -b <branch name>
```

Now make sure you are in the application's root directory. Install app dependecies:

```
npm install
```

## ENV configuration

Create a `.env.local` file in the root of the repository:

```
cp .env.example .env.local
```

.env.local

```
# Token symbol
NEXT_PUBLIC_DEFAULT_TOKEN=''

# Token symbol
NEXT_PUBLIC_DEFAULT_QUOTE=''

# Full URL to the blockchain's faucet
NEXT_PUBLIC_FAUCET_URL=''

# Ethereum primary wallet address
NEXT_PUBLIC_ETHEREUM_PRIMARY_WALLET=''

# Chain ID of the blockchain
NEXT_PUBLIC_DEFAULT_CHAIN_ID=''
```

If the NEXT_PUBLIC_DEFAULT_CHAIN_ID is not equalt to main net chain id (6b6b5f0ce7a36d323768e534f3edb41c6d6332a541a95725b98e28d140850134) the app will use testnet nodes

## Nodes list

put the list of nodes inside the /src/api/params/nodesList.ts file

## Mannual Starting after installation and ENV configuration

### Development

```
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

Install pm2 globally:

```
 npm install pm2 -g
```

Now make sure you are in the application's root directory. Build the production distribution:

```
npm run build
```

Make sure you are in the application's root directory. Serve the application:

```
pm2 start npm --name <must be unique> -- start
```

#### Exmaple NGINX Configuration:

```
server {
        listen 80;
        server_name <domain name or serve ip address>;
        root /var/www/html;
        index index.html index.htm;

        location / {
                proxy_pass             http://127.0.0.1:3000;
                proxy_read_timeout     60;
                proxy_connect_timeout  60;
                proxy_redirect         off;

                # Allow the use of websockets
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}
```

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

"peerplaysjs-lib": "git+https://gitlab.com/PBSA/peerplays-1.0/tools-libs/peerplaysjs-lib.git#feature/135-add-asset-api-to-ApiInstance",
