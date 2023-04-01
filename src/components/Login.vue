<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div class="column is-4 is-offset-4" v-if="page === 'login'">
                    <h1 class="title has-grey">Login</h1>
                    <div class="box">
                        <Form @submit="login">
                            <div class="field">
                                <div class="control">
                                    <Field
                                      name="email"
                                      type="email"
                                      class="input"
                                      v-model="email"
                                      placeholder="Your@email.address"
                                      autofocus
                                      :rules="validateEmail"
                                    />
                                </div>
                                <ErrorMessage name="email" class="help is-danger" />
                            </div>

                            <div class="field">
                                <div class="control">
                                    <Field
                                      name="password"
                                      type="password"
                                      class="input"
                                      v-model="password"
                                      placeholder="Your password"
                                      :rules="validatePassword"
                                    />
                                </div>
                                <ErrorMessage name="password" class="help is-danger" />
                            </div>

                            <p class="help is-danger" v-if="loginError">{{ loginError }}</p>

                            <button type="submit" class="button is-info is-block is-fullwidth">Login</button>
                        </form>
                    </div>
                    
                    <p class="has-text-grey">
                        <a @click="page = 'signup'">Signup</a>
                    </p>
                </div>

                <div v-if="page === 'signup'" class="column is-4 is-offset-4">
                    <h1 class="title has-text-grey">Signup</h1>
                    <div class="box">
                        <Form @submit="signup">
                            
                            <div class="field">
                                <div class="control">
                                    <Field
                                      name="email"
                                      type="email"
                                      class="input"
                                      v-model="email"
                                      placeholder="Your@email.address"
                                      :rules="validateEmail"
                                    />
                                </div>
                                <ErrorMessage name="email" class="help is-danger" />
                            </div>

                            <div class="field">
                                <div class="control">
                                    <Field
                                      name="username"
                                      type="text" 
                                      class="input" 
                                      v-model="username" 
                                      placeholder="Your fancy username"
                                      :rules="validateUsername"
                                    />
                                </div>
                                <ErrorMessage name="username" class="help is-danger" />
                            </div>

                            <div class="field">
                                <div class="control">
                                    <Field
                                      name="password"
                                      type="password" 
                                      class="input" 
                                      v-model="password" 
                                      placeholder="Your password"
                                      :rules="validatePassword"
                                    />
                                </div>
                                <ErrorMessage name="password" class="help is-danger" />
                            </div>

                            <p class="help is-danger" v-if="loginError">{{ loginError }}</p>

                            <button class="button is-info is-fullwidth is-block">Signup</button>
                        </Form>
                    </div>

                    <p class="has-text-grey">
                        <a @click="page = 'login'">Login</a>
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { FirebaseDb, FirebaseAuth } from "@/library/Database";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { ref, set, get, child } from "firebase/database";

import { Form ,Field, ErrorMessage } from "vee-validate";

export default {
    name: "Login",
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        return {
            page: "signup",
            email: "",
            password: "",
            username: "",
            loginError: "",
        };
    },
    methods: {
        login() {
            signInWithEmailAndPassword(FirebaseAuth, this.email, this.password)
            .catch(error => this.loginError = error.message);

        },
        signup() {
            createUserWithEmailAndPassword(FirebaseAuth, this.email, this.password)
            .then((data) => {
                set(ref(FirebaseDb, "users/" + data.user.uid), {
                    name: this.username
                });
            })
            .catch(() => this.loginError = "Unable to signup");
        },
        validateEmail(value) {
            if (!value) {
              return 'Please enter your email address';
            }
        
            const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            if (!regex.test(value)) {
              return 'This field must be a valid email';
            }
        
            return true;
        },
        validateUsername(value) {
            if(!value) return "Please enter your username";

            return true;
        },
        validatePassword(value) {
            if(!value) return "Please enter your password";

            if(value.length < 6) return "Password must be at least 6 character long";

            return true;
        }
    },
    created() {

        onAuthStateChanged(FirebaseAuth, (user) => {
            if(user) {
                this.$store.commit("SET_LOGGEDIN", { uid: user.uid, email: user.email });

                const dbRef = ref(FirebaseDb);

                get(child(dbRef, "users/" + user.uid)).then((data) => {
                    if(data?.val()) {
                        this.$store.commit("SET_USERNAME", data.val().name);
                    } else {
                        this.$store.commit("SET_USERNAME", "without username");
                    }

                    this.$router.push("/chat");
                });
            }
        })

    }
}
</script>

<style>
    
</style>