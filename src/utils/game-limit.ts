import { User } from "@prisma/client";

export const isPremiumUser = (user: User) => {
  if (user.currentPeriodEnd === null) return false;
  return user.currentPeriodEnd > Date.now() / 1000;
};

export const hasBeen24Hours = (user: User) => {
  return user.freeGameTimeStamp && user.freeGameTimeStamp <= Date.now() / 1000;
};

export const hasMoreFreeGames = (user: User) => {
  // check if users last timestamp was greater than 24 hours ago
  if (user.freeGameCount >= 3) {
    return false;
  }
  return true;

  // if so, reset the timestamp to today at 12:00am

  // if its not, check free game count
};
