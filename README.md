# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Register Page"](https://github.com/lealinin/tinyapp/blob/master/docs/register-page.png)
!["Login Page"](https://github.com/lealinin/tinyapp/blob/master/docs/login-page.png)
!["Create URL Page"](https://github.com/lealinin/tinyapp/blob/master/docs/create-url-page.png)
!["My URLs Page"](https://github.com/lealinin/tinyapp/blob/master/docs/my-urls-page.png)
!["Edit URL Page"](https://github.com/lealinin/tinyapp/blob/master/docs/edit-url-page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies with the `npm install` command.
- Run the development web server using the `node express_server.js` command.
- Go to `http://localhost:8080/register` to create an account.
- Once you're logged in, you can create a short URL by clicking on `Create New URL` in the navbar.
- Click on `My URLs` in the navbar to see a list of all your shortened URLs. You can also `Edit` or `Delete` your URLs.