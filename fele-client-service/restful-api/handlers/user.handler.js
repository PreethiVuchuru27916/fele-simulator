const jwt = require('jsonwebtoken')

const loginUserHandler = (req, res) => {
    //TODO
    res.status(200).send({
        isAuthenticated: true,
        token: ""
    })
}

const registerUserHandler = (req, res) => {
    //TODO
    res.send("Register Response")
}

const updateUserHandler = (req, res) => {
    res.send("Update fabric user Response")
}

const deleteUserHandler = (req, res) => {
    res.send("Delete user Response")
}

module.exports = {
    loginUserHandler,
    registerUserHandler,
    updateUserHandler,
    deleteUserHandler
}