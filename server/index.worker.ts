export const getRandomTweet = () => {
  return {
    id: "sdjhkfsdjfhsfjhsdkjfjksd",
    tweet:
      "Despite baby jesus eating a soul of a democrat, I did not find myself compelled to vote for Barack Obama.",
    timestamp: "12:08 PM - 1 Dec 2019",
  };
};

export const vote = (id: string, isPositive: boolean) => {
  return {
    id,
    isTrump: true,
    userVote: isPositive,
    correctVotes: 20,
    total: 21,
  };
};

export const getTotalVotes = () => {
  return 70;
};
