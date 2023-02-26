import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "./Pressable";

export const GenericButton = ({
  callback,
  text,
  disabled,
}: {
  callback: () => void;
  text: string;
  disabled: boolean;
}) => (
  <>
    <Pressable onPress={callback} disabled={disabled}>
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
        <Text style={styles.text}>{text}</Text>
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
