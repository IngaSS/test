<template>
  <div class="fieldWrapper">
    <div class="header">
      <div class="info">
        <h3 class="name">Виджет</h3>
        <div class="icon">
          <img src="https://img.icons8.com/color/96/000000/zatanna.png" />
        </div>
      </div>
    </div>
    <p v-if="connectionError">Что-то пошло не так, обратитесь к администратору</p>
    <div id="scroll">
      <div class="chatContent">
        <p
          v-for=" i of messages"
          :key="i.index"
          :style="[i.mine ? styles.mine : styles.other]"
          v-html="i.message"
        />
        <div class="anchor" ref="anchor"></div>
      </div>
    </div>
    <div class="textInput">
      <button class="reloadBtn" @click="cleanChat()">
        <img src="https://img.icons8.com/color/50/000000/replace.png" />
      </button>
      <textarea
        type="text"
        class="messInput"
        v-model="message"
        placeholder="Введите сообщение"
        v-on:keyup.enter="sendMessage(message)"
      />
      <button class="postBtn" @click="sendMessage(message)" :disabled="connectionError">
        <img src="https://img.icons8.com/color/50/000000/filled-sent.png" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageField",
  data: () => ({
    message: null,
    styles: {
      mine: {
        background:
          "linear-gradient(0deg, rgba(34,195,69,0.7707457983193278) 0%, rgba(45,253,181,0.24693627450980393) 100%)",
        margin: "1vw 1vw 1vw 29vw"
      },
      other: {
        background:
          "linear-gradient(0deg, rgba(34,170,195,0.7707457983193278) 0%, rgba(45,203,253,0.24693627450980393) 100%)",
        margin: "1vw 29vw 1vw 1vw"
      }
    }
  }),
  computed: {
    messages() {
      return this.$store.getters.MESSAGES;
    },
    connectionError() {
      return this.$store.getters.connectionError;
    }
  },

  mounted() {
    this.$store.dispatch("findCuid");
    this.$store.dispatch("chatInit");
    this.$store.dispatch("loadMessageHistory");
  },

  updated() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "updateMessages") {
        localStorage.setItem(
          "messages",
          JSON.stringify(state.messages.messages)
        );
      }
      if (mutation.type === "updateCUID") {
        localStorage.setItem("cuid", state.messages.cuid);
      }
    });

    this.$refs.anchor.scrollIntoView();
  },

  methods: {
    sendMessage(item) {
      if (item !== null && item.trim() !== "") {
        this.$store.dispatch("sendMessage", item);
      }
      this.message = null;
    },

    cleanChat() {
      this.$store.dispatch("cleanChat");
      if (this.messages.length) {
        this.messages.splice(0);
      }
    }
  }
};
</script>

<style>
.header {
  height: 10vw;
  background-color: lightblue;
  display: flex;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

::-webkit-scrollbar {
  width: 0.7vw;
  height: 0.3vw;
}
::-webkit-scrollbar-button {
  background-color: rgb(84, 168, 236, 0.5);
}
::-webkit-scrollbar-track {
  background-color: rgb(84, 168, 236, 0.2);
}
::-webkit-scrollbar-track-piece {
  background-color: rgb(84, 168, 236, 0.2);
}
::-webkit-scrollbar-thumb {
  height: 5vw;
  background-color: rgb(84, 168, 236, 0.5);
  border-radius: 3px;
}
::-webkit-scrollbar-corner {
  background-color: #999;
}
::-webkit-resizer {
  background-color: #666;
}

.icon {
  height: 7vw;
  width: 7vw;
  float: right;
  border-radius: 10vw;
  margin: auto 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.icon img {
  max-width: 6.5vw;
  padding: 0.2vw;
}

.name {
  width: 29vw;
  text-align: left;
  line-height: 3;
  font-family: "Lato", sans-serif;
  color: rgba(0, 0, 0, 0.8);
}

.info {
  display: flex;
  width: 94%;
  margin: 0 auto;
  justify-content: space-between;
}

.fieldWrapper {
  width: 50vw;
  height: 45vw;
  border: 0.09vw solid darkgray;
  border-radius: 0.4vw;
  margin: auto;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  background-image: url(../img/test-back.jpg);
}

.textInput {
  width: 100%;
  min-height: 5vw;
  background-color: rgb(242, 250, 250, 0.9);
  display: flex;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.chatContent {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100%;
}

.chatContent p {
  max-width: 100%;
  min-height: 1vw;
  border-radius: 1vw;
  padding-left: 1.5vw;
  padding-top: 0.5vw;
  padding-bottom: 0.5vw;
  padding-right: 1vw;
  text-align: justify;
}

.messInput {
  width: 60%;
  background-color: transparent;
  border: none;
  padding-top: 0.9vw;
}

.reloadBtn {
  width: 20%;
  background-color: transparent;
  outline: none;
  border: none;
}

.reloadBtn img {
  width: 3vw;
}

.postBtn {
  width: 20%;
  width: 20%;
  background-color: transparent;
  border: none;
}

.postBtn img {
  width: 3vw;
}

#scroll {
  overflow-y: auto;
  height: 40vw;
}

@media (min-width: 500px) and (max-width: 850px) {
  .name {
    line-height: 1.5;
  }

  .fieldWrapper {
    width: 100%;
    height: 100%;
  }
}

@media (min-width: 320px) and (max-width: 500px) {
  .fieldWrapper {
    width: 100%;
    height: 100%;
  }

  #scroll {
    overflow-y: auto;
    height: 100%;
  }

  .header {
    height: 20vw;
  }

  .name {
    line-height: 1;
  }

  .icon {
    height: 15vw;
    width: 15vw;
  }

  .icon img {
    max-width: 12.5vw;
    padding: 1.3vw;
  }

  .textInput {
    min-height: 20vw;
    border-radius: 2vw;
  }

  .reloadBtn img {
    width: 9vw;
  }

  .postBtn img {
    width: 9vw;
  }

  .messInput {
    padding-top: 5.9vw;
  }
}
</style>