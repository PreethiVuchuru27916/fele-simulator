const NETWORK_PREFIX = "fele__"
const CHANNEL_ID_PREFIX = "channel~"
const WALLET_ID_PREFIX = "wallet~"
const CREDENTIAL_ID_PREFIX = "credential~"

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
    WALLET_ID_PREFIX,
    CREDENTIAL_ID_PREFIX
}