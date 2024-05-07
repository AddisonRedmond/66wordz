import { User } from "@prisma/client";

export const isPremiumUser = (user: User) => {
  if (!user?.currentPeriodEnd) return false;
  return user.currentPeriodEnd > Date.now() / 1000;
};

export const hasBeen24Hours = (user: User) => {
  // check if time stamp is null
  if (!user?.freeGameTimeStamp) {
    return true;
  }

  const twentyFourHoursInMillis = 24 * 60 * 60; // 24 hours in milliseconds
  const currentTime = Date.now() / 1000; // Current time in milliseconds since Unix epoch

  // Calculate the difference between current time and provided timestamp
  const timeDifference = currentTime - user.freeGameTimeStamp;

  // Check if the time difference is greater than or equal to 24 hours
  return timeDifference >= twentyFourHoursInMillis;
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

export const getRemaningGames = (user: User) => {
  if (hasBeen24Hours(user)) {
    return 3;
  }
  return 3 - user.freeGameCount;
};
