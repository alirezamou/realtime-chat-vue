<template>
    <aside class="menu">
        <p class="label-menu">Online now</p>

        <ul class="menu-list">
            <li v-for="user in users" :key="user.uid">
                <p>
                    {{ user.name }}
                    <fa-icon icon="fa-solid fa-crown" v-if="isOwner(user.uid)" />
                    
                    <span class="is-pulled-right" v-if="isOwner(uid) && uid !== user.uid">
                        <a class="is-pulled-left" @click="kickUser(user)">
                            <fa-icon icon="fa-solid fa-times-circle" />
                        </a>
                    </span>
                </p>
            </li>
        </ul>
    </aside>
</template>

<script>
import { FirebaseDb } from "@/library/Database";
import { ref, child, remove, update, onDisconnect, onChildAdded, onChildRemoved } from "firebase/database";

export default {
    props: {
        activeRoom: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            users: [],
            turnOffAddingChildListener: null,
            turnOffRemovingChildListener: null,
        };
    },
    computed: {
        username() {
            return this.$store.state.username;
        },
        uid() {
            return this.$store.state.uid;
        },
    },
    watch: {
        activeRoom(room, oldRoom) {
            this.changeRoom(room, oldRoom);
        },
    },
    methods: {
        changeRoom(room, oldRoom = null) {
            this.users = [];

            const dbRef = ref(FirebaseDb);
            if(oldRoom.slug !== undefined) {

                // remove the listeners of the old room
                this.turnOffAddingChildListener();
                this.turnOffAddingChildListener = null;
                this.turnOffRemovingChildListener();
                this.turnOffRemovingChildListener = null;

                // remove ourself from the old room
                remove(child(dbRef, "users_rooms/" + oldRoom.slug + "/" + this.uid));
            }

            const updates = {};
            updates["/users_rooms/" + room.slug + "/" + this.uid] = {
                name: this.username,
                uid: this.uid,
            };
            update(dbRef, updates);

            onDisconnect(ref(FirebaseDb, "users_rooms/" + room.slug + "/" + this.uid)).remove();

            this.turnOffAddingChildListener = onChildAdded(ref(FirebaseDb, "users_rooms/" + room.slug), (snapshot) => {
                this.users.push({
                    name: snapshot.val().name,
                    uid: snapshot.val().uid,
                });
            });

            this.turnOffRemovingChildListener = onChildRemoved(ref(FirebaseDb, "users_rooms/" + room.slug), (snapshot) => {
                this.users.splice(this.users.findIndex((user) => user.uid === snapshot.val().uid), 1);

                if(snapshot.val().uid = this.uid) {
                    this.$emit("kicked");
                }
            });
        },
        isOwner(uid) {
            return this.activeRoom.owner === uid;
        },
        kickUser(user) {
            remove(child(ref(FirebaseDb), "users_rooms/" + this.activeRoom.slug + "/" + user.uid));
        }
    }
}

</script>

<style>
</style>