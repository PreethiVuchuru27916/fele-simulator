const NETWORK_PREFIX = "fele__"
const CHANNEL_ID_PREFIX = "channel~"
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
    CHANNEL_ID_PREFIX,
    ORG_ID_PREFIX,
    LORG_ID_PREFIX,
    LORG_FMT,
    ORG_FMT,
    BID,

}