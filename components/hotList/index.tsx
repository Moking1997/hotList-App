import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import ZhiHu from "./ZhiHu";
import WeiBo from "./WeiBo";

const initialLayout = { width: Dimensions.get("window").width };

export default function TabViewExample() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "ZhiHu", title: "知乎" },
    { key: "WeiBo", title: "微博" },
  ]);

  const renderScene = SceneMap({
    ZhiHu: ZhiHu,
    WeiBo: WeiBo,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
