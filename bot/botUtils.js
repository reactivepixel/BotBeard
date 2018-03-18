const { Member } = require('../db/models');
const util = require('apex-util');

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
exports.isAdmin = (member) => {
  const adminRoles = [
    'Admin', 'Armada Officers', 'Armada Officer', 'Fleet Officer',
    'Moderator', 'Tester',
  ];
  if (adminRoles.some(role => member.roles.find('name', role))) {
    return true;
  }
  return false;
};

// Update the user points in the database
exports.getUserPointsandUpdate = async (userId, pointsToAdd) => {
  const memberData = await Member.findAll({ attributes: ['points', 'verified'], where: { discordUser: userId } });
  const { points, verified } = memberData[0].dataValues;
  const pointsBeingAdded = parseFloat((points + pointsToAdd).toFixed(2));
  verified ? await Member.update(
    { points: pointsBeingAdded },
    { where: { discordUser: userId } }) : util.log('User is not verified', userId, 4);
};

exports.welcomeCommand = (member) => {
  const { user } = member;
  util.log('User id', user.id, 4);
  const pointsMethods = `
    **How to Earn Points:**
    \n\`Chatting with friends\`
    Chat with others and earn points! Get rewarded for talking to others!
    \n\`Gaming, Streaming, and More!\`
    Be rewarded for engagement through streaming, playing games with others, listening to Spotify, and more!
    \n\`Invite New Members\`
    Invite new members to the group and be rewarded with points!
  `;
  return `
  Welcome to the server ${user.username}! Get verified to start earning points! \n${pointsMethods}
  `;
};
