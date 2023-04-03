const NETWORK_PREFIX = "fele__"
const CHANNEL_ID_PREFIX = "channel~"
const ORG_ID_PREFIX = "organization~"
const GLOBAL_STATE = {
    network: "",
    localOrg: {},
    localUser: {},
    feleUser: {}
};

module.exports = {
    GLOBAL_STATE,
    NETWORK_PREFIX,
    CHANNEL_ID_PREFIX,
    ORG_ID_PREFIX
}