# blockapi

Serverless Blockchain APIs - Normalized API format for dealing with Bitcoin,
Ethereum, Litecoin, Stellar and NEM.

## How to Use

These are free APIs to use to help develop your blockchain based app. The
following URL is where this code is deployed.

**[https://blockapi.cblanquera.now.sh/](https://blockapi.cblanquera.now.sh)**

Please see the **API Calls** section to see the available endpoints. A sample
URI formation would look like the following.

```
https://blockapi.cblanquera.now.sh/bitcoin/wallet/create
```

## Disclaimer

The purpose of open sourcing this project is to transparently normalize calls to
each of the major blockchains following a standard interface. If you are planning
to use these APIs on your project please note that some of these calls request
for private keys and you should not trust passing keys without 2 way encryption.

This project is classified as **"pet project"** so encryption on our side has not
been developed yet. *(This note will be removed as soon as its implemented.)* If
you are not sure about whether if it okay to pass private keys to these APIs,
you probably should not use these APIs.

## API Calls

### `GET /[network]/wallet/create`

Creates a bitcoin, ethereum, litecoin, stellar, or nem wallet.

#### Network Statuses

* `bitcoin`
  * Generally available
  * Only in testnet for now
* `ethereum`
  * Generally available
  * Only in testnet for now
* `litecoin`
  * Generally available
  * Only in testnet for now
* `stellar`
  * **IN DEVELOPMENT**
  * Only in testnet for now
* `nem`
  * **IN DEVELOPMENT**
  * Only in testnet for now

#### Parameters

* live - *(bool)* - Whether to use testnet or live

#### Sample Request

```bash
GET /bitcoin/wallet/create
```

#### Sample Response

```json
{
    "error": false,
    "results": {
        "address": "xxx",
        "key": "xxx",
        "mnemonic": "xxx",
        "public": "xxx"
    }
}
```

----

### `GET /[network]/wallet/address`

Returns the public wallet address from the private key.

#### Network Statuses

* `bitcoin`
  * Generally available
  * Only in testnet for now
* `ethereum`
  * Generally available
  * Only in testnet for now
* `litecoin`
  * Generally available
  * Only in testnet for now
* `stellar`
  * **IN DEVELOPMENT**
  * Only in testnet for now
* `nem`
  * **IN DEVELOPMENT**
  * Only in testnet for now

#### Parameters

* pk - *(string)* - The private wallet key *(see: DISCLAIMER)*
* live - *(bool)* - Whether to use testnet or live

#### Sample Request

```bash
GET /bitcoin/wallet/address?pk=xxx
```

#### Sample Response

```json
{
    "error": false,
    "results": {
        "address": "xxx",
        "key": "xxx",
        "mnemonic": "xxx",
        "public": "xxx"
    }
}
```

----

### `GET /[network]/wallet/balance`

Returns the final confirmed balance of a wallet.

#### Network Statuses

* `bitcoin`
  * Generally available
  * Only in testnet for now
* `ethereum`
  * Generally available
  * Only in testnet for now
* `litecoin`
  * Generally available
  * Only in testnet for now
* `stellar`
  * **IN DEVELOPMENT**
  * Only in testnet for now
* `nem`
  * **IN DEVELOPMENT**
  * Only in testnet for now

#### Parameters

* address - *(string)* - The public wallet address
* live - *(bool)* - Whether to use testnet or live

#### Sample Request

```bash
GET /bitcoin/wallet/balance?address=xxx
```

#### Sample Response

```json
{
    "error": false,
    "results": 1000.000000001
}
```

----

### `GET /[network]/wallet/history`

Returns the transaction history of a wallet.

#### Network Statuses

* `bitcoin`
  * Generally available
  * Only in testnet for now
* `ethereum`
  * Generally available
  * Only in testnet for now
* `litecoin`
  * Generally available
  * Only in testnet for now
* `stellar`
  * **IN DEVELOPMENT**
  * Only in testnet for now
* `nem`
  * **IN DEVELOPMENT**
  * Only in testnet for now

#### Parameters

* address - *(string)* - The public wallet address
* live - *(bool)* - Whether to use testnet or live

#### Sample Request

```bash
GET /bitcoin/wallet/history?address=xxx
```

#### Sample Response

```json
{
    "error": false,
    "results": [
        {
            "tx_hash": "xxx",
            "block_height": 1456720,
            "tx_input_n": -1,
            "tx_output_n": 1,
            "value": 29657018,
            "ref_balance": 59367036,
            "spent": false,
            "confirmations": 54249,
            "confirmed": "2019-02-11T07:30:34Z",
            "double_spend": false
        }
    ]
}
```

----

### `GET /[network]/wallet/send`

Sends an amount from one person to another.

#### Network Statuses

* `bitcoin`
  * Signing only
  * Only in testnet for now
* `ethereum`
  * Signing only
  * Only in testnet for now
* `litecoin`
  * Signing only
  * Only in testnet for now
* `stellar`
  * **IN DEVELOPMENT**
  * Only in testnet for now
* `nem`
  * **IN DEVELOPMENT**
  * Only in testnet for now

#### Parameters

* pk - *(string)* - The private wallet key *(see: DISCLAIMER)*
* to - *(string)* - Public wallet address to send funds to
* amount - *(float)* - The amount to send
* fees - *(float)* - *(Optional)* Add transactional fees
* live - *(bool)* - Whether to use testnet or live

#### Sample Request

```bash
GET /bitcoin/wallet/send?pk=xxx&to=xxx&amount=0.001
```

#### Sample Response

```json
{
    "error": false,
    "results": "020000000..."
}
```

## Contributing

Thank you in advance for contributing to this project. Please follow these
instructions to start contributing.

1. Fork this repo
2. Clone your fork
3. Submit a pull request on master branch

### Develop Setup

To setup your environment make sure yarn is installed and run the following
command in your project folder.

```bash
$ yarn install
```

To test the lamdas locally run the following command.

```bash
$ npm start
```

Please note that **[Zeit.co](https://zeit.co/)**, the serverless provider being
used here does not support ES6 out of the box. We are using ES6 in this project,
so you need to manually transpile by using the following command to see your
changes.

```bash
$ npm run build
```

TODO is maybe automatically build on save.
