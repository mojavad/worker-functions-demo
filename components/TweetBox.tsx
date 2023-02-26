import { Image, Text, View } from "react-native";

export const TweetBox = ({
  tweet,
  timestamp,
}: {
  tweet: string;
  timestamp: string;
}) => (
  <>
    <View
      style={{
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#eee",
        backgroundColor: "#ffffff",
        width: "100%",
        marginVertical: 32,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 5,
        maxWidth: 500,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../assets/profilePic.jpg")}
          style={{ borderRadius: 50, marginRight: 16, width: 50, height: 50 }}
        />
        <View style={{ width: "100%", flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginRight: 4,
              }}
            >
              Donald J Trump
            </Text>
            <Image
              source={require("../assets/veri.jpeg")}
              style={{ width: 14, height: 14, marginRight: 4 }}
            />
          </View>
          <Text
            style={{
              fontSize: 14,
              color: "#536471",
            }}
          >
            @realDonaldTrump
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 16, marginTop: 12 }}>{tweet}</Text>
      <Text
        style={{
          marginTop: 12,
          fontSize: 14,
          color: "#536471",
        }}
      >
        {timestamp}
      </Text>
    </View>
  </>
);
