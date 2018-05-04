# Enforce mysql

Database module for Enforce Team - CanSat 2018

## Getting Started

### Prerequisites

You need to have a mysql server running on your local machine and need to create the tables present in [enforce.db.sql](enforce.db.sql).
For the database configuration see [config.json](config.json)

### Installing

Clone this repo

```shell
$ git clone https://github.com/ITISEnricoFermi/enforce-mysql.git
```

Move into the project folder

```shell
$ cd enforce-mysql
```

Install the dependencies

```shell
$ npm install
```

And then try a test run

```shell
$ npm run dev

> enforce-mysql@0.7.0 dev /Path/to/project/enforce-mysql
>  export NODE_ENV=* || SET DEBUG=* && node test/test.js

  enforce-database Booting Enforce Database System +0ms
  enforce-database Connecting to database... +123ms
  enforce-database:test Creating database... +0ms
  enforce-database Starting mission: enf<timestamp> +4ms
  enforce-database Connected! +7ms
  enforce-database Inserting into missions... +5ms
  enforce-database Done. +36ms
  enforce-database Inserting into temperature... +5s
  enforce-database Done. +70ms
  enforce-database Inserting into pressure... +3s
  enforce-database Done. +30ms
  enforce-database Inserting into position... +2s
  enforce-database Inserting into temperature... +12ms
  enforce-database Done. +33ms
  enforce-database Done. +38ms
```

## Authors

* **Ernesto Montada** - *Initial work* - [n4y0n](https://github.com/n4y0n)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
