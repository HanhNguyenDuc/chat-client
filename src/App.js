import React from "react";
import $ from "jquery";
import Messages from "./message-list";
import Input from "./input";
import _map from "lodash/map";
import io from "socket.io-client";

import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    //Khởi tạo state,
    this.state = {
      messages: [{ id: 1, userId: 0, message: "Hello" }],
      user: null,
    };
    this.socket = null;
  }
  //Connetct với server nodejs, thông qua socket.io
  componentWillMount() {
    this.socket = io('127.0.0.1:8000', // cái này để http://apis.aiforce.xyz/, t lười nên để mặc như trên máy :)
      {
        withCredentials: true,
        extraHeaders: {
          // Vứt authtoken vào đây
          Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjEzOTY1MTMxLCJqdGkiOiI1YzVjZWE4MGU2YzQ0Mzc3YmZjZmY0NGZmMTY2MzBiNSIsInVzZXJfaWQiOjEzMn0.ukNT9wTiFgaSbGG_Z82SsdXF73E0tbK-7FzZHF79H6k",
          // RoomID là room trên csdl, ID của room D17 là 2
          RoomID: 2,
        },
      }
    );
    this.socket.on("connect", (res) => {
      console.log("Connected");
    })
    this.socket.on("disconnect",  (res) => {
      console.log("Disconnected - something wrong")
    })
    this.socket.on("id", (res) => this.setState({ user: res })); // lắng nghe event có tên 'id'
    this.socket.on("newMessage", (response) => {
      console.log(response)
      this.newMessage(response);
    }); //lắng nghe event 'newMessage' và gọi hàm newMessage khi có event
  }
  //Khi có tin nhắn mới, sẽ push tin nhắn vào state mesgages, và nó sẽ được render ra màn hình
  newMessage(m) {
    const messages = this.state.messages;
    let ids = _map(messages, "id");
    let max = Math.max(...ids);
    messages.push({
      id: max + 1,
      userId: m.id,
      message: m.data,
    });

    let objMessage = $(".messages");
    if (
      objMessage[0].scrollHeight - objMessage[0].scrollTop ===
      objMessage[0].clientHeight
    ) {
      this.setState({ messages });
      objMessage.animate({ scrollTop: objMessage.prop("scrollHeight") }, 300); //tạo hiệu ứng cuộn khi có tin nhắn mới
    } else {
      this.setState({ messages });
      if (m.id === this.state.user) {
        objMessage.animate({ scrollTop: objMessage.prop("scrollHeight") }, 300);
      }
    }
  }
  //Gửi event socket newMessage với dữ liệu là nội dung tin nhắn
  sendnewMessage(m) {
    if (m.value) {
      // roomID tương tự như cái roomID ở trên
      this.socket.emit("newMessage", {data: m.value, userID: 132, roomID: 2}); //gửi event về server
      m.value = "";
    }
  }

  render() {
    return (
      <div className="app__content">
        <h1>chat box</h1>
        <div className="chat_window">
          <Messages
            user={this.state.user}
            messages={this.state.messages}
            typing={this.state.typing}
          />
          <Input sendMessage={this.sendnewMessage.bind(this)} />
        </div>
      </div>
    );
  }
}
