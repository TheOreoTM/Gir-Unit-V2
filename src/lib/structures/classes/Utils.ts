import type { GirClient } from '#lib/GirClient';
import * as utils from '#lib/utility';
// import { countlines } from '#lib/utility';

// console.log(countlines('src'), utils.countlines('src'));

export class Utils {
  public countlines = utils.countlines; // utils.countlines doesnt work
  public formatDuration = utils.formatDuration;
  public generateModLogDescription = utils.generateModLogDescription;
  public isAdmin = utils.isAdmin;
  public isGuildOwner = utils.isGuildOwner;
  public isModerator = utils.isModerator;
  public isOwner = utils.isOwner;
  public managable = utils.managable;
  public pickRandom = utils.pickRandom;
  public runAllChecks = utils.runAllChecks;
  public time = utils.time;
  public uid = utils.uid;
  public hours = utils.hours;
  public mins = utils.mins;
  public sec = utils.sec;
  public format = utils.format;
  public summableArray = utils.summableArray;
  public wait = utils.wait;

  public constructor(private readonly client: GirClient) {}

  public get cache() {
    return utils.getCache(this.client);
  }
}
