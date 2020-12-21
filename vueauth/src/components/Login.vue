<template>
  <div class="container">
    {{ msg }}
    <form class="form">
      <div class="form-group">
        <label for="name">Enter Your Username</label>
        <input
          type="text"
          name="username"
          class="form-control"
          v-model="username"
        />
      </div>
      <div class="form-group">
        <label for="name">Enter Your Password</label>
        <input
          type="password"
          name="password"
          class="form-control"
          v-model="password"
        />
      </div>
      <div>
        <input
          type="submit"
          value="Login"
          class="btn btn-success"
          @click="handleSubmit"
        />
      </div>
    </form>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { authenticate, isAtuhenticated } from "./helper";
export default {
  name: "Login",
  props: ["user"],
  data() {
    return {
      username: "bhumit070",
      password: "password",
      msg: ""
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.msg = "LOADING";
      const data = {
        username: this.username,
        password: this.password
      };
      return fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            return (this.msg = data.error);
          } else {
            authenticate(data, () => {
              (this.password = ""), (this.username = "");
            });
            this.msg = "Login Successful";
            this.$router.push("/");
          }
        })
        .catch(error => console.log(error));
    }
  }
};
</script>
