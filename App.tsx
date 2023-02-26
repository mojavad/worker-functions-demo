import { StyleSheet, Text, View } from "react-native";
import {
  useFonts,
  PlayfairDisplaySC_700Bold,
  PlayfairDisplaySC_400Regular,
} from "@expo-google-fonts/playfair-display-sc";
import { Header } from "./components/Header";
import { TweetBox } from "./components/TweetBox";
import { VoteButton } from "./components/VoteButton";
import { WorkerClient } from "worker-functions";
import { useCallback, useEffect, useState } from "react";
import { WorkerTypeFns } from "worker-functions/generated-client/type-gen";

export const worker = WorkerClient("http://192.168.1.62:8787");

export default function App() {
  const [tweet, setTweet] = useState<Awaited<
    ReturnType<WorkerTypeFns["getRandomTweet"]>
  > | null>(null);

  const [totalVotes, setTotalVotes] = useState<Awaited<
    ReturnType<WorkerTypeFns["getTotalVotes"]>
  > | null>(null);

  const [voteResults, setVoteResults] = useState<Awaited<
    ReturnType<WorkerTypeFns["vote"]>
  > | null>(null);

  useEffect(() => {
    const getTweet = async () => {
      const data = await worker.getRandomTweet();
      setTweet(data);
    };
    getTweet();
  }, [setTweet]);

  useEffect(() => {
    const getTotal = async () => {
      const data = await worker.getTotalVotes();
      setTotalVotes(data);
    };
    getTotal();
    const interval = setInterval(getTotal, 5000);

    return () => clearInterval(interval);
  }, [setTotalVotes]);

  const vote = useCallback(
    (isPositive: boolean) => {
      const vote = async () => {
        const data = await worker.vote(tweet?.id, isPositive);
        setVoteResults(data);
      };
      vote();
    },
    [setVoteResults, tweet]
  );

  const voteProportions = voteResults
    ? voteResults.correctVotes / voteResults.total
    : null;
  const resultColor =
    voteProportions > 0.75
      ? "#4caf50"
      : voteProportions > 0.25
      ? "#000000"
      : "#F44336";

  let [fontsLoaded] = useFonts({
    PlayfairDisplaySC_700Bold,
    PlayfairDisplaySC_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header />
      <TweetBox tweet={tweet?.tweet} timestamp={tweet?.timestamp} />

      {voteResults === null ? (
        <View style={{ flexDirection: "row" }}>
          <VoteButton isPositive={true} callback={vote} />
          <VoteButton isPositive={false} callback={vote} />
        </View>
      ) : (
        <>
          <Text style={{ fontFamily: "PlayfairDisplaySC_700Bold" }}>
            {voteResults.userVote === voteResults.isTrump
              ? "You guessed correctly! 🎉"
              : "Sorry, wrong guess. 👎"}
          </Text>
          <Text
            style={{
              color: resultColor,
              fontFamily: "PlayfairDisplaySC_400Regular",
            }}
          >
            {`${Math.round(
              voteProportions * 100
            )}% of users guessed correctly.`}
          </Text>
        </>
      )}
      <View style={{ marginTop: 100 }}>
        {totalVotes && (
          <Text style={{ fontFamily: "PlayfairDisplaySC_400Regular" }}>
            Total Votes:{" "}
            <Text style={{ fontFamily: "PlayfairDisplaySC_700Bold" }}>
              {totalVotes}
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  header: {
    fontSize: 32,
  },
});
