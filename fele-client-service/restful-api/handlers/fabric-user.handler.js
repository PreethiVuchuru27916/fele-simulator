const loginFabricUserHandler = (req, res) => {
    //TODO
    res.status(200).send({
        isAuthenticated: true,
        token: ""
    })
}

const registerFabricUserHandler = (req, res) => {
    //TODO
    res.send("Register Response")
}

const updateFabricUserHandler = (req, res) => {
    res.send("Update fabric user Response")
}

const deleteFabricUserHandler = (req, res) => {
    res.send("Delete user Response")
}

module.exports = {
    loginFabricUserHandler,
    registerFabricUserHandler,
    updateFabricUserHandler,
    deleteFabricUserHandler
}