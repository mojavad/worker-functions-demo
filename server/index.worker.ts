import { Database } from "./utils";
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
  const { sql, all, first } = Database(this.DB);
  const ids = (await all(sql`SELECT id FROM tweets`)).results.map(
    (obj: { id: number }) => obj.id
  );

  const randomId = ids[Math.floor(Math.random() * ids.length)];

  const tweet = await first<Tweet>(
    sql`SELECT content, id, timestamp FROM tweets WHERE id=${randomId}`
  );

  return tweet;
}

export async function vote(this: Env, id: number, isPositive: boolean) {
  const { first, run, sql } = Database(this.DB);
  const tweet = await first<ResultTweet>(
    sql`SELECT id, isTrump, correct, incorrect FROM tweets WHERE id=${id}`
  );

  if (!!tweet.isTrump && isPositive) {
    await run(sql`UPDATE tweets SET correct = correct + 1 WHERE id = ${id}`);

    tweet.correct++;
  } else {
    await run(
      sql`UPDATE tweets SET incorrect = incorrect + 1 WHERE id = ${id}`
    );
    tweet.incorrect++;
  }

  return {
    ...tweet,
    userVote: isPositive,
  };
}

// export async function randomVote(this: Env, id: number) {
//   const isPositive = Math.random() > 0.5;

//   return vote.bind(this)(id, isPositive);
// }

export async function getTotalVotes(this: Env) {
  const { first, sql } = Database(this.DB);
  const { correct, incorrect } = await first<{
    correct: number;
    incorrect: number;
  }>(
    sql`SELECT SUM(correct) as correct, SUM(incorrect) as incorrect FROM tweets`
  );

  return correct + incorrect;
}
