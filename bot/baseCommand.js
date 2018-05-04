class BaseCommand {
  constructor(
    command, example, title, description,
    action, reaction, responseType = null,
    adminOnly = false, showWithHelp = true, allowInDM = false,
  ) {
    this.command = command;
    this.example = example;
    this.title = title;
    this.description = description;
    this.showWithHelp = showWithHelp;
    this.allowInDM = allowInDM;
    this.adminOnly = adminOnly;
    this.responseType = responseType;
    this.action = action;
    this.reaction = reaction;
  }
}
module.exports = BaseCommand;
