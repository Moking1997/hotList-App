import React, { Component } from "react";
import {
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Text,
  View,
} from "react-native";
import axios from "axios";
import cheerio from "react-native-cheerio";

import { Ionicons } from "@expo/vector-icons";

const getWeiBo = async () => {
  const res = await axios.get("https://s.weibo.com/top/summary");

  const $ = cheerio.load(res.data);
  const data = $(".td-02 a");
  const hotList = [];
  console.log("长度", data.length);
  //   for (let index = 0; index < data.length; index++) {
  //     const element = data[index];
  //     console.log(element);
  //   }
  //   for (const item of data) {
  // console.log(item);
  //   const url = $(item).attr("href");
  //   const title = $(item).find("span").text();
  //   const heat = $(item).find("span em").text();
  //   hotList.push({
  //     url: "https://s.weibo.com" + url,
  //     title: title.replace(heat + " ", ""),
  //     heat,
  //   });
  //   }
  //   console.log("数据", hotList);
  return [];
  return hotList;
};

const Item = (props) => {
  console.log(props.item);
  return <View />;
  const target = props.item.item.target;
  const index = props.item.index + 1;
  const title = target.titleArea.text;
  const excerpt = target.excerptArea.text;
  const url = target.link.url;
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          props.toggleModal(excerpt, url);
        }}
        style={{
          flexDirection: "row",
          paddingVertical: 20,
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#ececec",
        }}
      >
        <Text
          style={{
            fontSize: 18,
          }}
        >
          {index + ". "}
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const AnswerView = (props) => {
  const list = props.data;
  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      {list.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              paddingVertical: 10,
              borderTopColor: "#111",
              borderTopWidth: 1,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
              }}
            >
              作者:{item.author.name}
            </Text>
            <Text
              style={{
                fontSize: 18,
                marginTop: 10,
              }}
            >
              {item.excerpt}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default class RenderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hotList: [],
      modalVisible: false,
      hotExcerpt: "",
      url: "",
      answerData: [],
    };
  }

  async componentDidMount() {
    const data = await getWeiBo();

    // try {
    //   const data = await getWeiBo();
    //   this.setState({
    //     hotList: data,
    //   });
    // } catch (error) {
    //   console.log("数据错误", error);
    // }
  }
  toggleModal = (excerpt, url = "") => {
    if (excerpt === "") excerpt = "该问题暂无描述";
    this.setState({
      modalVisible: !this.state.modalVisible,
      hotExcerpt: excerpt,
      url: url,
      answerData: [],
    });
  };

  render() {
    const { hotList, modalVisible, hotExcerpt, url, answerData } = this.state;

    const renderItem = (item) => (
      <Item toggleModal={this.toggleModal} item={item} />
    );
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={hotList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <Modal
          animationType="slide"
          visible={modalVisible}
          transparent={true}
          onRequestClose={this.toggleModal}
        >
          <SafeAreaView
            style={{
              flex: 1,
            }}
          >
            <ScrollView
              style={{
                overflow: "hidden",
                flex: 0.8,
                paddingHorizontal: 12,
                paddingTop: 10,
                backgroundColor: "#fff",
                width: Dimensions.get("window").width,
              }}
            >
              <Text style={{ fontSize: 18, lineHeight: 24, fontWeight: "500" }}>
                {hotExcerpt}
              </Text>
              {answerData.length == 0 ? null : <AnswerView data={answerData} />}
            </ScrollView>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFF",
              }}
              onPress={async () => {
                const answerData = await getQuestion(url);
                const list = [];
                for (const key in answerData) {
                  if (Object.prototype.hasOwnProperty.call(answerData, key)) {
                    const element = answerData[key];
                    list.push(element);
                  }
                }
                this.setState({
                  answerData: list,
                });
              }}
            >
              {answerData.length == 0 ? (
                <Text
                  style={{
                    color: "#111",
                    fontSize: 16,
                    borderWidth: 1,
                    padding: 10,
                    paddingHorizontal: 15,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                >
                  加载答案
                </Text>
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFF",
                borderWidth: 1,
              }}
              onPress={this.toggleModal}
            >
              <Ionicons name="close-circle-outline" size={34} color="#666" />
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}
