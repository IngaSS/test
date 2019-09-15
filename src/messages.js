export default {
    state: {
        messages: [],
        cuid: null,
        connectionError: false
    },
    mutations: {
        updateMessages(state, item) {
            state.messages.push(item);
        },

        setAllMessages(state, messages) {
            state.messages = messages;
        },

        updateCUID(state, cuid) {
            state.cuid = cuid;
        },

        setConnectionError(state, errorStatus) {
            state.connectionError = errorStatus;
        },

        cleanChat(state) {
            localStorage.removeItem("messages");
        }
    },
    actions: {
        sendMessage(context, message) {
            context.commit('updateMessages', { message: message, mine: true });

            const cuid = this.state.messages.cuid;
            fetch(config.REQUEST_CHAT_URL, { method: 'POST', body: JSON.stringify({ cuid: cuid, text: message }) })
                .then(response => response.json())
                .then(response => {
                    context.commit('updateMessages', { message: response.result.text.value, mine: false });
                    this.dispatch('setCuid', response.result.cuid);
                })
        },

        cleanChat(context) {
            context.commit('cleanChat');
        },

        chatInit(context) {
            const cuidPresent = this.state.messages.cuid;
            const body = { uuid: config.INFA_UUID };
            if (cuidPresent) {
                body.cuid = cuidPresent;
            }
            fetch(config.INIT_CHAT_URL, { method: 'POST', body: JSON.stringify(body) })
                .then(response => response.json())
                .then(body => this.dispatch('setCuid', body.result.cuid))
                .catch(() => context.commit('setConnectionError', true));
        },

        setCuid(context, cuid) {
            context.commit('updateCUID', cuid)
        },

        findCuid(context) {
            const localCuid = localStorage.getItem('cuid');
            if (localCuid) {
                this.dispatch('setCuid', localCuid)
            }
        },

        loadMessageHistory(context) {
            const localMessages = localStorage.getItem("messages");
            if (localMessages) {
                try {
                    context.commit('setAllMessages', JSON.parse(localMessages));
                } catch (e) {
                    localStorage.removeItem("messages");
                }
            }
        }
    },
    getters: {
        MESSAGES(state) {
            return state.messages;
        },

        connectionError(state) {
            return state.connectionError;
        }
    }
}