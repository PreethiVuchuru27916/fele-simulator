const localOrg = require('../../../fele-local-org/LocalOrganization')
const update = async (req, res) => {
    console.log("Im called")
    if(req.originalUrl.includes('fele')) {
        ['velocity', 'nivian', 'nexon'].forEach(async (org) => {
            try{
                await localOrg.syncLocalOrg(org)
            } catch(err) {
                console.log("OK", err.message)
            }
        })
    }
}

module.exports = {update}