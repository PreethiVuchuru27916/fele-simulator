const loginFabricUserHandler = (req, res) => {
    res.send("Login Response")
}

const registerFabricUserHandler = (req, res) => {
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