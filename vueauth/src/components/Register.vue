<template>
  <div class="container">
    {{ msg }}
    <form class="form">
      <div class="form-group">
        <label for="name">Enter Your Name</label>
        <input type="text" name="name" class="form-control" v-model="name" />
      </div>
      <div class="form-group">
        <label for="name">Enter Your Email</label>
        <input type="email" name="email" class="form-control" v-model="email" />
      </div>
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
          value="Register"
          class="btn btn-success"
          @click="handleSubmit"
        />
      </div>
    </form>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
export default {
  name: "Register",
  data() {
    return {
      name: "",
      email: "",
      username: "",
      password: "",
      msg: ""
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.msg = "LOADING";
      const data = {
        name: this.name,
        email: this.email,
        username: this.username,
        password: this.password
      };
      return fetch("http://localhost:8000/register", {
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
            console.log(data);
            this.msg = data.error;
          } else {
            (this.name = ""),
              (this.email = ""),
              (this.password = ""),
              (this.username = "");
            this.msg = "Registration Successful";
          }
        })
        .catch(error => console.log(error));
    }
  }
};
</script>
