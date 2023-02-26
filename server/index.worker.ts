interface Env {
  DB: D1Database;
}

interface Tweet {
  content: string;
  id: number;
  timestamp: string;
}

interface ResultTweet extends Tweet {
  isTrump: number;
  correct: number;
  incorrect: number;
}

export async function getRandomTweet(this: Env) {
  const ids = (
    await this.DB.prepare("SELECT id FROM tweets").all()
  ).results.map((obj: { id: number }) => obj.id);

  const randomId = ids[Math.floor(Math.random() * ids.length)];

  const tweet = (await this.DB.prepare(
    "SELECT content, id, timestamp FROM tweets WHERE id=?"
  )
    .bind(randomId)
    .first()) as Tweet;

  return tweet;
}

export async function vote(this: Env, id: number, isPositive: boolean) {
  const tweet = (await this.DB.prepare(
    "SELECT id, isTrump, correct, incorrect FROM tweets WHERE id=?"
  )
    .bind(id)
    .first()) as ResultTweet;

  if (!!tweet.isTrump && isPositive) {
    await this.DB.prepare(
      "UPDATE tweets SET correct = correct + 1 WHERE id = ?"
    )
      .bind(id)
      .run();

    tweet.correct++;
  } else {
    await this.DB.prepare(
      "UPDATE tweets SET incorrect = incorrect + 1 WHERE id = ?"
    )
      .bind(id)
      .run();

    tweet.incorrect++;
  }

  return {
    ...tweet,
    userVote: isPositive,
  };
}

export async function getTotalVotes() {
  const { correct, incorrect } = (await this.DB.prepare(
    "SELECT SUM(correct) as correct, SUM(incorrect) as incorrect FROM tweets"
  ).first()) as { correct: number; incorrect: number };

  return correct + incorrect;
}
