import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "./Pressable";

export const RefreshButton = ({ callback }: { callback: () => void }) => (
  <>
    <Pressable onPress={callback}>
      <View
        style={{
          borderRadius: 5,
          borderBottomWidth: 4,
          borderBottomColor: "#0A2236",
          backgroundColor: "#4379A6",

          paddingHorizontal: 20,
          paddingVertical: 16,
          marginTop: 16,
        }}
      >
        <Text style={styles.text}>Refresh</Text>
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
