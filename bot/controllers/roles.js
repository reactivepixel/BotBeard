const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const msg = require('../locale/messages.json');

class RoleController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!roles',
        '!roles',
        'List All Roles',
        msg.roles[process.env.LANGUAGE],
        this.rolesAction.bind(controller),
        'dm',
      ),
      new Command(
        '!addRole',
        '!addRole <role_name>',
        'Add Role',
        msg.addRole[process.env.LANGUAGE],
        this.addRoleAction.bind(controller),
      ),
      new Command(
        '!addRoles',
        '!addRoles <role_name>,[role_name]',
        'Add Multiple Roles',
        'Add multiple roles to yourself. Roles are case-sensitive',
        msg.addRoles[process.env.LANGUAGE],
        this.addRolesAction.bind(controller),
      ),
      new Command(
        '!removeRole',
        '!removeRole <role_name>',
        'Remove Role',
        msg.removeRole[process.env.LANGUAGE],
        this.removeRoleAction.bind(controller),
      ),
      new Command(
        '!addAllRoles',
        '!addAllRoles',
        'Add All Roles',
        msg.addAllRoles[process.env.LANGUAGE],
        this.addAllRolesAction.bind(controller),
      ),
      new Command(
        '!removeAllRoles',
        '!removeAllRoles',
        'Remove All Roles',
        msg.removeAllRoles[process.env.LANGUAGE],
        this.removeAllRolesAction.bind(controller),
      ),
    ];

    // User roles commands cannot change
    this.disallowedRoles = [
      'admin', 'armada officers', 'armada officer',
      'moderator', 'privateers', 'privateer',
      'tester', 'crew', 'fleet officer', '@everyone',
    ];
  }

  // Lists all roles
  rolesAction() {
    const { message, disallowedRoles } = this;
    const roles = [];
    message.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return roles.push(role.name);
      }
      return role.name;
    });
    return msg.rolesMsg[process.env.LANGUAGE] + roles.join('\n');
  }

  // Adds a role to the user
  addRoleAction() {
    const { message, disallowedRoles } = this;
    const targetRole = message.guild.roles.find('name', message.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', message.parsed[1], 2);
      return '"' + message.parsed[1] + '" ' + msg.addRoleError[process.env.LANGUAGE];
    } else if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return msg.addRoleDenied[process.env.LANGUAGE] + message.parsed[1] + '.';
    } else {
      util.log('Adding Role to user', targetRole.name, 2);
      message.member.addRole(targetRole).catch(util.log);
      return msg.addRoleSuccess[process.env.LANGUAGE] + '"' + targetRole.name + '".';
    }
  }

  // Adds multiple roles to the user
  addRolesAction() {
    const { message, disallowedRoles } = this;
    const roles = message.parsed[1].split(',');
    util.log('Multiple Roles Parsing', roles, 4);

    roles.map((role) => {
      if (!disallowedRoles.includes(role.toLowerCase())) {
        const targetRole = message.guild.roles.find('name', role);
        util.log('Asking API for Role', targetRole, 4);

        if (targetRole === null) {
          return '"' + role + '" ' + msg.addRolesError[process.env.LANGUAGE];
        }
        return message.member.addRole(targetRole).catch(util.log);
      }
      return role.name;
    });

    return msg.addRolesMsgReturn[process.env.LANGUAGE];
  }

  // Removes role from user
  removeRoleAction() {
    const { message, disallowedRoles } = this;
    const targetRole = message.guild.roles.find('name', message.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', message.parsed[1], 2);
      return '"' + message.parsed[1] + '" ' + msg.removeRoleError[process.env.LANGUAGE];
    }
    if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return msg.removeRolesDenied[process.env.LANGUAGE];
    }

    util.log('Removing role from user', targetRole.name, 2);
    message.member.removeRole(targetRole).catch(util.log);
    return targetRole.name + msg.removeRolesMsgReturn[process.env.LANGUAGE];
  }

  // Adds all roles to user
  addAllRolesAction() {
    const { message, disallowedRoles } = this;
    message.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return message.member.addRole(role).catch(util.log);
      }
      return role.name;
    });

    return msg.addAllRolesMsgReturn[process.env.LANGUAGE];
  }

  // Removes all roles from user
  removeAllRolesAction() {
    const { message, disallowedRoles } = this;
    message.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return message.member.removeRole(role).catch(util.log);
      }
      return role.name;
    });

    return msg.removeAllRolesMsgReturn[process.env.LANGUAGE];
  }
}

module.exports = RoleController;
