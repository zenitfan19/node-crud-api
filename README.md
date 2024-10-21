# CRUD API server
## Description
This application is a solution for RS School NodeJS course [assignment](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)
## Prerequisites
- Install node version 22.9.0 or higher
- Install npm packages: `npm install`
- The default port is 4000, but you can easily change it. You need to remove `.development` ending in `.env` file name and enter wanted port.
## How to start app
### In development mode
```
npm run start:dev
```
### In production mode
```
npm run start:prod
```
## How to start tests
```
npm run test
```
## Request examples
## GET
```
http://localhost:4000/api/users
```
```
http://localhost:4000/api/users/{:id}
```
## POST
```
http://localhost:4000/api/users
```
## PUT
```
http://localhost:4000/api/users/{:id}
```
## DELETE
```
http://localhost:4000/api/users/{:id}
```