const NETWORK_PREFIX = "fele__"
const NETWORK_ID_PREFIX = "network~"
const CHANNEL_ID_PREFIX = "channel~"
const WALLET_ID_PREFIX = "wallet~"
const CREDENTIAL_ID_PREFIX = "credential~"
const ORG_ID_PREFIX = "org~"
const LORG_ID_PREFIX = "localorg~"
const LORG_FMT = "LocalOrganization"
const ORG_FMT = "Organization"
const BID = "fele__bid"
const GLOBAL_STATE = {
    network: "",
    localOrg: {},
    localUser: {},
    feleUser: {}
};

module.exports = {
    GLOBAL_STATE,
    NETWORK_PREFIX,
    NETWORK_ID_PREFIX,
    CHANNEL_ID_PREFIX,
    ORG_ID_PREFIX,
    LORG_ID_PREFIX,
    LORG_FMT,
    ORG_FMT,
    BID,
    WALLET_ID_PREFIX,
    CREDENTIAL_ID_PREFIX
}