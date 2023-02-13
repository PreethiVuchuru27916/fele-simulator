const authenticateUser = (username, password, organizationName, localOrg) => {
  let localUser = { "authenticated" : false }
  const { organization, localUsers } = localOrg;

  if (organization === organizationName) {
    
    const localUserIndex = localUsers.findIndex(
      localUser => localUser.username === username && localUser.password === password
    );
    //Found LocalUser
    if (localUserIndex != -1) {
      localUser.username = username;
      localUser.organization = organizationName;
      localUser.authenticated = true;
      return localUser;
    }
  }
  return localUser;
};

module.exports = {
  authenticateUser,
};
