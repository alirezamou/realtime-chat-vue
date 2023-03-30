import { createStore } from "vuex";

const store = createStore({
  state: {
    loggedIn: false,
    uid: "",
    email: "",
    username: "",
  },
  mutations: {
    SET_LOGGEDIN: (state, { uid, email }) => {
      state.loggedIn = true;
      state.uid = uid;
      state.email = email;
    },
    SET_USERNAME: (state, username) => {
      state.username = username;
    },
  },
});

export default store;
