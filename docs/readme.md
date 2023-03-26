# Thank You Interest Contribute to MoeDB!

## folder structure
| Folder      | Description |
| ----------- | ----------- |
| kita        | Front End(next.js)   |
| nijika      | Back End(Golang)    |

## How to run project on local
- fork this repository
- clone your fork repository

- run the back end
    - `cd nijika`
    - `go run .`

- run fron end
    - `cd kita`
    - create environment variabel
    - `touch .env.local`
    - `echo NEXT_PUBLIC_API_URL="http://localhost:7000" >> .env.local`
    - `npm install`
    - `npm run dev`
    - [Request Collections](./request-collection.json).
