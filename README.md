# Coolshop Orders Parser

A Node.js script that processes a CSV file with ecommerce orders and outputs useful analytics.

## Features

- Accepts a CSV file as input via CLI.
- Outputs:
  - Record with the **highest total amount** (after discount)
  - Record with the **highest quantity**
  - Record with the **greatest discount difference**

## CSV Format

The input file must contain the following headers:

```
Id,Article Name,Quantity,Unit price,Percentage discount,Buyer
```

### Example

```
1,Coke,10,1,0,Mario Rossi
2,Coke,15,2,0,Luca Neri
3,Fanta,5,3,2,Luca Neri
4,Water,20,1,10,Mario Rossi
5,Fanta,1,4,15,Andrea Bianchi
```

## Usage

```bash
node index.js <path-to-csv>
```

Example:

```bash
node index.js ./csv/orders.csv
```

## Setup

Install dependencies:

```bash
npm install
```

## Requirements

- Node.js ≥ 14
- [`csv-parser`](https://www.npmjs.com/package/csv-parser)

Install manually if missing:

```bash
npm install csv-parser
```
