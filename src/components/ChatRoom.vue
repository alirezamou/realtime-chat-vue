<template>
    <section class="container is-fluid">
        <div class="chat-window">
            <div class="chat-history">
                <div class="chat-message" v-for="(message, i) in messages" :key="i">
                    <div class="chat-message-meta">
                        <p class="timestamp">{{ timeFormat(message.timestamp) }}</p>
                        <p class="user-name">{{ message.name }}</p>
                    </div>
                    <p>{{ message.message }}</p>
                </div>
            </div>
        </div>
        <div class="chat-actions">
            <form @submit.prevent="sendMessage">
                <div class="field has-addons">
                    <p class="control is-expanded">
                        <input class="input" type="text" v-model="chatMessage" placeholder="Your message" />
                    </p>
                    <button type="submit" class="button"><fa-icon icon="fa-solid fa-location-arrow" /></button>
                </div>
            </form>
        </div>
    </section>
</template>

<script>

import { FirebaseDb } from "@/library/Database";
import { ref, child, push, update, onChildAdded } from "firebase/database";
import moment from "moment";

export default {
    name: "ChatRoom",
    created() {
        this.initializeRoom();
    },
    data() {
        return {
            messages: [],
            activeRoom: {
                name: "General",
                slug: "general"
            },
            chatMessage: "",
            unsubscribeRoom: null,
        }
    },
    methods: {
        sendMessage() {
            const newMessage = {
                userId: this.uid,
                name: this.username,
                message: this.chatMessage,
                timestamp: moment().unix(),
            };
            const newMessageKey = push(child(ref(FirebaseDb), "messages/" + this.activeRoom.slug)).key;
            console.log(newMessageKey);
            const updates = {};
            updates["/messages/" + this.activeRoom.slug + "/" + newMessageKey] = newMessage;
            update(ref(FirebaseDb), updates);

            this.chatMessage = "";

        },
        initializeRoom() {
            const messagesRef = ref(FirebaseDb, "messages/" + this.activeRoom.slug);
            onChildAdded(messagesRef, (data) => this.messages.push(data.val()));
        },
        timeFormat(timestamp) {
            return moment.unix(timestamp).format("DD.MM.YYYY HH:mm:ss");
        },
    },
    computed: {
        username() {
            return this.$store.state.username;
        },
        uid() {
            return this.$store.state.uid;
        }
    }
}
</script>

<style scoped>
.chat-window {
    height: calc(100vh - 132px);
}

.chat-history {
    max-height: 100%;
    overflow-y: auto;
}

.chat-message {
    margin-bottom: 1em;
}

.chat-message-meta, .chat-message-meta * {
    float: left;
}

.timestamp {
    margin-right: 0.5em;
    color: #999;
    font-size: 80%;
}

.user-name {
    font-weight: bold;
    margin-right: 1em;
}

.user-name::after {
    content: '\21DD';
    margin-left: 0.5em;
}
</style>