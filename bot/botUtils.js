exports.generateCode = (n) => {
  // Workaround method for Math.pow() and ** operator
  const pow = (base, exp) => {
    let result = 1;
    for (let i = 0; i < exp; i += 1) {
      result *= base;
    }
    return result;
  };
  const add = 1;
  let max = 12 - add;
  let min = 0;
  if (n > max) {
    return this.generateCode(max) + this.generateCode(n - max);
  }
  max = pow(10, n + add);
  min = max / 10;
  const number = Math.floor(Math.random() * (max - (min + 1))) + min;
  return ('' + number).substring(add);
};

// Checks if person is an admin user, use GuildMember object
exports.isInElevatedRole = (member) => {
  const elevatedRoles = [
    'Admin', 'Armada Officers', 'Armada Officer', 'Fleet Officer',
    'Moderator', 'Tester',
  ];
  if (elevatedRoles.some(role => member.roles.find('name', role))) {
    return true;
  }
  return false;
};

// Checks if person is an actual server admin
exports.isServerAdmin = (message) => {
  const isAdmin = message.member.hasPermission('ADMINISTRATOR');
  return isAdmin;
};
