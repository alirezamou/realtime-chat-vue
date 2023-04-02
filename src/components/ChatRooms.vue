<template>
    <aside class="menu">
        <p class="menu-label">Rooms</p>

        <ul class="menu-list">
            <li v-for="room in rooms" :key="room.slug">
                <router-link :to="'/chat/' + room.slug" :class="{ 'is-active': selectedChatRoomSlug === room.slug}">
                    {{ room.name }}
                </router-link>
            </li>
        </ul>

        <hr />
        <p v-if="!addingRoom">
            <a @click="addingRoom = true" class="button is-primary">
                <fa-icon icon="fa-solid fa-plus" /> Create new channel
            </a>
        </p>

        <form @submit.prevent="addRoom" v-if="addingRoom">
            <div class="field addons">
                <input
                  type="text"
                  v-model="newRoomName"
                  placeholder="New Room"
                  class="input"
                />
            </div>

            <p class="control">
                <button type="submit" class="button is-success">
                    <fa-icon icon="fa-solid fa-plus" /> Add
                </button>
            </p>
        </Form>
    </aside>
</template>

<script>
import { FirebaseDb } from "@/library/Database";
import { update, ref, onChildAdded, onChildRemoved } from "firebase/database";
import slugify from "slugify";

export default {
    name: "ChatRooms",
    props: {
        selectedChatRoomSlug: {
            type: String,
            required: true,
            default: "general",
        },
    },
    data() {
        return {
            rooms: [
                {
                    name: "General",
                    slug: "general",
                    owner: null,
                }
            ],
            newRoomName: "",
            addingRoom: false,
        };
    },
    computed: {
        uid() {
            return this.$store.state.uid;
        },
    },
    watch: {
        selectedChatRoomSlug(slug, oldSlug) {
            this.$emit("setActiveRoom", this.rooms.find((room) => room.slug === slug),
            this.rooms.find((room) => room.slug === oldSlug));
        },
    },
    methods: {
        addRoom() {
            if(this.newRoomName === "") {
                return;
            }

            let newRoom = {
                name: this.newRoomName,
                slug: slugify(this.newRoomName),
                owner: this.uid,
            };

            const updates = {};
            updates["rooms/" + newRoom.slug] = newRoom;

            const dbRef = ref(FirebaseDb);
            update(dbRef, updates)
            .then(() => this.newRoomName = "");
        },
    },
    created() {
        const roomsRef = ref(FirebaseDb, "rooms/");
        onChildAdded(roomsRef, (snapshot) => {
            this.rooms.push(snapshot.val());

            if(this.selectedChatRoomSlug === snapshot.val().slug)
                this.$emit("setActiveRoom", this.rooms.find((room) => room.slug === snapshot.val().slug));                  
        });

        onChildRemoved(roomsRef, (snapshot) => {
            this.rooms.splice(this.rooms.findIndex(room => room.slug === snapshot.val().slug), 1);
        });

        if(this.selectedChatRoomSlug === "general") {
            this.$emit("setActiveRoom", this.rooms.find((room) => room.slug === this.selectedChatRoomSlug));
        }

    },
}

</script>

<style>
</style>