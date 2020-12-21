<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Username</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody :key="user._id" v-for="user in users">
        <tr>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.username }}</td>
          <td>
            <button
              class="btn btn-danger"
              @click="removeUser(user._id)"
              v-on:fetchUsers="getUsers()"
            >
              DELETE
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { isAtuhenticated } from "./helper";
import VueSimpleAlert from "vue-simple-alert";
export default {
  name: "Users",
  data() {
    return {
      users: []
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      const { token } = isAtuhenticated();
      return fetch("http://localhost:8000/users", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          this.users = data;
        })
        .catch(error => console.log(error));
    },
    removeUser(id) {
      const { user } = isAtuhenticated();
      if (user._id === id) {
        return this.$fire({
          title: "Error",
          text: "Loggedin user can not be deleted",
          type: "error",
          timer: "1500"
        });
      }
      this.$confirm("Are you sure you want to delete the user").then(() => {
        return fetch(`http://localhost:8000/remove/${id}`, {
          method: "DELETE",
          headers: {
            accept: "application/json",
            "Content-type": "application/json"
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              return alert(data.error);
            }
            this.$emit("fetchUsers", this.getUsers());
          })
          .catch(error => console.log(error));
      });
    }
  }
};
</script>

<style></style>
