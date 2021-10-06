# Ajiojs is a promise-based HTTP client for node.js


# Installation

### Via npm

```bash
$ npm install ajio
```

### Via cdn (Unpkg)

```html
<script src="https://unpkg.com/ajio"></script>
```


# Usage

### Get
```javascript
var ajio = require('ajio');

ajio.get('https://jsonplaceholder.typicode.com/comments')
  .then(data=>{
    console.log(data)
  })
```

### Post

```javascript
var ajio = require('ajio');

ajio.post('https://jsonplaceholder.typicode.com/comments',{
  body: {
    name: "Ajio",
    author: "Tobithedev",
    version: "v0.1"
  }
})
  .then(data=>{
    console.log(data)
  })
```

### Put

```javascript
var ajio = require('ajio');

ajio.put('https://jsonplaceholder.typicode.com/comments',{
  body: JSON.stringfy(`
  {
    "postId": 20,
    "id": 501,
    "name": "Tobithedev",
    "email": "ucheemekatobi@gmail.com",
    "body": "Ajiojs has been released 😊😊"
  },`)
})
  .then(data=>{
    console.log(data)
  })
```

### Delete

```javascript
var ajio = require('ajio');

ajio.delete(`https://jsonplaceholder.typicode.com/comments`)
  .then(data=>{
    console.log(data)
  })
```