<template>
    <section class="container is-fluid">
        <div class="columns">
            <div class="column is-2">
                <rooms
                  :selectedChatRoomSlug="selectedChatRoomSlug"
                  @setActiveRoom="setActiveRoom"
                />
            </div>
            <div class="column is-8">
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
            </div>
            <div class="column is-2">
                <a @click="signout">
                    <fa-icon icon="fa-solid fa-sign-out-alt" /> Signout
                </a>
                <hr />
                <users :activeRoom="activeRoom" @kicked="kicked" />
            </div>
        </div>
    </section>
</template>

<script>

import { FirebaseDb, FirebaseAuth } from "@/library/Database";
import { ref, child, push, update, onChildAdded } from "firebase/database";
import { signOut } from "firebase/auth";
import moment from "moment";
import ChatRooms from "@/components/ChatRooms.vue";
import ChatRoomUsers from "@/components/ChatRoomUsers.vue";

export default {
    name: "ChatRoom",
    created() {
        this.initializeRoom();
    },
    components: {
        rooms: ChatRooms,
        users: ChatRoomUsers,
    },
    data() {
        return {
            messages: [],
            activeRoom: {},
            chatMessage: "",
            unsubscribeRoom: null,
            selectedChatRoomSlug: this.$route.params.slug,
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
            const updates = {};
            updates["/messages/" + this.activeRoom.slug + "/" + newMessageKey] = newMessage;
            update(ref(FirebaseDb), updates);

            this.chatMessage = "";

        },
        initializeRoom(oldRoom = null) {
            this.messages = [];

            if(oldRoom !== null) {
                this.unsubscribeRoom();
                this.unsubscribeRoom = null;
            }
            
            const messagesRef = ref(FirebaseDb, "messages/" + this.activeRoom.slug);
            this.unsubscribeRoom = onChildAdded(messagesRef, (data) => this.messages.push(data.val()));
        },
        kicked() {
            this.$router.push("/chat/general")
        },
        signout() {
            signOut(FirebaseAuth).then(() => {
                this.$router.push("/");
            })
        },
        setActiveRoom(room, oldRoom) {
            this.activeRoom = room;
            this.initializeRoom(oldRoom);
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
    },
    beforeRouteUpdate(to, _from, next) {
        this.selectedChatRoomSlug = to.params.slug;
        next();
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