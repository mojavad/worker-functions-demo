import { Image, StyleSheet, Text, View } from "react-native";
import { worker } from "../App";
import { Pressable } from "./Pressable";

export const VoteButton = ({
  isPositive,
  callback,
}: {
  isPositive: boolean;
  callback: (isPositive: boolean) => void;
}) => (
  <>
    <Pressable
      onPress={() => {
        callback(isPositive);
      }}
    >
      <View
        style={{
          borderRadius: 5,
          borderBottomWidth: 4,
          borderBottomColor: "#0A2236",
          backgroundColor: "#4379A6",

          paddingHorizontal: 20,
          paddingVertical: 16,
          marginRight: isPositive ? 12 : 0,
        }}
      >
        <Text style={styles.text}>{isPositive ? "Trump!" : "Not Trump!"}</Text>
      </View>
    </Pressable>
  </>
);

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "PlayfairDisplaySC_400Regular",
  },
});
