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
import { GenericButton } from "./components/RefreshButton";

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

  const [disabled, setDisabled] = useState(true);

  const vote = useCallback(
    async (isPositive: boolean) => {
      setDisabled(true);
      getTotal();
      const data = await worker.vote(tweet?.id, isPositive);
      setVoteResults(data);
      setDisabled(false);
    },
    [setVoteResults, tweet]
  );

  // const voteRandom = useCallback(async () => {
  //   setDisabled(true);
  //   getTotal();
  //   const data = await worker.randomVote(tweet?.id);
  //   setVoteResults(data);
  //   setDisabled(false);
  // }, [setVoteResults, tweet]);

  const refreshTweet = useCallback(async () => {
    setDisabled(true);
    const data = await worker.getRandomTweet();
    setTweet(data);
    setVoteResults(null);
    setDisabled(false);
  }, [setTweet, setVoteResults]);

  const getTotal = useCallback(async () => {
    const data = await worker.getTotalVotes();
    setTotalVotes(data);
  }, [setTotalVotes]);

  useEffect(() => {
    refreshTweet();
  }, [refreshTweet]);

  useEffect(() => {
    getTotal();
    const interval = setInterval(getTotal, 5000);

    return () => clearInterval(interval);
  }, [getTotal]);

  const voteProportions = voteResults
    ? voteResults.correct / (voteResults.correct + voteResults.incorrect)
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
      <TweetBox tweet={tweet?.content} timestamp={tweet?.timestamp} />

      {voteResults === null ? (
        <>
          <View style={{ flexDirection: "row" }}>
            <VoteButton isPositive={true} callback={vote} disabled={disabled} />
            <VoteButton
              isPositive={false}
              callback={vote}
              disabled={disabled}
            />
          </View>
          {/* <GenericButton
            text={"I'm feelin' lucky!"}
            callback={voteRandom}
            disabled={disabled}
          /> */}
        </>
      ) : (
        <>
          <Text style={{ fontFamily: "PlayfairDisplaySC_700Bold" }}>
            {voteResults.userVote === !!voteResults.isTrump
              ? "You guessed correctly! ????"
              : "Sorry, wrong guess. ????"}
          </Text>
          <Text style={{ fontFamily: "PlayfairDisplaySC_700Bold" }}>
            {!!voteResults.isTrump
              ? `This was the Donald.`
              : `The Donald wouldn't say that!`}
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
          <GenericButton
            text="Refresh"
            callback={refreshTweet}
            disabled={disabled}
          />
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
