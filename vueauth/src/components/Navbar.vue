<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Navbar</a>
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link to="/" class="nav-link"> Home </router-link>
      </li>
      <li v-if="user" class="nav-item">
        <router-link to="/users" class="nav-link">
          Users
        </router-link>
      </li>
      <li v-if="user === undefined" class="nav-item">
        <router-link to="/register" class="nav-link"> Register </router-link>
      </li>
      <li v-if="user === undefined" class="nav-item">
        <router-link class="nav-link" to="/login"> Login </router-link>
      </li>
      <li v-on:click="logout" v-if="user">
        <router-link to="/" class="nav-link">
          Logout
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { isAtuhenticated } from "./helper";
import { mapGetters, mapActions } from "vuex";
const { user } = isAtuhenticated();
export default {
  name: "Navbar",
  data() {
    return {
      // user
    };
  },
  methods: {
    ...mapGetters(["getUser"]),
    ...mapActions(["updateUser", "setUser"]),
    logout() {
      return fetch("http://localhost:8000/logout", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          this.updateUser(undefined);
          localStorage.removeItem("jwt");
        })
        .catch(error => console.log(error));
    },
    setuser() {
      const user = isAtuhenticated();
      if (user !== undefined && user !== false) {
        return this.setUser(user);
      }
    }
  },
  created() {
    this.setuser();
  },
  computed: {
    user() {
      return this.getUser();
    }
  }
};
</script>

<style></style>
